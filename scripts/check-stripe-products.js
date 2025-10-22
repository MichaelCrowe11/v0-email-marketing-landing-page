import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

console.log("🔍 Checking Stripe products...\n")

try {
  // Fetch all products
  const products = await stripe.products.list({
    active: true,
    limit: 100,
  })

  // Filter for Crowe Logic AI products
  const croweProducts = products.data.filter((p) => p.name.includes("Crowe Logic"))

  console.log(`Found ${croweProducts.length} Crowe Logic AI products:\n`)

  for (const product of croweProducts) {
    console.log(`📦 ${product.name}`)

    // Get prices for this product
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    })

    if (prices.data.length > 0) {
      const price = prices.data[0]
      const amount = price.unit_amount / 100
      console.log(`   💰 Price: $${amount}`)

      // Check for payment links
      const paymentLinks = await stripe.paymentLinks.list({
        limit: 100,
      })

      const productLink = paymentLinks.data.find((link) =>
        link.line_items.data.some((item) => item.price.id === price.id),
      )

      if (productLink) {
        console.log(`   ✅ Payment Link: ${productLink.url}`)
      } else {
        console.log(`   ❌ No payment link found`)
      }
    }
    console.log("")
  }

  // Check specifically for the 3 new products we need
  const needed = ["Inoculation AI", "Lab Bundle", "Ultimate Access"]

  console.log("\n📋 Status of required products:")
  for (const name of needed) {
    const exists = croweProducts.some((p) => p.name.includes(name))
    console.log(`   ${exists ? "✅" : "❌"} ${name}`)
  }
} catch (error) {
  console.error("❌ Error:", error.message)
}
