import { getStripePaymentLinks } from "./actions"

export default async function StripeLinksPage() {
  const links = await getStripePaymentLinks()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-foreground">Your Stripe Payment Links</h1>
        <p className="mb-8 text-muted-foreground">
          Copy these URLs and paste them into your pricing component where the TODO comments are.
        </p>

        {links.error ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
            <h2 className="mb-2 font-bold text-destructive">Error fetching payment links</h2>
            <p className="text-sm text-destructive/80">{links.error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {links.products?.map((product: any) => (
              <div key={product.id} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${(product.price / 100).toFixed(2)} {product.recurring ? "/ " + product.recurring : "one-time"}
                    </p>
                  </div>
                </div>

                {product.paymentLinks && product.paymentLinks.length > 0 ? (
                  <div className="space-y-2">
                    {product.paymentLinks.map((link: any) => (
                      <div key={link.id} className="rounded bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">Payment Link</span>
                          <span className="text-xs text-muted-foreground">Click to select</span>
                        </div>
                        <code className="block break-all text-sm text-foreground select-all">{link.url}</code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded bg-muted p-3 text-sm text-muted-foreground">
                    No payment links created yet.{" "}
                    <a
                      href={`https://dashboard.stripe.com/products/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Create one in Stripe →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
