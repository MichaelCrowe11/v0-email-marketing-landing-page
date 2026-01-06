import { Resend } from "resend"

// Initialize lazily to avoid build-time errors
let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set")
    }
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

// Email configuration
export const EMAIL_CONFIG = {
  from: "Crowe Logic <noreply@crowelogic.com>", // Update with your verified domain
  replyTo: "support@crowelogic.com", // Update with your support email
}

// Email sending helper with error handling
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || EMAIL_CONFIG.replyTo,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log("[v0] Email sent successfully:", data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error("[v0] Email sending failed:", error)
    throw error
  }
}
