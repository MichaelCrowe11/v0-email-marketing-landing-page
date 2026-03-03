import Client from "shopify-buy"

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN

export const shopifyClient = domain && storefrontAccessToken
  ? Client.buildClient({
      domain,
      storefrontAccessToken,
      apiVersion: "2024-10",
    })
  : null
