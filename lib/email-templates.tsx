// Email templates using HTML strings
// You can later migrate these to React Email components for better styling

export function getContactFormEmailHTML({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: 600; color: #4b5563; margin-bottom: 5px; }
          .value { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from your Crowe Logic contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getWelcomeEmailHTML({ name }: { name: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Welcome to Crowe Logic!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for joining Crowe Logic! We're excited to have you as part of our community.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>Explore our AI-powered tools and features</li>
              <li>Check out our Master Grower subscription for advanced capabilities</li>
              <li>Book a consultation with our experts</li>
              <li>Browse our educational resources</li>
            </ul>
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://crowelogic.com"}" class="button">Get Started</a>
            </div>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Crowe Logic Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Crowe Logic. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getOrderConfirmationEmailHTML({
  name,
  productName,
  amount,
  orderId,
}: {
  name: string
  productName: string
  amount: string
  orderId: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .order-details { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .total { font-size: 20px; font-weight: bold; color: #10b981; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✓ Order Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Thank you for your purchase, ${name}!</h2>
            <p>Your order has been confirmed and is being processed.</p>
            <div class="order-details">
              <div class="detail-row">
                <span>Order ID:</span>
                <span><strong>${orderId}</strong></span>
              </div>
              <div class="detail-row">
                <span>Product:</span>
                <span><strong>${productName}</strong></span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span>Amount:</span>
                <span class="total">${amount}</span>
              </div>
            </div>
            <p>You'll receive access to your purchase shortly. Check your account dashboard for details.</p>
            <p>If you have any questions about your order, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Crowe Logic Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Crowe Logic. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getNotificationEmailHTML({
  title,
  message,
  actionUrl,
  actionText,
}: {
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${title}</h1>
          </div>
          <div class="content">
            <p>${message}</p>
            ${
              actionUrl && actionText
                ? `
              <div style="text-align: center;">
                <a href="${actionUrl}" class="button">${actionText}</a>
              </div>
            `
                : ""
            }
            <p>Best regards,<br>The Crowe Logic Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Crowe Logic. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Consultation booking confirmation email
export function getConsultationConfirmationEmailHTML({
  name,
  consultationType,
  scheduledDate,
  scheduledTime,
  duration,
  amount,
  bookingId,
  joinUrl,
}: {
  name: string
  consultationType: string
  scheduledDate?: string
  scheduledTime?: string
  duration: string
  amount: string
  bookingId: string
  joinUrl?: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .booking-details { background: #f0f9ff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .detail-row { padding: 8px 0; }
          .label { font-weight: 600; color: #1e40af; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✓ Consultation Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Your consultation with Crowe Logic has been confirmed! We're excited to work with you.</p>
            <div class="booking-details">
              <div class="detail-row">
                <span class="label">Consultation Type:</span><br>
                <span>${consultationType}</span>
              </div>
              ${
                scheduledDate
                  ? `
              <div class="detail-row">
                <span class="label">Date:</span><br>
                <span>${scheduledDate}</span>
              </div>
              `
                  : ""
              }
              ${
                scheduledTime
                  ? `
              <div class="detail-row">
                <span class="label">Time:</span><br>
                <span>${scheduledTime}</span>
              </div>
              `
                  : ""
              }
              <div class="detail-row">
                <span class="label">Duration:</span><br>
                <span>${duration}</span>
              </div>
              <div class="detail-row">
                <span class="label">Amount Paid:</span><br>
                <span><strong>${amount}</strong></span>
              </div>
              <div class="detail-row">
                <span class="label">Booking ID:</span><br>
                <span style="font-family: monospace; font-size: 12px;">${bookingId}</span>
              </div>
            </div>
            ${
              scheduledDate && scheduledTime
                ? `
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>You'll receive a calendar invite shortly</li>
              <li>We'll send you a reminder 24 hours before your consultation</li>
              <li>Please have any relevant photos, data, or questions ready</li>
              <li>Cancellations must be made at least 48 hours in advance for a full refund</li>
            </ul>
            `
                : `
            <p><strong>Next Steps:</strong></p>
            <p>We'll be in touch within 24 hours to schedule your consultation at a time that works best for you.</p>
            `
            }
            ${
              joinUrl
                ? `
            <div style="text-align: center;">
              <a href="${joinUrl}" class="button">Join Consultation</a>
            </div>
            `
                : ""
            }
            <p>If you have any questions before our consultation, feel free to reply to this email.</p>
            <p>Looking forward to working with you!</p>
            <p>Best regards,<br>Michael Crowe & The Crowe Logic Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Crowe Logic. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/refund-policy" style="color: #6b7280;">Cancellation Policy</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Subscription status change email
export function getSubscriptionStatusEmailHTML({
  name,
  status,
  planName,
  reason,
  nextBillingDate,
}: {
  name: string
  status: "activated" | "cancelled" | "expired" | "payment_failed"
  planName: string
  reason?: string
  nextBillingDate?: string
}) {
  const statusConfig = {
    activated: {
      color: "#10b981",
      title: "Subscription Activated!",
      message: `Your ${planName} subscription has been activated and is now live.`,
    },
    cancelled: {
      color: "#f59e0b",
      title: "Subscription Cancelled",
      message: `Your ${planName} subscription has been cancelled. You'll retain access until the end of your current billing period.`,
    },
    expired: {
      color: "#ef4444",
      title: "Subscription Expired",
      message: `Your ${planName} subscription has expired. Your account has been downgraded to the Free tier.`,
    },
    payment_failed: {
      color: "#ef4444",
      title: "Payment Failed",
      message: `We couldn't process your payment for ${planName}. Please update your payment method to continue your subscription.`,
    },
  }

  const config = statusConfig[status]

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${config.color}; color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: ${config.color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${config.title}</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>${config.message}</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
            ${nextBillingDate ? `<p><strong>Next Billing Date:</strong> ${nextBillingDate}</p>` : ""}
            ${
              status === "payment_failed"
                ? `
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" class="button">Update Payment Method</a>
            </div>
            `
                : status === "cancelled" || status === "expired"
                  ? `
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/pricing" class="button">Reactivate Subscription</a>
            </div>
            `
                  : `
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
            `
            }
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The Crowe Logic Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Crowe Logic. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Payment receipt email
export function getPaymentReceiptEmailHTML({
  name,
  receiptNumber,
  date,
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
}: {
  name: string
  receiptNumber: string
  date: string
  items: Array<{ description: string; amount: string }>
  subtotal: string
  tax?: string
  total: string
  paymentMethod: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .receipt-info { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { text-align: left; padding: 12px; background: #f3f4f6; border-bottom: 2px solid #e5e7eb; }
          .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .total-row { font-weight: bold; font-size: 18px; background: #f9fafb; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Payment Receipt</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for your payment. Here's your receipt for your records:</p>
            <div class="receipt-info">
              <p><strong>Receipt Number:</strong> ${receiptNumber}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            </div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item) => `<tr><td>${item.description}</td><td style="text-align: right;">${item.amount}</td></tr>`).join("")}
                <tr>
                  <td><strong>Subtotal</strong></td>
                  <td style="text-align: right;"><strong>${subtotal}</strong></td>
                </tr>
                ${tax ? `<tr><td>Tax</td><td style="text-align: right;">${tax}</td></tr>` : ""}
                <tr class="total-row">
                  <td>Total</td>
                  <td style="text-align: right;">${total}</td>
                </tr>
              </tbody>
            </table>
            <p style="font-size: 14px; color: #6b7280;">This receipt is for your records. No further action is required.</p>
            <p>If you have any questions about this payment, please contact our support team.</p>
            <p>Best regards,<br>The Crowe Logic Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Crowe Logic. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
