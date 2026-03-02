import { hasValidLicense, getLicenseInfo } from "@/lib/license"

export async function GET() {
  const valid = await hasValidLicense()

  if (!valid) {
    return Response.json({ activated: false })
  }

  const info = await getLicenseInfo()

  return Response.json({
    activated: true,
    email: info?.email,
    activatedAt: info?.activatedAt,
  })
}
