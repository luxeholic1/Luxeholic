import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Search, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ImageCursorCard from "@/components/ImageCursorCard";
import SEO from "@/components/SEO";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { fetchStoreCategories, fetchStoreProducts, fetchStoreProductsPage, mapStoreProductToLocalProduct } from "@/services/store-api";
import type { Product } from "@/data/products";
import { scoreTextMatch } from "@/lib/smart-search";
import { filterVisibleCategories } from "@/lib/visible-categories";

const PAGE_SIZE = 72; // denser shop pages

type CategoryFilter = { id: number; name: string; slug: string; count: number };
type PriceRange = "all" | "under-100" | "100-500" | "500-1000" | "1000-plus";

const PRICE_RANGES: Array<{ value: PriceRange; label: string; test: (price: number) => boolean }> = [
  { value: "all", label: "All prices", test: () => true },
  { value: "under-100", label: "Under 100", test: (price) => price < 100 },
  { value: "100-500", label: "100 to 500", test: (price) => price >= 100 && price <= 500 },
  { value: "500-1000", label: "500 to 1,000", test: (price) => price > 500 && price <= 1000 },
  { value: "1000-plus", label: "1,000+", test: (price) => price > 1000 },
];

function categoryFilterPriority(category: CategoryFilter) {
  const text = `${category.slug || ""} ${category.name || ""}`.toLowerCase();
  if (/mobile|charger|cable|adapter|phone|case|screen|protector|airpods|earbud|headphone/.test(text)) return 0;
  if (/smart|wear|watch|glasses|wearable/.test(text)) return 1;
  if (/audio|speaker|electronics|projector|tv|vr|ar|dji|insta|drone|camera/.test(text)) return 2;
  if (/security|cctv|surveillance|alarm/.test(text)) return 3;
  if (/outdoor|sport|camping|bicycle|fishing/.test(text)) return 4;
  if (/home|garden/.test(text)) return 5;
  return 8;
}

function sortCategoryFilters(a: CategoryFilter, b: CategoryFilter) {
  return categoryFilterPriority(a) - categoryFilterPriority(b)
    || b.count - a.count
    || a.name.localeCompare(b.name);
}

