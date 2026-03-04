import { cookies } from "next/headers"
import crypto from "crypto"
import { verifySupabaseLicenseKey } from "@/lib/license-keys"

const LICENSE_COOKIE = "crowelm_license"
const LICENSE_SECRET = process.env.LICENSE_SECRET
if (!LICENSE_SECRET) {
  console.warn("[CroweLogic] LICENSE_SECRET not set — license cookies will use ephemeral key")
}
const EFFECTIVE_SECRET = LICENSE_SECRET || crypto.randomUUID()

// Payhip product links for verification
const VALID_PRODUCT_LINKS = [
  process.env.PAYHIP_PRODUCT_LINK_VOL1,
  process.env.PAYHIP_PRODUCT_LINK_VOL2,
  process.env.PAYHIP_PRODUCT_LINK_BUNDLE,
  process.env.PAYHIP_PRODUCT_LINK_HARDCOVER,
].filter(Boolean) as string[]

interface PayhipVerifyResponse {
  success: boolean
  data?: {
    license_key: string
    buyer_email: string
    product_name: string
    uses: number
    max_uses: number
  }
  message?: string
}

/**
 * Verify a license key against the Payhip API.
 * Tries all configured product links until one succeeds.
 */
export async function verifyLicenseKey(licenseKey: string): Promise<{
  valid: boolean
  email?: string
  product?: string
  error?: string
}> {
  if (!licenseKey || licenseKey.trim().length === 0) {
    return { valid: false, error: "License key is required" }
  }

  const key = licenseKey.trim().toUpperCase()

  // Allow a master override key for testing/admin
  if (process.env.MASTER_LICENSE_KEY && key === process.env.MASTER_LICENSE_KEY) {
    return { valid: true, email: "admin@southwestmushrooms.com", product: "Master Access" }
  }

  // Check Supabase first (Stripe-generated keys)
  try {
    const supabaseResult = await verifySupabaseLicenseKey(key)
    if (supabaseResult?.valid) {
      return supabaseResult
    }
  } catch (e) {
    console.error("[License] Supabase verify error:", e)
  }

  // If no product links configured, accept any non-empty key in dev mode
  if (VALID_PRODUCT_LINKS.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[License] No PAYHIP_PRODUCT_LINK_* configured, accepting key in dev mode")
      return { valid: true, email: "dev@localhost", product: "Dev Mode" }
    }
    return { valid: false, error: "License verification is not configured" }
  }

  // Try each Payhip product link — the key could belong to any product
  for (const productLink of VALID_PRODUCT_LINKS) {
    try {
      const response = await fetch("https://payhip.com/api/v1/license/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_link: productLink,
          license_key: key,
        }),
      })

      if (!response.ok) continue

      const result: PayhipVerifyResponse = await response.json()

      if (result.success && result.data) {
        return {
          valid: true,
          email: result.data.buyer_email,
          product: result.data.product_name,
        }
      }
    } catch (e) {
      console.error(`[License] Payhip verify error for ${productLink}:`, e)
    }
  }

  return { valid: false, error: "Invalid license key. Please check your key and try again." }
}

/**
 * Sign a license payload to create a tamper-proof cookie value.
 */
function signLicense(payload: { key: string; email: string; activatedAt: string }): string {
  const data = JSON.stringify(payload)
  const hmac = crypto.createHmac("sha256", EFFECTIVE_SECRET).update(data).digest("hex")
  const encoded = Buffer.from(data).toString("base64")
  return `${encoded}.${hmac}`
}

/**
 * Verify and decode a signed license cookie value.
 */
function verifySignedLicense(cookieValue: string): {
  key: string
  email: string
  activatedAt: string
} | null {
  try {
    const [encoded, hmac] = cookieValue.split(".")
    if (!encoded || !hmac) return null

    const data = Buffer.from(encoded, "base64").toString("utf-8")
    const expectedHmac = crypto.createHmac("sha256", EFFECTIVE_SECRET).update(data).digest("hex")

    if (hmac !== expectedHmac) return null

    return JSON.parse(data)
  } catch {
    return null
  }
}

/**
 * Set the license activation cookie (server-side).
 */
export async function setLicenseCookie(licenseKey: string, email: string): Promise<void> {
  const cookieStore = await cookies()
  const payload = {
    key: licenseKey,
    email,
    activatedAt: new Date().toISOString(),
  }

  cookieStore.set(LICENSE_COOKIE, signLicense(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  })
}

/**
 * Check if the current request has a valid license cookie (server-side).
 */
export async function hasValidLicense(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(LICENSE_COOKIE)
    if (!cookie?.value) return false
    return verifySignedLicense(cookie.value) !== null
  } catch {
    return false
  }
}

/**
 * Get license info from cookie (server-side).
 */
export async function getLicenseInfo(): Promise<{
  key: string
  email: string
  activatedAt: string
} | null> {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(LICENSE_COOKIE)
    if (!cookie?.value) return null
    return verifySignedLicense(cookie.value)
  } catch {
    return null
  }
}

/**
 * Validate a license from a request header (for API routes).
 * Checks the cookie from the incoming request.
 */
export function validateLicenseFromHeader(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false

  const match = cookieHeader.match(new RegExp(`${LICENSE_COOKIE}=([^;]+)`))
  if (!match) return false

  return verifySignedLicense(decodeURIComponent(match[1])) !== null
}
