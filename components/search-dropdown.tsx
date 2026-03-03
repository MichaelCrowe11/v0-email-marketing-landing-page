"use client"

import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import type { ShopifyProduct } from "@/lib/shopify-types"

interface SearchDropdownProps {
  products: ShopifyProduct[]
  visible: boolean
  onBuy: (variantId: string) => void
}

export function SearchDropdown({ products, visible, onBuy }: SearchDropdownProps) {
  if (!visible || products.length === 0) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border/60 bg-popover/95 backdrop-blur-xl shadow-xl overflow-hidden z-50">
      <div className="max-h-[360px] overflow-y-auto p-1">
        {products.map((product) => {
          const image = product.images[0]
          const variant = product.variants[0]
          const price = variant
            ? `$${parseFloat(variant.price).toFixed(2)}`
            : ""

          return (
            <div
              key={product.id}
              className="group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors cursor-default"
            >
              {image ? (
                <div className="relative w-10 h-10 rounded-md overflow-hidden border border-border/40 flex-shrink-0">
                  <Image
                    src={image.src}
                    alt={image.altText ?? product.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">
                  {product.title}
                </p>
                {price && (
                  <p className="text-xs text-muted-foreground">{price}</p>
                )}
              </div>

              {variant && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onBuy(variant.id)
                  }}
                  className="md:opacity-0 md:group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md text-white transition-opacity"
                  style={{
                    background: "linear-gradient(to right, #3d9a9a, #4db8b8)",
                  }}
                >
                  <ShoppingCart className="w-3 h-3" />
                  Buy
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
