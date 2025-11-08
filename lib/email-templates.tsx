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
