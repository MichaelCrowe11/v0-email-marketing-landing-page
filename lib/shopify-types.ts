export interface ShopifyProductImage {
  id: string
  src: string
  altText: string | null
}

export interface ShopifyProductVariant {
  id: string
  title: string
  price: string
  available: boolean
}

export interface ShopifyProduct {
  id: string
  title: string
  description: string
  handle: string
  images: ShopifyProductImage[]
  variants: ShopifyProductVariant[]
  tags: string[]
  productType: string
}
