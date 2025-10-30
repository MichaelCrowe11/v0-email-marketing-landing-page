export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Last updated: January 2025
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Overview</h2>
            <p>
              Crowe Logic AI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, and safeguard your information when you use our AI-powered mycology 
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (email, name)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Usage data and interactions with our AI</li>
              <li>Images you upload for analysis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our AI services</li>
              <li>Process your payments and subscriptions</li>
              <li>Send you updates and support communications</li>
              <li>Improve our AI models and accuracy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including 256-bit SSL 
              encryption for all data transmission and secure storage practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:michael@crowelogic.com" className="text-primary hover:underline">
                michael@crowelogic.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
