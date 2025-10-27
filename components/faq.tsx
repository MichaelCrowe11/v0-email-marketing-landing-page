export function FAQ() {
  const faqs = [
    {
      question: "Can I use this for commercial cultivation?",
      answer:
        "Absolutely. Crowe Logic AI is built from 20+ years of commercial growing experience. It includes SOPs, contamination protocols, and yield optimization strategies used in professional operations.",
    },
    {
      question: "Does it work with image analysis?",
      answer:
        "Yes. Upload photos of contamination, fruiting bodies, or substrate issues for visual analysis with marked transfer zones and diagnostic recommendations.",
    },
    {
      question: "What species does it support?",
      answer:
        "All major gourmet and medicinal species including oyster, shiitake, lion's mane, reishi, and more. The AI has deep knowledge of species-specific cultivation parameters and troubleshooting.",
    },
    {
      question: "How accurate is the contamination detection?",
      answer:
        "The AI achieves 92%+ confidence on contamination identification, backed by thousands of real-world cases from Michael's cultivation facility and community support channels.",
    },
  ]

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-2xl p-8 shadow-xl">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-5 hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="mb-2 text-lg font-semibold text-foreground">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
