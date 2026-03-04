import crypto from "crypto"
import { createAdminClient } from "@/lib/supabase"

/**
 * Generate a license key in format: TMG-XXXX-XXXX-XXXX
 * TMG = The Mushroom Grower
 */
export function generateLicenseKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no 0/O/1/I to avoid confusion
  const segment = () =>
    Array.from(crypto.randomBytes(4))
      .map((b) => chars[b % chars.length])
      .join("")
  return `TMG-${segment()}-${segment()}-${segment()}`
}

/**
 * Store a license key in Supabase and return it.
 */
export async function createLicenseKey({
  email,
  productName,
  stripeSessionId,
  amount,
}: {
  email: string
  productName: string
  stripeSessionId: string
  amount: number
}): Promise<string> {
  const supabase = createAdminClient()
  const licenseKey = generateLicenseKey()

  const { error } = await supabase.from("license_keys").insert({
    license_key: licenseKey,
    buyer_email: email,
    product_name: productName,
    stripe_session_id: stripeSessionId,
    amount_paid: amount,
    status: "active",
  })

  if (error) {
    console.error("[License] Failed to store key:", error)
    throw new Error(`Failed to create license key: ${error.message}`)
  }

  console.log("[License] Key created:", licenseKey, "for", email)
  return licenseKey
}

/**
 * Verify a license key against Supabase.
 * Returns the key record if valid, null otherwise.
 */
export async function verifySupabaseLicenseKey(
  licenseKey: string
): Promise<{ valid: boolean; email?: string; product?: string } | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("license_keys")
    .select("buyer_email, product_name, status")
    .eq("license_key", licenseKey.trim().toUpperCase())
    .eq("status", "active")
    .single()

  if (error || !data) return null

  return {
    valid: true,
    email: data.buyer_email,
    product: data.product_name,
  }
}
