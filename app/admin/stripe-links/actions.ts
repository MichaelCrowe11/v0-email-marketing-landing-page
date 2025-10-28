"use server"

import Stripe from "stripe"
import { unstable_cache } from "next/cache"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null

const getCachedStripeData = unstable_cache(
  async () => {
    if (!stripe) {
      return []
    }

    try {
      // Fetch all products, prices, and payment links in parallel
      const [products, allPrices, allPaymentLinks] = await Promise.all([
        stripe.products.list({
          active: true,
          limit: 100,
        }),
        stripe.prices.list({
          active: true,
          limit: 100,
        }),
        stripe.paymentLinks.list({
          limit: 100,
          expand: ["data.line_items"],
        }),
      ])

      // Group prices by product
      const pricesByProduct = new Map<string, Stripe.Price[]>()
      allPrices.data.forEach((price) => {
        const productId = typeof price.product === "string" ? price.product : price.product?.id
        if (productId) {
          if (!pricesByProduct.has(productId)) {
            pricesByProduct.set(productId, [])
          }
          pricesByProduct.get(productId)!.push(price)
        }
      })

      // Build product data with links
      const productsWithLinks = products.data.map((product) => {
        const prices = pricesByProduct.get(product.id) || []
        const priceIds = prices.map((p) => p.id)

        // Filter payment links that match this product's prices
        const relevantLinks = allPaymentLinks.data.filter((link) => {
          if (!link.line_items || !link.line_items.data || link.line_items.data.length === 0) {
            return false
          }
          const firstLineItem = link.line_items.data[0]
          return firstLineItem && priceIds.includes(firstLineItem.price as string)
        })

        return {
          id: product.id,
          name: product.name,
          price: prices[0]?.unit_amount || 0,
          recurring: prices[0]?.recurring?.interval || null,
          paymentLinks: relevantLinks.map((link) => ({
            id: link.id,
            url: link.url,
            active: link.active,
          })),
        }
      })

      // Filter to only show Crowe Logic AI products
      const croweProducts = productsWithLinks.filter((p) => p.name.toLowerCase().includes("crowe logic"))

      return { products: croweProducts }
    } catch (error: any) {
      console.error("[v0] Error fetching Stripe payment links:", error)
      return { error: error.message }
    }
  },
  ["stripe-payment-links"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["stripe-links"],
  },
)

export async function getStripePaymentLinks() {
  return getCachedStripeData()
}
