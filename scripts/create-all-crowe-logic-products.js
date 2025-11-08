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
      shortName: productData.shortName,
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

async function setupAllProducts() {
  console.log(`\n[v0] 🚀 CROWE LOGIC - COMPLETE STRIPE SETUP`)
  console.log(`[v0] ═══════════════════════════════════════════════════\n`)
  console.log(`[v0] This script will create ALL 7 products in Stripe:`)
  console.log(`[v0] 1. Core - $97`)
  console.log(`[v0] 2. Spawn Master - $67`)
  console.log(`[v0] 3. Substrate Tech - $67`)
  console.log(`[v0] 4. Inoculation AI - $67`)
  console.log(`[v0] 5. Full Access (3 modules) - $159`)
  console.log(`[v0] 6. Lab Bundle (3 specialties) - $149`)
  console.log(`[v0] 7. Ultimate Access (4 modules) - $197\n`)

  const productsToCreate = [
    {
      name: "Crowe Logic AI - Core",
      shortName: "Core",
      description: "Foundation module for mushroom cultivation AI - Essential mycology knowledge and automation",
      price: 9700, // $97.00
      currency: "usd",
    },
    {
      name: "Crowe Logic AI - Spawn Master",
      shortName: "Spawn Master",
      description: "Master spawn production with AI-powered guidance for optimal colonization",
      price: 6700, // $67.00
      currency: "usd",
    },
    {
      name: "Crowe Logic AI - Substrate Tech",
      shortName: "Substrate Tech",
      description: "Advanced substrate formulation and preparation techniques with AI assistance",
      price: 6700, // $67.00
      currency: "usd",
    },
    {
      name: "Crowe Logic AI - Inoculation AI",
      shortName: "Inoculation AI",
      description: "Master inoculation techniques with AI-powered guidance for contamination-free results",
      price: 6700, // $67.00
      currency: "usd",
    },
    {
      name: "Crowe Logic AI - Full Access (3 Modules)",
      shortName: "Full Access",
      description: "Complete access to Core, Spawn Master, and Substrate Tech - Save $72 vs individual purchase",
      price: 15900, // $159.00
      currency: "usd",
    },
    {
      name: "Crowe Logic AI - Lab Bundle (3 Specialties)",
      shortName: "Lab Bundle",
      description: "Spawn Master, Substrate Tech, and Inoculation AI bundle - Save $52 on specialty modules",
      price: 14900, // $149.00
      currency: "usd",
    },
    {
      name: "Crowe Logic AI - Ultimate Access (All 4 Modules)",
      shortName: "Ultimate Access",
      description: "Complete access to all 4 modules: Core, Spawn, Substrate, and Inoculation - Save $101",
      price: 19700, // $197.00
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
    console.log(`[v0] 🔗 PAYMENT LINKS FOR YOUR PRICING COMPONENT:\n`)
    results.forEach((result) => {
      console.log(`[v0] ${result.shortName}: ${result.url}`)
    })

    console.log(`\n[v0] ═══════════════════════════════════════════════════`)
    console.log(`[v0] 📋 NEXT STEPS:`)
    console.log(`[v0] ═══════════════════════════════════════════════════\n`)
    console.log(`[v0] Copy all 7 payment link URLs above and share them`)
    console.log(`[v0] so I can update your pricing component with the`)
    console.log(`[v0] correct Crowe Logic branded products!\n`)
  }
}

setupAllProducts()
