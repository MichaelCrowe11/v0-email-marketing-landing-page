import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Crowe Logic AI",
  description: "Terms of Service for Crowe Logic AI platform",
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            Welcome to Crowe Logic AI ("Company", "we", "our", "us"). These Terms of Service ("Terms") govern your
            access to and use of our website, platform, and services (collectively, the "Services"). By accessing or
            using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use
            our Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            Crowe Logic AI provides an AI-powered platform for mushroom cultivation management, including but not
            limited to:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>AI chat assistance for cultivation questions and troubleshooting</li>
            <li>Contamination analysis via AI vision (Crowe Vision)</li>
            <li>Project tracking and environmental monitoring tools</li>
            <li>Educational content, SOPs, and knowledge base articles</li>
            <li>Community forum and discussion boards</li>
            <li>Consultation services with mycology experts</li>
            <li>Facility design and planning services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Account Creation</h3>
          <p>
            To access certain features of our Services, you must create an account. You agree to provide accurate,
            current, and complete information during registration and to update such information to keep it accurate,
            current, and complete.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Account Security</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account at any time for violation of these Terms or for
            any other reason at our sole discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Subscription Plans and Billing</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Subscription Tiers</h3>
          <p>We offer multiple subscription tiers with varying features and pricing:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Free Tier: Limited access to platform features</li>
            <li>Pro Tier: Enhanced features including unlimited AI chat and SOPs access</li>
            <li>Expert Tier: Advanced features including GPT modules and priority support</li>
            <li>Master Grower Tier: Full platform access including white-label options and API access</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Billing</h3>
          <p>
            Subscriptions are billed on a monthly or yearly basis, as selected by you. By providing a payment method,
            you authorize us to charge the applicable fees to your payment method. All fees are non-refundable except
            as required by law or as explicitly stated in our Refund Policy.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Automatic Renewal</h3>
          <p>
            Your subscription will automatically renew at the end of each billing period unless you cancel before the
            renewal date. You may cancel your subscription at any time through your account settings.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.4 Price Changes</h3>
          <p>
            We reserve the right to modify our pricing at any time. Price changes will not affect your current billing
            period and will take effect upon your next renewal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. AI Credits and Pay-Per-Use Services</h2>
          <p>
            Certain services, such as Crowe Vision (contamination analysis) and Video Studio, operate on a credit-based
            system. Credits are purchased separately and do not expire unless stated otherwise. Credits are
            non-refundable and non-transferable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Consultation and Professional Services</h2>
          <p>
            We offer consultation services and facility design services through our platform. These services are subject
            to separate agreements and scheduling arrangements. Payment for consultation services is required at the
            time of booking. Cancellations must be made at least 48 hours in advance for a full refund.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. User Content and Conduct</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">7.1 User-Generated Content</h3>
          <p>
            You may submit content to our Services, including forum posts, comments, project data, and images. You
            retain ownership of your content but grant us a worldwide, non-exclusive, royalty-free license to use,
            display, reproduce, and distribute your content in connection with operating and improving our Services.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Prohibited Conduct</h3>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the intellectual property rights of others</li>
            <li>Post harmful, offensive, or illegal content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use automated systems (bots) to access our Services without permission</li>
            <li>Resell or redistribute our Services without authorization</li>
            <li>Interfere with or disrupt the integrity or performance of our Services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
          <p>
            All content, features, and functionality of our Services, including but not limited to text, graphics,
            logos, icons, images, audio clips, video clips, data compilations, software, and the compilation thereof
            (collectively, "Company Content"), are owned by Crowe Logic AI or its licensors and are protected by
            copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. AI-Generated Content and Disclaimers</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">9.1 AI Accuracy</h3>
          <p>
            Our Services use artificial intelligence to provide information, analysis, and recommendations. While we
            strive for accuracy, AI-generated content may contain errors or inaccuracies. You should verify important
            information independently and consult with qualified professionals before making cultivation decisions.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.2 No Professional Advice</h3>
          <p>
            Our Services provide general information and educational content. Nothing in our Services constitutes
            professional mycological, agricultural, business, or legal advice. You should consult with qualified
            professionals for advice specific to your situation.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.3 Contamination Analysis</h3>
          <p>
            Crowe Vision uses AI to analyze images for potential contamination. Results are for informational purposes
            only and should not replace proper laboratory testing or expert consultation when making critical decisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CROWE LOGIC AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY
            OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Your use or inability to use our Services</li>
            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
            <li>Any errors or omissions in any content</li>
            <li>Any decisions made based on AI-generated content or recommendations</li>
            <li>Any crop loss, contamination, or cultivation failures</li>
          </ul>
          <p className="mt-4">
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE
            (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS
            GREATER.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Crowe Logic AI, its officers, directors, employees,
            agents, licensors, and suppliers from and against all losses, expenses, damages, and costs, including
            reasonable attorneys' fees, resulting from any violation of these Terms or any activity related to your
            account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Third-Party Services</h2>
          <p>
            Our Services may contain links to third-party websites or services that are not owned or controlled by Crowe
            Logic AI. We have no control over and assume no responsibility for the content, privacy policies, or
            practices of any third-party websites or services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Privacy</h2>
          <p>
            Your use of our Services is also governed by our Privacy Policy, which is incorporated into these Terms by
            reference. Please review our Privacy Policy to understand our practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any material changes by
            posting the new Terms on our website and updating the "Last Updated" date. Your continued use of our
            Services after such modifications constitutes your acceptance of the updated Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Termination</h2>
          <p>
            We may terminate or suspend your access to our Services immediately, without prior notice or liability, for
            any reason, including breach of these Terms. Upon termination, your right to use the Services will
            immediately cease.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the United States, without
            regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our Services
            shall be resolved through binding arbitration in accordance with the rules of the American Arbitration
            Association.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">17. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or
            eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and
            effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">18. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <p className="font-semibold">Crowe Logic AI</p>
            <p>Email: support@crowelogic.com</p>
            <p>Website: https://crowelogic.com</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            By using Crowe Logic AI, you acknowledge that you have read, understood, and agree to be bound by these
            Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}
