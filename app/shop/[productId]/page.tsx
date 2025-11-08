import { notFound } from "next/navigation"
import { PRODUCTS } from "@/lib/products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Checkout from "@/components/checkout"
import { AnimatedProductCard } from "@/components/animated-product-card"

export default function ProductPage({ params }: { params: { productId: string } }) {
  const product = PRODUCTS.find((p) => p.id === params.productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="mb-6 rounded-lg overflow-hidden">
              <AnimatedProductCard taskType={product.taskType} productName={product.name} />
            </div>

            <div className="flex items-start gap-3 mb-4">
              <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
              {product.popular && (
                <Badge className="bg-accent text-accent-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-lg text-foreground/70 mb-6">{product.description}</p>

            <div className="text-4xl font-bold text-foreground mb-8">
              ${product.price}
              {product.category === "mms" && product.id.includes("advisory") && (
                <span className="text-lg font-normal text-foreground/60">/month</span>
              )}
            </div>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-foreground/70">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Complete Your Purchase</CardTitle>
                <CardDescription>Secure checkout powered by Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                <Checkout productId={product.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
