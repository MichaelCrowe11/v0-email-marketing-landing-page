"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import { shopifyClient } from "@/lib/shopify"
import type { ShopifyProduct } from "@/lib/shopify-types"

const STOREFRONT_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
const SHOPIFY_CONFIGURED = !!(STOREFRONT_DOMAIN && STOREFRONT_TOKEN)

interface ShopifyContextValue {
  products: ShopifyProduct[]
  featuredProducts: ShopifyProduct[]
  loading: boolean
  searchProducts: (query: string) => ShopifyProduct[]
  createCheckout: (variantId: string) => Promise<void>
}

const ShopifyContext = createContext<ShopifyContextValue | null>(null)

const PRODUCTS_QUERY = `{
  products(first: 250) {
    edges {
      node {
        id
        title
        description
        handle
        productType
        tags
        images(first: 5) {
          edges {
            node {
              id
              src: url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
}`

/** Only surface digital products (books, guides, SOPs, courses) on the platform */
function isDigitalProduct(p: ShopifyProduct): boolean {
  const t = p.title.toLowerCase()
  const pt = p.productType.toLowerCase()
  return (
    pt === "e-books" ||
    t.includes("guide") ||
    t.includes("ebook") ||
    t.includes("audiobook") ||
    t.includes("playbook") ||
    t.includes("blueprint") ||
    t.includes("sop") ||
    t.includes("checklist") ||
    t.includes("manual") ||
    t.includes("protocols") ||
    t.includes("quickstart") ||
    t.includes("course") ||
    t.includes("the mushroom grower")
  )
}

function normalizeProduct(node: any): ShopifyProduct {
  return {
    id: node.id,
    title: node.title,
    description: node.description ?? "",
    handle: node.handle ?? "",
    images: (node.images?.edges ?? []).map((e: any) => ({
      id: e.node.id,
      src: e.node.src,
      altText: e.node.altText ?? null,
    })),
    variants: (node.variants?.edges ?? []).map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      price: e.node.price?.amount ?? "0.00",
      available: e.node.availableForSale !== false,
    })),
    tags: node.tags ?? [],
    productType: node.productType ?? "",
  }
}

async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  if (!SHOPIFY_CONFIGURED) return []

  const res = await fetch(
    `https://${STOREFRONT_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN!,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
    }
  )

  if (!res.ok) throw new Error(`Storefront API ${res.status}`)

  const json = await res.json()
  const edges = json.data?.products?.edges ?? []
  return edges.map((e: any) => normalizeProduct(e.node))
}

export function ShopifyProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchAllProducts()
      .then((fetched) => {
        if (!cancelled) setProducts(fetched)
      })
      .catch((err) => {
        console.error("[Shopify] Failed to fetch products:", err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const digitalProducts = useMemo(
    () => products.filter(isDigitalProduct),
    [products]
  )

  const featuredProducts = useMemo(
    () => digitalProducts.filter((p) => p.tags.includes("featured")),
    [digitalProducts]
  )

  const searchProducts = useCallback(
    (query: string): ShopifyProduct[] => {
      if (!query.trim()) return []
      const q = query.toLowerCase()
      return digitalProducts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)) ||
            p.productType.toLowerCase().includes(q)
        )
        .slice(0, 10)
    },
    [digitalProducts]
  )

  const createCheckout = useCallback(async (variantId: string) => {
    if (!shopifyClient) {
      console.warn("[Shopify] Client not configured, cannot create checkout")
      return
    }
    try {
      const checkout = await shopifyClient.checkout.create()
      const checkoutWithItem = await shopifyClient.checkout.addLineItems(
        checkout.id,
        [{ variantId, quantity: 1 }]
      )
      window.open((checkoutWithItem as any).webUrl, "_blank")
    } catch (err) {
      console.error("[Shopify] Checkout failed:", err)
    }
  }, [])

  const value = useMemo<ShopifyContextValue>(
    () => ({ products, featuredProducts, loading, searchProducts, createCheckout }),
    [products, featuredProducts, loading, searchProducts, createCheckout]
  )

  return (
    <ShopifyContext.Provider value={value}>{children}</ShopifyContext.Provider>
  )
}

export function useShopify() {
  const ctx = useContext(ShopifyContext)
  if (!ctx) throw new Error("useShopify must be used within <ShopifyProvider>")
  return ctx
}
