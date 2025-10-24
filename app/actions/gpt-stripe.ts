"use server"

import { stripe } from "@/lib/stripe"
import { getGPTProductById, getPriceInCents } from "@/lib/gpt-products"

export async function startGPTCheckoutSession(gptId: string) {
  const gpt = getGPTProductById(gptId)
  if (!gpt) {
    throw new Error(`GPT product with id "${gptId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: gpt.name,
            description: gpt.description,
            images: [], // Add GPT icon/image URL here if available
          },
          unit_amount: getPriceInCents(gpt),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      product_type: "gpt",
      gpt_id: gptId,
    },
  })

  return session.client_secret
}
