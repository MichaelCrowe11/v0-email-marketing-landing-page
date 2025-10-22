import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PRODUCTS } from "@/lib/products"
import Link from "next/link"
import { Check, Star } from "lucide-react"
import { AnimatedProductCard } from "@/components/animated-product-card"

export default function ShopPage() {
  const categories = [
    { id: "ai-modules", name: "AI Modules", description: "Intelligent cultivation systems" },
    { id: "bundles", name: "Bundle Packages", description: "Complete solution bundles" },
    { id: "mms", name: "MMS Systems", description: "Complete management solutions" },
    { id: "books", name: "Books", description: "Expert cultivation guides" },
    { id: "sops", name: "SOPs", description: "Standard operating procedures" },
    { id: "templates", name: "Templates", description: "Farm management tools" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-3">Shop</h1>
          <p className="text-foreground/70 text-lg">Professional tools and resources for mushroom cultivation</p>
        </div>

        {categories.map((category) => {
          const categoryProducts = PRODUCTS.filter((p) => p.category === category.id)

          if (categoryProducts.length === 0) return null

          return (
            <div key={category.id} className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">{category.name}</h2>
                <p className="text-foreground/60">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-card border-border/50 hover:border-border transition-all duration-200 flex flex-col overflow-hidden"
                  >
                    <AnimatedProductCard taskType={product.taskType} productName={product.name} />

                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl text-foreground">{product.name}</CardTitle>
                        {product.popular && (
                          <Badge className="bg-accent text-accent-foreground">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-foreground/60">{product.description}</CardDescription>
                      <div className="text-3xl font-bold text-foreground mt-4">
                        ${product.price}
                        {category.id === "mms" && product.id.includes("advisory") && (
                          <span className="text-base font-normal text-foreground/60">/month</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-2 mb-6 flex-1">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground/70">
                            <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild className="w-full bg-foreground text-background hover:bg-foreground/90">
                        <Link href={`/shop/${product.id}`}>Buy Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        <Card className="bg-accent/10 border-accent/20 mt-16">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">Need Custom Solutions?</h3>
            <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
              We offer custom SOP development, facility consulting, and enterprise MMS implementations.
            </p>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:michael@crowelogic.com">Email michael@crowelogic.com</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
