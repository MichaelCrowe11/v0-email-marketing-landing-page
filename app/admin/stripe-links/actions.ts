"use server"

import Stripe from "stripe"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null

export async function getStripePaymentLinks() {
  if (!stripe) {
    return []
  }
  try {
    // Fetch all products
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    })

    // For each product, fetch its prices and payment links
    const productsWithLinks = await Promise.all(
      products.data.map(async (product) => {
        // Get prices for this product
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
        })

        // Get payment links for this product with expanded line_items
        const paymentLinks = await stripe.paymentLinks.list({
          limit: 10,
          expand: ["data.line_items"],
        })

        // Filter payment links that match this product's prices
        const priceIds = prices.data.map((p) => p.id)
        const relevantLinks = paymentLinks.data.filter((link) => {
          // Check if line_items exists and has data
          if (!link.line_items || !link.line_items.data || link.line_items.data.length === 0) {
            return false
          }
          const firstLineItem = link.line_items.data[0]
          return firstLineItem && priceIds.includes(firstLineItem.price as string)
        })

        return {
          id: product.id,
          name: product.name,
          price: prices.data[0]?.unit_amount || 0,
          recurring: prices.data[0]?.recurring?.interval || null,
          paymentLinks: relevantLinks.map((link) => ({
            id: link.id,
            url: link.url,
            active: link.active,
          })),
        }
      }),
    )

    // Filter to only show Crowe Logic AI products
    const croweProducts = productsWithLinks.filter((p) => p.name.toLowerCase().includes("crowe logic"))

    return { products: croweProducts }
  } catch (error: any) {
    console.error("[v0] Error fetching Stripe payment links:", error)
    return { error: error.message }
  }
}
