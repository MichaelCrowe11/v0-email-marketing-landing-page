import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy | Crowe Logic AI",
  description: "Refund Policy for Crowe Logic AI platform",
}

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
          <p>
            At Crowe Logic AI, we want you to be completely satisfied with our Services. This Refund Policy explains our
            policies regarding refunds for subscriptions, services, and purchases made through our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 30-Day Money-Back Guarantee</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Subscription Services</h3>
          <p>
            We offer a <strong>30-day money-back guarantee</strong> on all new subscription purchases (Pro, Expert, and
            Master Grower tiers). If you are not satisfied with your subscription for any reason within the first 30 days
            of your initial purchase, you may request a full refund.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Eligibility Requirements</h3>
          <p>To be eligible for the 30-day money-back guarantee:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>You must be a first-time subscriber to that tier</li>
            <li>The refund request must be made within 30 days of your initial purchase</li>
            <li>The refund applies only to the first billing cycle</li>
            <li>You must not have violated our Terms of Service</li>
            <li>You must not have engaged in fraudulent activity or abuse of the platform</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 What Happens After Refund</h3>
          <p>Once a refund is processed:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Your subscription will be immediately cancelled</li>
            <li>Access to paid features will be revoked</li>
            <li>Your account will revert to the Free tier</li>
            <li>Refunds are processed within 5-10 business days to your original payment method</li>
            <li>You will receive email confirmation once the refund is processed</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Subscription Renewals</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 No Refunds on Renewals</h3>
          <p>
            Subscription renewals (monthly or annual) are <strong>not eligible for refunds</strong>. The 30-day
            money-back guarantee applies only to your initial purchase, not to renewal payments.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Cancellation Before Renewal</h3>
          <p>
            To avoid being charged for a renewal period, you must cancel your subscription before the renewal date. You
            can cancel at any time through your account settings. Cancellations take effect at the end of your current
            billing period, and you will retain access until that date.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Pro-rated Refunds</h3>
          <p>
            We do not offer pro-rated refunds for subscription cancellations. If you cancel your subscription, you will
            continue to have access to paid features until the end of your current billing period, but no refund will be
            issued for the remaining time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Consultation Services</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Cancellation Policy</h3>
          <p>Consultation bookings can be cancelled or rescheduled according to the following policy:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>More than 48 hours before:</strong> Full refund</li>
            <li><strong>24-48 hours before:</strong> 50% refund</li>
            <li><strong>Less than 24 hours:</strong> No refund</li>
            <li><strong>No-show:</strong> No refund</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Rescheduling</h3>
          <p>
            You may reschedule a consultation at no charge if you provide at least 48 hours' notice. Rescheduling within
            48 hours of the appointment may incur a rescheduling fee.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Service Quality</h3>
          <p>
            If you are unsatisfied with a consultation due to service quality issues, please contact us within 7 days. We
            will review your case and may offer a partial or full refund, or a complimentary follow-up session at our
            discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Facility Design Services</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Deposit and Payment Terms</h3>
          <p>
            Facility design services require a deposit to begin work. The deposit structure is:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Small-Scale ($50,000):</strong> 50% deposit, 50% on completion</li>
            <li><strong>Mid-Scale ($150,000):</strong> 40% deposit, 30% at milestone, 30% on completion</li>
            <li><strong>Large-Scale (Custom):</strong> Payment terms defined in contract</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Refund Policy</h3>
          <p>
            Facility design service refunds are governed by the service contract. Generally:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Before work begins:</strong> Full deposit refund minus 10% administrative fee</li>
            <li><strong>After work begins:</strong> Refund of unused portion based on work completed</li>
            <li><strong>After completion:</strong> No refunds</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Satisfaction Guarantee</h3>
          <p>
            We are committed to your satisfaction with facility design services. If you are not satisfied with the final
            deliverables, we will work with you to make revisions at no additional charge until you are satisfied,
            provided the requests are within the original scope of work.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. AI Credits (Crowe Vision & Video Studio)</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.1 No Refunds</h3>
          <p>
            AI credits for Crowe Vision (contamination analysis) and Video Studio are <strong>non-refundable</strong>
            once purchased. This is because credits can be used immediately upon purchase.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Credit Expiration</h3>
          <p>
            AI credits do not expire and remain in your account until used. However, they are non-transferable and
            cannot be exchanged for cash or refunds.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Technical Issues</h3>
          <p>
            If a technical error prevents you from using credits (e.g., failed analysis, system error), we will restore
            the credits to your account at no charge. Please contact support within 48 hours of the issue.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Physical Products</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Return Window</h3>
          <p>
            Physical products (starter kits, equipment, merchandise) can be returned within <strong>30 days</strong> of
            delivery for a full refund, provided they are:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Unopened and in original packaging</li>
            <li>In new, resalable condition</li>
            <li>Not damaged or used</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Return Shipping</h3>
          <p>
            Customers are responsible for return shipping costs unless the product is defective or we shipped the wrong
            item. We recommend using a trackable shipping method.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.3 Damaged or Defective Products</h3>
          <p>
            If you receive a damaged or defective product, please contact us within 7 days with photos. We will provide a
            prepaid return label and issue a full refund or replacement at your choice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Custom AI Training</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Service Agreement</h3>
          <p>
            Custom AI training services ($4,997) are governed by a service agreement signed before work begins. Refund
            terms are defined in that agreement.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.2 General Policy</h3>
          <p>
            Generally, custom AI training services follow this refund structure:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Before work begins:</strong> Full refund minus $500 setup fee</li>
            <li><strong>After data collection begins:</strong> 50% refund</li>
            <li><strong>After model training begins:</strong> No refund</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. How to Request a Refund</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.1 Contact Information</h3>
          <p>To request a refund, please contact our support team:</p>
          <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <p><strong>Email:</strong> support@crowelogic.com</p>
            <p><strong>Subject Line:</strong> Refund Request - [Your Name]</p>
            <p><strong>Include:</strong> Account email, order number, reason for refund</p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.2 Processing Time</h3>
          <p>
            Refund requests are typically reviewed within 2-3 business days. Once approved, refunds are processed to your
            original payment method within 5-10 business days. The time for the refund to appear in your account depends
            on your bank or card issuer.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.3 Required Information</h3>
          <p>To process your refund request, please provide:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Your account email address</li>
            <li>Order or transaction ID</li>
            <li>Date of purchase</li>
            <li>Reason for refund request</li>
            <li>Any relevant supporting documentation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Non-Refundable Items</h2>
          <p>The following are <strong>not eligible for refunds</strong> under any circumstances:</p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Subscription renewals (after the initial 30-day guarantee period)</li>
            <li>AI credits (Crowe Vision, Video Studio) after purchase</li>
            <li>Master Course access after content is accessed</li>
            <li>Consultation no-shows or cancellations within 24 hours</li>
            <li>Digital products after download or access</li>
            <li>Services already rendered in full</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Fraudulent Refund Requests</h2>
          <p>
            We take fraudulent refund requests seriously. If we determine that a refund request is fraudulent or made in
            bad faith, we reserve the right to:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Deny the refund request</li>
            <li>Suspend or terminate your account</li>
            <li>Ban you from future use of our Services</li>
            <li>Pursue legal action if applicable</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Chargebacks</h2>
          <p>
            If you initiate a chargeback with your bank or credit card company instead of contacting us first, we will
            treat it as a disputed transaction. This may result in:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Immediate suspension of your account</li>
            <li>Loss of access to all services and data</li>
            <li>A permanent ban from our platform</li>
          </ul>
          <p className="mt-4">
            We strongly encourage you to contact us first to resolve any issues before initiating a chargeback. We are
            committed to working with you to find a fair resolution.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Exceptions and Special Circumstances</h2>
          <p>
            In certain exceptional circumstances (e.g., medical emergencies, technical issues preventing service use), we
            may consider refund requests outside of our standard policy on a case-by-case basis. Please contact us to
            discuss your situation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Policy Updates</h2>
          <p>
            We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an
            updated "Last Updated" date. Your continued use of our Services after changes are posted constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
          <p>
            If you have any questions about this Refund Policy or need assistance with a refund request, please contact
            us:
          </p>
          <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <p className="font-semibold">Crowe Logic AI</p>
            <p>Email: support@crowelogic.com</p>
            <p>Response Time: Within 24-48 hours</p>
            <p>Website: https://crowelogic.com</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            By making a purchase on Crowe Logic AI, you acknowledge that you have read, understood, and agree to this
            Refund Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
