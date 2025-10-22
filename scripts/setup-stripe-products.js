import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function createProduct(productData, index, total) {
  console.log(`\n[v0] ═══════════════════════════════════════════════════`)
  console.log(`[v0] Creating Product ${index + 1} of ${total}`)
  console.log(`[v0] ═══════════════════════════════════════════════════\n`)

  try {
    console.log(`[v0] 📦 Product Name: ${productData.name}`)
    console.log(`[v0] 💰 Price: $${(productData.price / 100).toFixed(2)}`)
    console.log(`[v0] 📝 Description: ${productData.description}\n`)

    // Step 1: Create product
    console.log(`[v0] Step 1/3: Creating product in Stripe...`)
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
    })
    console.log(`[v0] ✓ Product created successfully!`)
    console.log(`[v0]   Product ID: ${product.id}\n`)

    // Step 2: Create price
    console.log(`[v0] Step 2/3: Creating price...`)
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productData.price,
      currency: productData.currency,
    })
    console.log(`[v0] ✓ Price created successfully!`)
    console.log(`[v0]   Price ID: ${price.id}\n`)

    // Step 3: Create payment link
    console.log(`[v0] Step 3/3: Creating payment link...`)
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
    })
    console.log(`[v0] ✓ Payment link created successfully!\n`)
    console.log(`[v0] 🔗 PAYMENT LINK URL:`)
    console.log(`[v0] ${paymentLink.url}\n`)

    return {
      name: productData.name,
      url: paymentLink.url,
      productId: product.id,
      priceId: price.id,
    }
  } catch (error) {
    console.error(`[v0] ✗ ERROR: ${error.message}`)
    if (error.type === "StripePermissionError") {
      console.error(`[v0] ⚠️  Permission error: Make sure your Stripe API key has 'write' permissions`)
    }
    return null
  }
}

async function setupProducts() {
  console.log(`\n[v0] 🚀 STRIPE PRODUCT SETUP`)
  console.log(`[v0] ═══════════════════════════════════════════════════\n`)
  console.log(`[v0] This script will create 3 new products in Stripe:`)
  console.log(`[v0] 1. Inoculation AI - $67`)
  console.log(`[v0] 2. Lab Bundle (3 Specialties) - $149`)
  console.log(`[v0] 3. Ultimate Access (All 4 Modules) - $197\n`)

  const productsToCreate = [
    {
      name: "Crowe Logic Inoculation AI",
      description: "Master inoculation techniques with AI-powered guidance for mushroom cultivation",
      price: 6700, // $67.00 in cents
      currency: "usd",
    },
    {
      name: "Crowe Logic AI - Lab Bundle (3 Specialties)",
      description: "Complete bundle of 3 specialty modules - Save $52 on individual purchases",
      price: 14900, // $149.00 in cents
      currency: "usd",
    },
    {
      name: "Crowe Logic AI - Ultimate Access (All 4 Modules)",
      description: "Complete access to all 4 modules including Core, Spawn, Substrate, and Inoculation - Save $101",
      price: 19700, // $197.00 in cents
      currency: "usd",
    },
  ]

  const results = []

  // Create each product one by one
  for (let i = 0; i < productsToCreate.length; i++) {
    const result = await createProduct(productsToCreate[i], i, productsToCreate.length)
    if (result) {
      results.push(result)
    }
    // Add a small delay between creations
    if (i < productsToCreate.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  // Summary
  console.log(`\n[v0] ═══════════════════════════════════════════════════`)
  console.log(`[v0] 📊 SETUP COMPLETE`)
  console.log(`[v0] ═══════════════════════════════════════════════════\n`)
  console.log(`[v0] Successfully created ${results.length} of ${productsToCreate.length} products\n`)

  if (results.length > 0) {
    console.log(`[v0] 🔗 PAYMENT LINKS TO ADD TO YOUR SITE:\n`)
    results.forEach((result, index) => {
      console.log(`[v0] ${index + 1}. ${result.name}`)
      console.log(`[v0]    ${result.url}\n`)
    })

    console.log(`[v0] ═══════════════════════════════════════════════════`)
    console.log(`[v0] 📋 NEXT STEPS:`)
    console.log(`[v0] ═══════════════════════════════════════════════════\n`)
    console.log(`[v0] Copy the payment link URLs above and share them`)
    console.log(`[v0] so I can update your pricing component!\n`)
  }
}

setupProducts()
