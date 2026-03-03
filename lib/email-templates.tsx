// Email templates for Southwest Mushrooms / Crowe Logic AI platform

const BRAND = {
  primary: '#3d9a9a',
  primaryDark: '#2d7a7a',
  accent: '#d4a843',
  bg: '#f8f7f4',
  text: '#1a1916',
  muted: '#6b7280',
  font: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  siteUrl: 'https://ai.southwestmushrooms.com',
  shopUrl: 'https://shop.southwestmushrooms.com',
  skool: 'https://www.skool.com/southwestmushrooms',
}

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
          body { font-family: ${BRAND.font}; line-height: 1.6; color: ${BRAND.text}; background: ${BRAND.bg}; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: 600; color: ${BRAND.muted}; margin-bottom: 5px; }
          .value { background: ${BRAND.bg}; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; }
          .footer { text-align: center; margin-top: 30px; color: ${BRAND.muted}; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">New Contact Form Submission</h1>
            <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Southwest Mushrooms</p>
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
            <p>This email was sent from your Crowe Logic AI contact form.</p>
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
          body { font-family: ${BRAND.font}; line-height: 1.6; color: ${BRAND.text}; background: ${BRAND.bg}; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: ${BRAND.primary}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
          .button-accent { background: ${BRAND.accent}; color: ${BRAND.text}; }
          .footer { text-align: center; margin-top: 30px; color: ${BRAND.muted}; font-size: 13px; }
          .section { background: ${BRAND.bg}; padding: 16px 20px; border-radius: 8px; margin: 16px 0; }
          .section h3 { margin: 0 0 8px; color: ${BRAND.primary}; font-size: 15px; }
          .section ul { margin: 0; padding-left: 18px; }
          .section li { margin-bottom: 4px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Welcome to Southwest Mushrooms</h1>
            <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Powered by Crowe Logic AI</p>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Welcome to the community! You now have access to 18+ years of commercial mushroom cultivation expertise from Michael Crowe — backed by AI-powered tools built for serious growers.</p>

            <div class="section">
              <h3>AI Tools</h3>
              <ul>
                <li><strong>AI Assistant</strong> — Ask anything about mushroom cultivation</li>
                <li><strong>Crowe Vision</strong> — Upload a photo for instant contamination detection &amp; species ID</li>
                <li><strong>Species Library</strong> — 100+ species profiles with growing parameters</li>
              </ul>
            </div>

            <div class="section">
              <h3>Shop &amp; Resources</h3>
              <ul>
                <li><strong>Premium Liquid Cultures</strong> — Lion's Mane, Pink Oyster, Shiitake, Reishi, Cordyceps &amp; more</li>
                <li><strong>Grow Kits</strong> — Blue Oyster, Lion's Mane, Pink Oyster, Shiitake</li>
                <li><strong>Books &amp; Guides</strong> — The Mushroom Grower Vol 1 &amp; 2, SOPs, Business Blueprint</li>
                <li><strong>Supplements</strong> — Tinctures, nootropic blends, dried mushrooms</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${BRAND.siteUrl}" class="button">Explore the Platform</a>
              <br>
              <a href="${BRAND.shopUrl}" class="button button-accent" style="margin-top: 8px;">Shop Products</a>
            </div>

            <p style="margin-top: 24px;">Join our grower community on <a href="${BRAND.skool}" style="color: ${BRAND.primary}; font-weight: 600;">Skool</a> for live discussions, Q&amp;A, and grow logs.</p>

            <p>Grow with intelligence,<br><strong>Michael Crowe</strong><br><span style="color: ${BRAND.muted}; font-size: 13px;">Southwest Mushrooms / Crowe Logic AI</span></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Michael Crowe / Southwest Mushrooms. All rights reserved.</p>
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
          body { font-family: ${BRAND.font}; line-height: 1.6; color: ${BRAND.text}; background: ${BRAND.bg}; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .order-details { background: ${BRAND.bg}; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .total { font-size: 20px; font-weight: bold; color: ${BRAND.primary}; }
          .button { display: inline-block; background: ${BRAND.primary}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
          .footer { text-align: center; margin-top: 30px; color: ${BRAND.muted}; font-size: 13px; }
          .upsell { background: ${BRAND.bg}; border-left: 3px solid ${BRAND.accent}; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Order Confirmed</h1>
            <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Southwest Mushrooms</p>
          </div>
          <div class="content">
            <h2>Thank you, ${name}!</h2>
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

            <div class="upsell">
              <strong style="color: ${BRAND.accent};">Level up your grow</strong>
              <p style="margin: 8px 0 0; font-size: 14px;">Explore our full catalog — premium liquid cultures, grow kits, SOPs, The Mushroom Grower book series, and AI-powered cultivation tools.</p>
            </div>

            <div style="text-align: center;">
              <a href="${BRAND.shopUrl}" class="button">Browse the Shop</a>
            </div>

            <p>Questions? Reply to this email or reach out at <a href="mailto:Michael@CroweLogic.com" style="color: ${BRAND.primary};">Michael@CroweLogic.com</a></p>

            <p>Grow with intelligence,<br><strong>Michael Crowe</strong><br><span style="color: ${BRAND.muted}; font-size: 13px;">Southwest Mushrooms / Crowe Logic AI</span></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Michael Crowe / Southwest Mushrooms. All rights reserved.</p>
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
          body { font-family: ${BRAND.font}; line-height: 1.6; color: ${BRAND.text}; background: ${BRAND.bg}; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: ${BRAND.primary}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
          .footer { text-align: center; margin-top: 30px; color: ${BRAND.muted}; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${title}</h1>
            <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Southwest Mushrooms</p>
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
            <p>Grow with intelligence,<br><strong>Michael Crowe</strong><br><span style="color: ${BRAND.muted}; font-size: 13px;">Southwest Mushrooms / Crowe Logic AI</span></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Michael Crowe / Southwest Mushrooms. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