// ─── Smart search engine ──────────────────────────────────────────────────────
function tokenise(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) || [];
}
function wordMatchesToken(qw: string, pt: string): boolean {
  return /^\d+$/.test(qw) ? pt === qw : pt.startsWith(qw);
}
function allWordsInTokens(words: string[], tokens: string[]): boolean {
  return words.every(w => tokens.some(t => wordMatchesToken(w, t)));
}
// ─── Levenshtein distance ─────────────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({length: m+1}, (_, i) =>
    Array.from({length: n+1}, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

// Returns true if queryWord fuzzy-matches any token in the product tokens
function fuzzyWordMatchesAnyToken(qw: string, tokens: string[]): boolean {
  const maxDist = qw.length >= 4 ? 1 : 0; // allow 1 typo for words 4+ chars
  return tokens.some(t => levenshtein(qw, t) <= maxDist);
}

function scoreProduct(product: Product, q: string, words: string[]): number {
  const name = product.name.toLowerCase();
  const nt   = tokenise(name);
  const dt   = tokenise((product.description || "").toLowerCase());
  // Category is deliberately excluded from relevance scoring — when the query
  // text exactly equals a category name (e.g. "smart phones"), every product
  // in that category would otherwise score identically regardless of whether
  // the product itself has anything to do with the query. Category browsing
  // already has its own dedicated Department filter.
  let s = scoreTextMatch(q, [product.name, product.description, product.brand], [5, 1, 2]);
  if (name === q)                                          s += 1000;
  if (name.startsWith(q + " ") || name.startsWith(q + ",")) s += 800;
  const inName = allWordsInTokens(words, nt);
  if (inName) {
    s += 600;
    if (words.length > 1) {
      let last = -1, ok = true;
      for (const w of words) {
        const idx = nt.findIndex((t, i) => i > last && wordMatchesToken(w, t));
        if (idx === -1) { ok = false; break; }
        last = idx;
      }
      if (ok) s += 200;
    }
  }
  if (!inName && allWordsInTokens(words, dt))             s += 40;

  // ── Fuzzy matching: catch typos like "samsng" → "samsung", "iphon" → "iphone" ──
  if (s === 0) {
    const fuzzyMatchCount = words.filter(w => fuzzyWordMatchesAnyToken(w, nt)).length;
    if (fuzzyMatchCount === words.length) {
      // All query words fuzzy-matched in name
      s += 80 * fuzzyMatchCount;
    } else if (fuzzyMatchCount > 0) {
      // Partial fuzzy match in name
      const dtFuzzyCount = words.filter(w => fuzzyWordMatchesAnyToken(w, dt)).length;
      if (fuzzyMatchCount + dtFuzzyCount >= words.length) {
        s += 80 * fuzzyMatchCount + 20 * dtFuzzyCount;
      }
    }
  }

  if (s > 0) { s += (product.rating || 0) * 5; s -= name.length * 0.1; }
  return s;
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [d, setD] = useState(value);
  useEffect(() => { const id = setTimeout(() => setD(value), delay); return () => clearTimeout(id); }, [value, delay]);
  return d;
}

// ─── Pagination component ─────────────────────────────────────────────────────
function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-14">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-9 w-9 border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-muted-foreground text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`h-9 w-9 text-sm font-medium transition-all ${
              p === page
                ? "bg-noir text-ivory"
                : "border border-border hover:border-gold hover:text-gold"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-9 w-9 border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function ShopSidebar({
  categories,
  totalCount,
  activeCat,
  sort,
  priceRange,
  minRating,
  onCategoryChange,
  onSortChange,
  onPriceChange,
  onRatingChange,
  onClear,
}: {
  categories: CategoryFilter[];
  totalCount: number;
  activeCat: string;
  sort: string;
  priceRange: PriceRange;
  minRating: number;
  onCategoryChange: (slug: string) => void;
  onSortChange: (value: string) => void;
  onPriceChange: (value: PriceRange) => void;
  onRatingChange: (value: number) => void;
  onClear: () => void;
}) {
  const topCategories = useMemo(
    () => [...categories].sort(sortCategoryFilters).slice(0, 14),
    [categories]
  );

  return (
    <aside className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div>
          <p className="eyebrow">Filters</p>
          <h2 className="mt-1 font-serif text-lg">Refine the Edit</h2>
        </div>
        <button onClick={onClear} className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold">
          Reset
        </button>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <h3 className="eyebrow mb-2">Department</h3>
          <div className="space-y-1">
            <button
              onClick={() => onCategoryChange("all")}
              className={`flex w-full items-center justify-between px-2.5 py-1.5 text-left text-xs transition-colors ${
                activeCat === "all" ? "bg-noir text-ivory" : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="font-medium">All Products</span>
              <span className="text-xs opacity-70">{totalCount.toLocaleString()}</span>
            </button>
            {topCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => onCategoryChange(cat.slug)}
                className={`flex w-full items-center justify-between px-2.5 py-1.5 text-left text-xs transition-colors ${
                  activeCat === cat.slug ? "bg-noir text-ivory" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="truncate font-medium">{cat.name}</span>
                <span className="ml-2 text-xs opacity-70">{cat.count.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="eyebrow mb-2">Sort By</h3>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-9 w-full border border-border bg-background px-3 text-xs font-medium outline-none transition-colors focus:border-gold"
          >
            <option value="featured">Featured</option>
            <option value="new">Latest Arrivals</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="eyebrow mb-2">Price</h3>
          <div className="space-y-1">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => onPriceChange(range.value)}
                className={`flex w-full px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                  priceRange === range.value ? "bg-gold/15 text-gold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="eyebrow mb-2">Rating</h3>
          <div className="space-y-1">
            {[0, 4, 4.5].map((rating) => (
              <button
                key={rating}
                onClick={() => onRatingChange(rating)}
                className={`flex w-full px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                  minRating === rating ? "bg-gold/15 text-gold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {rating === 0 ? "All ratings" : `${rating}+ stars`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const Shop = () => {
  const [params, setParams] = useSearchParams();
  const activeCat   = params.get("cat") || "all";
  const searchQuery = params.get("q")   || "";
  const currentPage = parseInt(params.get("page") || "1", 10);

  const [sort,       setSort]       = useState(params.get("sort") || "featured");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [minRating,  setMinRating]  = useState(0);
  const [categories, setCategories] = useState<CategoryFilter[]>([]);
  const [products,   setProducts]   = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0); // real total from source
  const [storeTotalCount, setStoreTotalCount] = useState(0); // whole-store total, unaffected by search/filters
  const [loading,    setLoading]    = useState(true);
  const [hydratingAll] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 350);
  // Price/rating filters (and search) narrow within the full matching set, not
  // just whatever ~72 items the server handed back for the current page — so
  // when any of them are active we fetch a large bounded batch once and do
  // sorting/filtering/pagination entirely client-side.
  const isFiltered = Boolean(debouncedQuery.trim()) || priceRange !== "all" || minRating > 0;
  const lastFetchKeyRef = useRef<string>("");

  // Whole-store total for the "All Products" sidebar row — fetched once so it
  // doesn't fluctuate with the current search/category/filter scope.
  useEffect(() => {
    let mounted = true;
    fetchStoreProductsPage(1, 1)
      .then((r) => { if (mounted) setStoreTotalCount(Number(r.total || 0)); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  // ── Fetch ──
  useEffect(() => {
    const search = debouncedQuery.trim();
    const category = activeCat !== "all" ? activeCat : undefined;
    const fetchKey = `${category || "all"}|${search}|${isFiltered}`;
    // In filtered mode, paging is a client-side slice of an already-fetched
    // batch — a page change alone shouldn't trigger a refetch. In unfiltered
    // (server-paginated) mode every page change needs a fresh network fetch.
    if (isFiltered && lastFetchKeyRef.current === fetchKey) return;
    lastFetchKeyRef.current = fetchKey;

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [prodResult, catData] = await Promise.all([
          isFiltered
            ? fetchStoreProducts(1, 3000, search || undefined, category).then((items) => ({ products: items, total: items.length }))
            : fetchStoreProductsPage(currentPage, PAGE_SIZE, undefined, category),
          fetchStoreCategories(1, 100),
        ]);
        if (!mounted) return;
        const categoryList = Array.isArray(catData?.data) ? catData.data : [];
        const productList = Array.isArray(prodResult.products) ? prodResult.products : [];
        setCategories(filterVisibleCategories(categoryList).sort(sortCategoryFilters));
        setProducts(productList.map(mapStoreProductToLocalProduct));
        if (!isFiltered) setTotalCount(Number(prodResult.total || 0));
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [activeCat, currentPage, debouncedQuery, isFiltered]);

  // ── Filtered + sorted list ──
  const list = useMemo(() => {
    let p = [...products];
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase().trim();
      const words = tokenise(q);
      p = p
        .map((product) => ({ product, score: scoreProduct(product, q, words) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ product }) => product);
    } else {
      if (sort === "new") p = [...p].sort((a, b) => {
        const aNew = a.badge === "New" ? 1 : 0;
        const bNew = b.badge === "New" ? 1 : 0;
        return bNew - aNew || String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
      });
      if (sort === "low")    p = [...p].sort((a, b) => a.price - b.price);
      if (sort === "high")   p = [...p].sort((a, b) => b.price - a.price);
      if (sort === "rating") p = [...p].sort((a, b) => b.rating - a.rating);
    }
    const priceRule = PRICE_RANGES.find((range) => range.value === priceRange) ?? PRICE_RANGES[0];
    p = p.filter((x) => priceRule.test(x.price));
    if (minRating > 0) p = p.filter((x) => x.rating >= minRating);
    return p;
  }, [activeCat, debouncedQuery, sort, products, categories, priceRange, minRating]);

  // In filtered mode `list` holds every matching product — the server hasn't
  // paginated it, so slice it here. In server-paginated mode `list` already
  // is just the current page.
  useEffect(() => {
    if (isFiltered) setTotalCount(list.length);
  }, [isFiltered, list]);

  // ── Paginated slice ──
  const paginated = useMemo(() => {
    if (!isFiltered) return list;
    const start = (currentPage - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }, [list, isFiltered, currentPage]);

  const setPage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setCat = (slug: string) => {
    const next: Record<string, string> = { cat: slug, page: "1" };
    if (searchQuery) next.q = searchQuery;
    setParams(next);
  };

  const clearSearch = () => setParams({});

  const resetFilters = () => {
    setSort("featured");
    setPriceRange("all");
    setMinRating(0);
    setCat("all");
  };

  const pageTitle = searchQuery
    ? `Search: "${searchQuery}" | Luxeholic`
    : activeCat !== "all"
      ? `${categories.find(c => c.slug === activeCat)?.name || "Category"} | Luxeholic`
      : "Shop All Products | Luxeholic";

  // ── Loading skeleton ──
  const Skeleton = () => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-card border border-border animate-pulse">
          <div className="aspect-square bg-stone mb-3" />
          <div className="px-3 pb-3">
          <div className="h-3 w-1/3 bg-stone mb-2" />
          <div className="h-4 w-3/4 bg-stone mb-3" />
          <div className="h-6 w-1/2 bg-stone" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <SEO
        title={pageTitle}
        description={`Browse ${totalCount.toLocaleString()} pieces from the Luxeholic collection. Check availability, craftsmanship details, and shipping options before checkout.`}
        keywords={searchQuery ? `${searchQuery}, luxury, handbags, shoes` : "luxury, handbags, shoes, accessories, designer"}
        url="/shop"
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${absoluteUrl("/shop")}#collection`,
            "name": pageTitle,
            "url": absoluteUrl("/shop"),
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": list.length,
              "itemListElement": list.slice(0, 24).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": absoluteUrl(`/product/${product.slug}`),
                "name": product.name,
              })),
            },
          },
        ]}
      />

      <section className="mx-auto w-full max-w-[1500px] px-3 py-6 sm:px-4 sm:py-8 lg:px-6 lg:py-9">
        <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ShopSidebar
                categories={categories}
                totalCount={storeTotalCount}
                activeCat={activeCat}
                sort={sort}
                priceRange={priceRange}
                minRating={minRating}
                onCategoryChange={setCat}
                onSortChange={(value) => { setSort(value); setPage(1); }}
                onPriceChange={(value) => { setPriceRange(value); setPage(1); }}
                onRatingChange={(value) => { setMinRating(value); setPage(1); }}
                onClear={resetFilters}
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-4 border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="eyebrow inline-flex items-center gap-2">
                    {searchQuery ? <Search className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {searchQuery ? "Search Results" : "Shop All"}
                  </div>
                  <h1 className="mt-2 font-serif text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                    {searchQuery
                      ? `Results for "${searchQuery}"`
                      : activeCat !== "all"
                        ? categories.find(c => c.slug === activeCat)?.name || "Products"
                        : "The Full Collection"}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {loading
                      ? "Loading collection..."
                      : `${list.length.toLocaleString()} pieces found${hydratingAll ? " · syncing more" : ""}`}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-2 lg:hidden">
                    <select
                      value={activeCat}
                      onChange={(e) => setCat(e.target.value)}
                      aria-label="Select category"
                      className="h-9 min-w-0 flex-1 border border-border bg-background px-3 text-xs font-medium outline-none focus:border-gold"
                    >
                      <option value="all">All Departments</option>
                      {categories.map(c => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                    <select
                      value={sort}
                      onChange={(e) => { setSort(e.target.value); setPage(1); }}
                      className="h-9 min-w-0 flex-1 border border-border bg-background px-3 text-xs font-medium outline-none focus:border-gold"
                    >
                      <option value="featured">Featured</option>
                      <option value="new">Latest</option>
                      <option value="low">Low to High</option>
                      <option value="high">High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>

                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="inline-flex h-9 items-center justify-center gap-2 border border-border px-3 text-xs font-semibold transition-colors hover:border-gold hover:text-gold"
                    >
                      <X className="h-4 w-4" />
                      Clear search
                    </button>
                  )}

                  {!loading && totalCount > PAGE_SIZE && (
                    <span className="inline-flex h-9 items-center justify-center bg-muted px-3 text-xs font-semibold text-muted-foreground">
                      {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {(activeCat !== "all" || priceRange !== "all" || minRating > 0) && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Active</span>
                  {activeCat !== "all" && (
                    <button onClick={() => setCat("all")} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-semibold hover:border-gold hover:text-gold">
                      {categories.find(c => c.slug === activeCat)?.name}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {priceRange !== "all" && (
                    <button onClick={() => { setPriceRange("all"); setPage(1); }} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-semibold hover:border-gold hover:text-gold">
                      {PRICE_RANGES.find((range) => range.value === priceRange)?.label}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {minRating > 0 && (
                    <button onClick={() => { setMinRating(0); setPage(1); }} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-semibold hover:border-gold hover:text-gold">
                      {minRating}+ stars
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="border border-burgundy/30 bg-burgundy/5 p-4 mb-6">
                <p className="text-sm text-burgundy font-medium">Failed to load products</p>
                <p className="text-xs text-burgundy/70 mt-1">{error}</p>
              </div>
            )}

            {/* ── Product grid ── */}
            {loading ? (
              <Skeleton />
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-border bg-card py-28 text-center">
                <Search className="mb-5 h-10 w-10 text-muted-foreground" />
                <p className="eyebrow mb-2">No Matches</p>
                <h3 className="font-serif text-2xl font-light mb-2">Nothing found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Try changing department, price, rating, or search keyword.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 border border-noir bg-noir text-ivory text-xs uppercase tracking-[0.25em] font-semibold transition hover:bg-transparent hover:text-noir"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
                  {paginated.map(p => (
                    <ImageCursorCard key={p.id} imageUrl={p.image} category={p.category}>
                      <ProductCard product={p} />
                    </ImageCursorCard>
                  ))}
                </div>

                <Pagination
                  page={currentPage}
                  total={totalCount}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
