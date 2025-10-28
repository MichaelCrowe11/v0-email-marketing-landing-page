import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Crowe Logic AI",
  description: "Privacy Policy for Crowe Logic AI platform",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Crowe Logic AI ("Company", "we", "our", "us"). We are committed to protecting your personal
            information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our website and services (collectively, the "Services").
          </p>
          <p className="mt-4">
            By using our Services, you consent to the data practices described in this policy. If you do not agree with
            this policy, please do not use our Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide to Us</h3>
          <p>We collect information that you voluntarily provide when you:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Create an account:</strong> Email address, password, name</li>
            <li><strong>Complete your profile:</strong> Avatar/profile picture, location, bio</li>
            <li><strong>Use our Services:</strong> Cultivation project data, environmental readings, harvest records, forum posts, comments, chat messages</li>
            <li><strong>Contact us:</strong> Name, email, phone number, company information, message content</li>
            <li><strong>Make purchases:</strong> Billing information (processed securely by Stripe)</li>
            <li><strong>Upload content:</strong> Images for contamination analysis, documents, photos</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Information Automatically Collected</h3>
          <p>When you use our Services, we automatically collect certain information, including:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Usage data:</strong> Pages viewed, features used, time spent, click patterns</li>
            <li><strong>Device information:</strong> Browser type, operating system, device identifiers</li>
            <li><strong>Log data:</strong> IP address, access times, error logs</li>
            <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 AI Interaction Data</h3>
          <p>We collect and store:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Chat conversations with our AI assistants</li>
            <li>Images submitted for contamination analysis</li>
            <li>AI-generated responses and recommendations</li>
            <li>Model selection preferences and usage patterns</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Provide and maintain our Services:</strong> Account management, feature access, data storage</li>
            <li><strong>Process transactions:</strong> Subscription billing, consultation bookings, credit purchases</li>
            <li><strong>Improve our Services:</strong> AI model training, feature development, bug fixes</li>
            <li><strong>Personalize your experience:</strong> Customized recommendations, saved preferences</li>
            <li><strong>Communicate with you:</strong> Service updates, newsletters, support responses</li>
            <li><strong>Ensure security:</strong> Fraud prevention, account protection, system integrity</li>
            <li><strong>Comply with legal obligations:</strong> Tax reporting, legal requests, regulatory requirements</li>
            <li><strong>Analytics and research:</strong> Usage statistics, performance metrics, trend analysis</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
          <p>We may share your information in the following circumstances:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Service Providers</h3>
          <p>We share information with third-party vendors who perform services on our behalf:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Supabase:</strong> Database hosting and authentication</li>
            <li><strong>Vercel:</strong> Website hosting and deployment</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>OpenAI, Anthropic, Google:</strong> AI model providers</li>
            <li><strong>Resend:</strong> Email delivery service</li>
            <li><strong>Vercel Blob:</strong> File storage</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Public Content</h3>
          <p>
            Information you post in public areas of our Services (such as forum posts and comments) is publicly visible
            to other users. Please do not share sensitive personal information in public areas.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Legal Requirements</h3>
          <p>We may disclose your information if required by law or in response to:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Legal processes (subpoenas, court orders)</li>
            <li>Government requests</li>
            <li>Protection of our rights and property</li>
            <li>Emergency situations involving safety</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.4 Business Transfers</h3>
          <p>
            If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part
            of that transaction. We will notify you before your information becomes subject to a different privacy
            policy.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.5 With Your Consent</h3>
          <p>
            We may share your information for other purposes with your explicit consent or at your direction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. AI and Machine Learning</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.1 AI Model Training</h3>
          <p>
            We may use aggregated, anonymized data from your interactions with our AI features to improve our models and
            services. We do not use your personal conversations or images for third-party AI training without your
            explicit consent.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Third-Party AI Providers</h3>
          <p>
            When you use our AI features, your queries are sent to third-party AI providers (OpenAI, Anthropic, Google,
            etc.). These providers have their own privacy policies and data handling practices. We recommend reviewing
            their policies:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>OpenAI Privacy Policy: https://openai.com/privacy/</li>
            <li>Anthropic Privacy Policy: https://www.anthropic.com/privacy</li>
            <li>Google AI Privacy Policy: https://policies.google.com/privacy</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Data Retention for AI</h3>
          <p>
            Your chat conversations and images submitted for analysis are stored in our database for the purpose of
            providing continuous service, conversation history, and improving your experience. You can request deletion
            of this data at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information,
            including:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Encryption of data in transit (SSL/TLS)</li>
            <li>Encryption of sensitive data at rest</li>
            <li>Row-level security on database tables</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure payment processing via Stripe (PCI-DSS compliant)</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive
            to protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
          <p>We retain your information for as long as necessary to:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Provide you with our Services</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p className="mt-4">
            When you delete your account, we will delete or anonymize your personal information within 90 days, except
            where we are required to retain it for legal or regulatory purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Your Privacy Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Access and Portability</h3>
          <p>You have the right to access your personal information and request a copy of your data in a portable format.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Correction</h3>
          <p>You have the right to correct inaccurate or incomplete personal information. You can update most information through your account settings.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.3 Deletion</h3>
          <p>You have the right to request deletion of your personal information, subject to certain exceptions (e.g., legal obligations).</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.4 Opt-Out</h3>
          <p>You have the right to opt out of:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Marketing emails (unsubscribe link in emails)</li>
            <li>Certain data collection practices (cookie preferences)</li>
            <li>Sale of personal information (we do not sell personal information)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.5 Restriction</h3>
          <p>You have the right to request restriction of processing of your personal information in certain circumstances.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.6 Exercising Your Rights</h3>
          <p>
            To exercise any of these rights, please contact us at support@crowelogic.com. We will respond to your request
            within 30 days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Essential cookies:</strong> Required for authentication and basic functionality</li>
            <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Analytics cookies:</strong> Understand how you use our Services (Vercel Analytics)</li>
          </ul>
          <p className="mt-4">
            You can control cookies through your browser settings. However, disabling certain cookies may limit your
            ability to use some features of our Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. These
            countries may have different data protection laws. By using our Services, you consent to the transfer of your
            information to the United States and other countries where we or our service providers operate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
          <p>
            Our Services are not directed to children under the age of 13 (or 16 in the European Union). We do not
            knowingly collect personal information from children. If you believe we have collected information from a
            child, please contact us immediately, and we will delete such information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. California Privacy Rights (CCPA)</h2>
          <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Right to know what personal information we collect, use, and disclose</li>
            <li>Right to request deletion of your personal information</li>
            <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
            <li>Right to non-discrimination for exercising your privacy rights</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, contact us at support@crowelogic.com or call [phone number].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. European Privacy Rights (GDPR)</h2>
          <p>If you are in the European Economic Area, you have rights under the General Data Protection Regulation:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
            <li>Right to lodge a complaint with a supervisory authority</li>
          </ul>
          <p className="mt-4">
            Our legal basis for processing your information includes: consent, contractual necessity, legal obligations,
            and legitimate interests.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Third-Party Links</h2>
          <p>
            Our Services may contain links to third-party websites or services. We are not responsible for the privacy
            practices of these third parties. We encourage you to read their privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting
            the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this
            Privacy Policy periodically.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <p className="font-semibold">Crowe Logic AI</p>
            <p>Email: support@crowelogic.com</p>
            <p>Email (Privacy): privacy@crowelogic.com</p>
            <p>Website: https://crowelogic.com</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            By using Crowe Logic AI, you acknowledge that you have read and understood this Privacy Policy and consent to
            the collection, use, and disclosure of your information as described herein.
          </p>
        </div>
      </div>
    </div>
  )
}
