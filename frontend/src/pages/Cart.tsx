import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, ArrowRight, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { fetchStoreProducts, mapStoreProductToLocalProduct } from "@/services/store-api";
import { redirectToWooCheckout } from "@/lib/woo-checkout";
import type { Product } from "@/data/products";

const Cart = () => {
  const { formatPrice, country } = useCurrency();
  const { items, updateQty, removeItem } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  // Load related products
  useEffect(() => {
    const loadRelated = async () => {
      try {
        const products = await fetchStoreProducts(1, 8);
        const rawProducts = Array.isArray(products) ? products : [];
        const mapped = rawProducts.map(mapStoreProductToLocalProduct);
        // Filter out items already in cart
        const filtered = mapped.filter(p => !items.some(item => item.product.id === p.id));
        setRelatedProducts(filtered.slice(0, 8));
      } catch (error) {
        console.error('Failed to load related products:', error);
      }
    };
    loadRelated();
  }, [items]);

  const { addItem } = useCart();

  return (
    <Layout>
      <SEO
        title="Cart | Luxeholic"
        description="Review items in your Luxeholic shopping cart."
        url="/cart"
        noindex
        nofollow
      />
      <section className="container pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-16">
        <p className="eyebrow text-gold mb-3">Your Bag</p>
        <h1 className="font-serif font-light text-5xl sm:text-6xl tracking-tight mb-12">
          Your <span className="shimmer-text">bag</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground mb-6">Your bag is empty.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-noir bg-noir px-7 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold text-ivory transition hover:bg-burgundy hover:border-burgundy"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-5 bg-gradient-card border border-border"
                >
                  <div className="h-24 w-24 bg-stone flex items-center justify-center flex-shrink-0 overflow-hidden group">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={96}
                      height={96}
                      className="hover-zoom-img h-20 w-20 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3 className="font-serif font-medium text-lg leading-tight mt-1 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 border border-border px-2 py-1">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          className="h-7 w-7 hover:bg-secondary flex items-center justify-center"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{qty}</span>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          className="h-7 w-7 hover:bg-secondary flex items-center justify-center"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-serif font-semibold text-lg">
                        {formatPrice(product.price * qty)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="h-8 w-8 hover:bg-secondary flex items-center justify-center self-start"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-28 h-fit p-6 bg-gradient-card border border-border">
              <p className="eyebrow mb-4">Order Summary</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Included" : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-serif font-medium text-lg">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>
              <Link
                to="/shop"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 border border-border px-7 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold hover:border-gold hover:text-gold transition-all"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  const lineItems = items.map(item => ({
                    product_id: Number(item.product.id),
                    quantity: item.qty,
                    // Pass variation_id if it was stored when adding to cart
                    ...(((item.product as any).woo_variation_id)
                      ? { variation_id: (item.product as any).woo_variation_id }
                      : {}),
                  }));
                  redirectToWooCheckout(
                    lineItems,
                    window.location.hostname,
                    country.currency
                  );
                }}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-noir bg-noir px-7 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold text-ivory transition hover:bg-burgundy hover:border-burgundy"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Shipping options and charges are confirmed at checkout.
              </p>
            </aside>
          </div>
        )}
      </section>

      <section className="container pb-16 sm:pb-20 lg:pb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Recommended</p>
            <h2 className="font-serif font-light text-3xl sm:text-4xl tracking-tight">
              Related pieces
            </h2>
            <div className="mt-3 h-px w-24 gold-line" />
          </div>
        </div>

        <Carousel
          opts={{ align: "start", loop: false }}
          className="w-full"
        >
          <CarouselContent>
            {relatedProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-[84%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <article className="group h-full border border-border bg-gradient-card p-4">
                  <Link to={`/product/${product.slug}`} className="block">
                    <div className="aspect-square bg-stone flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        width={240}
                        height={240}
                        className="hover-zoom-img h-3/4 w-3/4 object-contain"
                      />
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                      {product.category}
                    </p>
                    <h3 className="mt-1 font-serif text-base font-medium leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-serif text-xl font-light">${product.price}</p>
                    <button
                      type="button"
                      onClick={() => addItem(product)}
                      className="inline-flex items-center border border-noir bg-noir px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-ivory transition hover:bg-burgundy hover:border-burgundy"
                    >
                      Add item
                    </button>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 h-9 w-9 rounded-full border-border bg-background/80 backdrop-blur" />
          <CarouselNext className="-right-3 h-9 w-9 rounded-full border-border bg-background/80 backdrop-blur" />
        </Carousel>
      </section>
    </Layout>
  );
};

export default Cart;
