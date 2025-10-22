export function FAQ() {
  const faqs = [
    {
      question: "Is $97 a subscription?",
      answer:
        "No. $97 is a one-time founders price for Core. It includes 12 months of updates; you keep access forever. After 12 months, you can optionally add Updates & Support for $49/year.",
    },
    {
      question: "What makes this different from a normal chatbot?",
      answer:
        "A behavior core compiled from a year of dataset curation and full transcription of Michael's YouTube library, trained on his speech patterns and decision logic for the mycology domain.",
    },
  ]

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
