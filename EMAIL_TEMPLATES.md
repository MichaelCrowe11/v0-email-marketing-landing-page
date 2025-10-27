# Email Templates

## 1. Welcome Email (New User Sign Up)

**Subject:** Welcome to Crowe Logic - Your Mycology Journey Starts Now

**Body:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Crowe Logic!</h1>
    </div>
    <div class="content">
      <p>Hi {{name}},</p>
      
      <p>Thank you for joining Crowe Logic! You now have access to 20+ years of professional mycology expertise powered by AI.</p>
      
      <h3>Here's what you can do right now:</h3>
      <ul>
        <li><strong>Explore the Dashboard:</strong> Track your cultivation projects and environmental data</li>
        <li><strong>Chat with AI:</strong> Get instant answers to your mycology questions</li>
        <li><strong>Browse Species Library:</strong> Learn about 50+ mushroom species</li>
        <li><strong>Join the Forum:</strong> Connect with fellow cultivators</li>
      </ul>
      
      <a href="{{siteUrl}}/dashboard" class="button">Go to Dashboard</a>
      
      <h3>Ready to unlock more?</h3>
      <p>Upgrade to Pro Access for unlimited AI chat, Crowe Vision contamination analysis, and access to professional SOPs.</p>
      
      <a href="{{siteUrl}}/pricing" class="button">View Plans</a>
      
      <p>If you have any questions, just reply to this email. We're here to help!</p>
      
      <p>Happy cultivating,<br>
      <strong>Michael Crowe</strong><br>
      Founder, Crowe Logic</p>
    </div>
    <div class="footer">
      <p>Crowe Logic | Professional Mycology Platform</p>
      <p><a href="{{siteUrl}}">Visit Website</a> | <a href="{{siteUrl}}/contact">Contact Us</a></p>
    </div>
  </div>
</body>
</html>
\`\`\`

## 2. Contact Form Submission (To Admin)

**Subject:** New Enterprise Quote Request - {{name}}

**Body:**
\`\`\`html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
    <h2 style="color: #667eea;">New Enterprise Quote Request</h2>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> {{name}}</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Phone:</strong> {{phone}}</p>
      <p><strong>Company:</strong> {{company}}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Project Details</h3>
      <p><strong>Location:</strong> {{location}}</p>
      <p><strong>Facility Type:</strong> {{facilityType}}</p>
      <p><strong>Room Count:</strong> {{roomCount}}</p>
      <p><strong>Timeline:</strong> {{timeline}}</p>
      <p><strong>Budget:</strong> {{budget}}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Message</h3>
      <p>{{message}}</p>
    </div>
    
    <p style="color: #666; font-size: 12px;">Submitted: {{timestamp}}</p>
  </div>
</body>
</html>
\`\`\`

## 3. Consultation Booking Confirmation (To Customer)

**Subject:** Your Consultation with Michael Crowe is Confirmed

**Body:**
\`\`\`html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1>Consultation Confirmed!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
      <p>Hi {{name}},</p>
      
      <p>Your consultation booking has been confirmed! Here are the details:</p>
      
      <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
        <h3 style="margin-top: 0;">{{consultationType}}</h3>
        <p><strong>Duration:</strong> {{duration}}</p>
        <p><strong>Amount Paid:</strong> ${{amount}}</p>
        <p><strong>Payment ID:</strong> {{paymentId}}</p>
      </div>
      
      <h3>What Happens Next?</h3>
      <ol>
        <li>You'll receive a scheduling link within 24 hours</li>
        <li>Choose a time that works for you</li>
        <li>Fill out the pre-consultation questionnaire</li>
        <li>Join the video call at your scheduled time</li>
      </ol>
      
      <h3>Prepare for Your Consultation</h3>
      <p>To get the most value from your time with Michael:</p>
      <ul>
        <li>Prepare specific questions or challenges</li>
        <li>Have photos of your setup ready (if applicable)</li>
        <li>Gather any relevant data or documentation</li>
        <li>Be ready to take notes</li>
      </ul>
      
      <p>If you need to reschedule, please contact us at least 48 hours in advance.</p>
      
      <p>Looking forward to working with you!</p>
      
      <p><strong>Michael Crowe</strong><br>
      Crowe Logic</p>
    </div>
  </div>
</body>
</html>
\`\`\`

## 4. Payment Receipt

**Subject:** Receipt for Your Crowe Logic Purchase

**Body:**
\`\`\`html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
    <h2 style="color: #667eea;">Payment Receipt</h2>
    
    <p>Hi {{name}},</p>
    
    <p>Thank you for your purchase! Here's your receipt:</p>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Order Details</h3>
      <p><strong>Item:</strong> {{itemName}}</p>
      <p><strong>Amount:</strong> ${{amount}}</p>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
      <p><strong>Transaction ID:</strong> {{transactionId}}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Billing Information</h3>
      <p>{{billingName}}<br>
      {{billingEmail}}</p>
    </div>
    
    <p>If you have any questions about this charge, please contact us at Michael@CroweLogic.com</p>
    
    <p style="color: #666; font-size: 12px;">This is an automated receipt. Please keep it for your records.</p>
  </div>
</body>
</html>
\`\`\`

## 5. Subscription Upgrade Confirmation

**Subject:** Welcome to {{tierName}} Access!

**Body:**
\`\`\`html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1>🎉 Welcome to {{tierName}}!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
      <p>Hi {{name}},</p>
      
      <p>Congratulations! Your account has been upgraded to <strong>{{tierName}}</strong>. You now have access to premium features that will take your cultivation to the next level.</p>
      
      <h3>Your New Features:</h3>
      <ul>
        {{#features}}
        <li>{{.}}</li>
        {{/features}}
      </ul>
      
      <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
        <h3 style="margin-top: 0;">Subscription Details</h3>
        <p><strong>Plan:</strong> {{tierName}}</p>
        <p><strong>Billing:</strong> ${{amount}}/{{billingPeriod}}</p>
        <p><strong>Next Billing Date:</strong> {{nextBillingDate}}</p>
      </div>
      
      <a href="{{siteUrl}}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Explore Your New Features
      </a>
      
      <p>Need help getting started? Check out our <a href="{{siteUrl}}/docs">documentation</a> or reach out anytime.</p>
      
      <p>Thank you for your support!</p>
      
      <p><strong>Michael Crowe</strong><br>
      Crowe Logic</p>
    </div>
  </div>
</body>
</html>
\`\`\`

## Implementation Notes

### Using Resend

\`\`\`typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Send welcome email
await resend.emails.send({
  from: 'Crowe Logic <noreply@crowelogic.com>',
  to: user.email,
  subject: 'Welcome to Crowe Logic - Your Mycology Journey Starts Now',
  html: welcomeEmailTemplate({
    name: user.full_name,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL
  })
})
\`\`\`

### Template Variables

Replace these in your templates:
- `{{name}}` - User's full name
- `{{email}}` - User's email
- `{{siteUrl}}` - Your production URL
- `{{amount}}` - Payment amount
- `{{date}}` - Current date
- `{{consultationType}}` - Type of consultation booked
- etc.
