const csv = await fetch(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/payment_links-V4iKIWOWov9s6eNzjwB1IAOpk92Vdt.csv",
).then((res) => res.text())

console.log("[v0] CSV Data:", csv)

// Parse CSV
const lines = csv.split("\n")
const headers = lines[0].split(",")
const products = []

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue

  const values = lines[i].split(",")
  const product = {}

  headers.forEach((header, index) => {
    product[header.trim()] = values[index]?.trim()
  })

  products.push(product)
}

console.log("[v0] Parsed Products:", JSON.stringify(products, null, 2))
