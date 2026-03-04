"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, ChevronDown } from "lucide-react"
import { useShopify } from "@/hooks/use-shopify"
import type { ShopifyProduct } from "@/lib/shopify-types"

// Only show digital products
const CATEGORY_ORDER = ["Books & Guides"]

function categorize(product: ShopifyProduct): string {
  const t = product.title.toLowerCase()
  const pt = product.productType.toLowerCase()

  if (t.includes("culture") || t.includes("liquid culture") || t.includes("grain spawn") || t.includes("genetic library") || pt === "cultures")
    return "Cultures"
  if (pt === "e-books" || t.includes("guide") || t.includes("ebook") || t.includes("audiobook") || t.includes("playbook") || t.includes("blueprint") || t.includes("sop") || t.includes("checklist") || t.includes("manual") || t.includes("protocols") || t.includes("quickstart"))
    return "Books & Guides"
  if (t.includes("grow kit"))
    return "Grow Kits"
  if (t.includes("blend") || t.includes("tincture") || t.includes("dehydrated") || t.includes("dried"))
    return "Supplements"
  if (pt === "t-shirts" || pt.includes("clothing") || t.includes("tee") || t.includes("hoodie") || t.includes("hat") || t.includes("beanie"))
    return "Apparel"
  return "Other"
}

function ProductRow({ product, createCheckout }: { product: ShopifyProduct; createCheckout: (id: string) => Promise<void> }) {
  const image = product.images[0]
  const variant = product.variants[0]
  const price = variant ? `$${parseFloat(variant.price).toFixed(2)}` : ""

  return (
    <button
      type="button"
      onClick={() => variant && createCheckout(variant.id)}
      className="group w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all hover:bg-sidebar-accent/50"
    >
      {image ? (
        <div className="relative w-9 h-9 rounded-md overflow-hidden border border-sidebar-border flex-shrink-0 bg-white/5">
          <Image
            src={image.src}
            alt={image.altText ?? product.title}
            fill
            className="object-contain p-0.5"
            sizes="36px"
          />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-md bg-sidebar-accent/50 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium truncate text-sidebar-foreground/90 group-hover:text-sidebar-foreground">
          {product.title}
        </p>
        <p className="text-[10px] text-muted-foreground">{price}</p>
      </div>
      <ShoppingCart className="w-3 h-3 text-primary/50 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  )
}

export function SidebarProducts() {
  const { featuredProducts, loading, createCheckout } = useShopify()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Books & Guides"]))

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  if (loading) {
    return (
      <div className="p-3 space-y-2">
        <h3 className="px-3 mb-1.5 text-[10px] font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
          Shop
        </h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-1.5 animate-pulse">
            <div className="w-8 h-8 rounded-md bg-sidebar-accent/50 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 rounded bg-sidebar-accent/50" />
              <div className="h-2.5 w-12 rounded bg-sidebar-accent/30" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (featuredProducts.length === 0) return null

  // Group by category
  const grouped = new Map<string, ShopifyProduct[]>()
  for (const product of featuredProducts) {
    const cat = categorize(product)
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(product)
  }

  const sortedCategories = CATEGORY_ORDER.filter((cat) => grouped.has(cat))

  return (
    <div className="p-3">
      <h3 className="px-3 mb-1.5 text-[10px] font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
        Shop
      </h3>
      <div className="space-y-1">
        {sortedCategories.map((cat) => {
          const products = grouped.get(cat)!
          const isExpanded = expandedCategories.has(cat)

          return (
            <div key={cat}>
              <button
                type="button"
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-semibold text-sidebar-foreground/60 uppercase tracking-wider hover:text-sidebar-foreground/80 transition-colors"
              >
                <span>{cat} ({products.length})</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
              </button>
              {isExpanded && (
                <div className="space-y-0.5">
                  {products.map((product) => (
                    <ProductRow key={product.id} product={product} createCheckout={createCheckout} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
