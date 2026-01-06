"use server"

import { stripe } from "@/lib/stripe"
import { getUser } from "@/lib/azure/auth"
import { selectSingle, update } from "@/lib/azure/database"

// Consultation Price IDs from environment variables
const CONSULTATION_PRICE_IDS = {
  "1hr": process.env.NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID,
  "3hr": process.env.NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID,
  fullday: process.env.NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID,
  retainer: process.env.NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID,
}

// Service Price IDs
const SERVICE_PRICE_IDS = {
  "facility-setup": process.env.NEXT_PUBLIC_FACILITY_SETUP_PRICE_ID,
  "custom-ai": process.env.NEXT_PUBLIC_CUSTOM_AI_TRAINING_PRICE_ID,
  "master-course": process.env.NEXT_PUBLIC_MASTER_COURSE_PRICE_ID,
}

export async function startConsultationCheckout(consultationType: string) {
  // Get current user
  const { data: { user } } = await getUser()

  if (!user) {
    throw new Error("You must be logged in to book a consultation")
  }

  // Get Price ID
  const priceId = CONSULTATION_PRICE_IDS[consultationType as keyof typeof CONSULTATION_PRICE_IDS]

  if (!priceId) {
    throw new Error("Invalid consultation type")
  }

  // Create or retrieve Stripe customer
  let customerId: string

  const { data: userData } = await selectSingle<{ stripe_customer_id: string }>(
    "users",
    "stripe_customer_id",
    "id = @id",
    { id: user.id }
  )

  if (userData?.stripe_customer_id) {
    customerId = userData.stripe_customer_id
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        azure_user_id: user.id,
      },
    })
    customerId = customer.id

    // Save customer ID to database
    await update("users", { stripe_customer_id: customerId }, "id = @id", { id: user.id })
  }

  // Determine if it's a subscription (retainer) or one-time payment
  const mode = consultationType === "retainer" ? "subscription" : "payment"

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    ui_mode: "embedded",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      user_id: user.id,
      consultation_type: consultationType,
      service_type: "consultation",
    },
  })

  return session.client_secret!
}

export async function startServiceCheckout(serviceType: string) {
  // Get current user
  const { data: { user } } = await getUser()

  if (!user) {
    throw new Error("You must be logged in to purchase this service")
  }

  // Get Price ID
  const priceId = SERVICE_PRICE_IDS[serviceType as keyof typeof SERVICE_PRICE_IDS]

  if (!priceId) {
    throw new Error("Invalid service type")
  }

  // Create or retrieve Stripe customer
  let customerId: string

  const { data: userData } = await selectSingle<{ stripe_customer_id: string }>(
    "users",
    "stripe_customer_id",
    "id = @id",
    { id: user.id }
  )

  if (userData?.stripe_customer_id) {
    customerId = userData.stripe_customer_id
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        azure_user_id: user.id,
      },
    })
    customerId = customer.id

    // Save customer ID to database
    await update("users", { stripe_customer_id: customerId }, "id = @id", { id: user.id })
  }

  // Create checkout session (all services are one-time payments)
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    ui_mode: "embedded",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      user_id: user.id,
      service_type: serviceType,
      purchase_type: "service",
    },
  })

  return session.client_secret!
}
