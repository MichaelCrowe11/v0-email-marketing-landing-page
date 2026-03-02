import { verifyLicenseKey, setLicenseCookie } from "@/lib/license"

export async function POST(req: Request) {
  try {
    const { licenseKey } = await req.json()

    if (!licenseKey) {
      return Response.json(
        { error: "License key is required" },
        { status: 400 }
      )
    }

    const result = await verifyLicenseKey(licenseKey)

    if (!result.valid) {
      return Response.json(
        { error: result.error || "Invalid license key" },
        { status: 401 }
      )
    }

    // Set the signed activation cookie
    await setLicenseCookie(licenseKey.trim().toUpperCase(), result.email || "")

    return Response.json({
      success: true,
      email: result.email,
      product: result.product,
    })
  } catch (error) {
    console.error("[License] Activation error:", error)
    return Response.json(
      { error: "License activation failed. Please try again." },
      { status: 500 }
    )
  }
}
