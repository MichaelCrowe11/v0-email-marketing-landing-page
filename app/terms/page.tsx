export default function TermsPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Last updated: January 2025
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Agreement to Terms</h2>
            <p>
              By accessing or using Crowe Logic AI, you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Service Description</h2>
            <p>
              Crowe Logic AI provides AI-powered mycology assistance, including contamination detection, 
              cultivation guidance, and substrate optimization. The service is based on 20+ years of 
              professional experience from Michael Crowe and Southwest Mushrooms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">User Responsibilities</h2>
            <p>
              You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information when using our services</li>
              <li>Use the service for lawful purposes only</li>
              <li>Not attempt to reverse engineer or copy our AI models</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">AI Guidance Disclaimer</h2>
            <p>
              While our AI is built on extensive professional experience, it provides guidance and 
              recommendations that should be used as one tool among many in your cultivation practice. 
              Results may vary, and we recommend combining AI insights with your own expertise and judgment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Payment Terms</h2>
            <p>
              All payments are processed securely through Stripe. We offer a 30-day money-back guarantee 
              if you're not satisfied with the service. Refund requests must be submitted within 30 days 
              of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Limitation of Liability</h2>
            <p>
              Crowe Logic AI is provided "as is" without warranties of any kind. We are not liable for 
              any damages arising from your use of the service, including but not limited to crop losses 
              or business interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any 
              material changes via email or through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact</h2>
            <p>
              For questions about these Terms of Service, contact us at:{" "}
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
