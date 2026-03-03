import { config } from "dotenv"
config({ path: ".env.local" })
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Growth characteristics and culinary data for known species
const speciesEnrichment: Record<string, {
  growth_characteristics?: { colonization_days: string; fruiting_days: string }
  yield_expectations?: { biological_efficiency: string }
  culinary_notes?: string
  market_value?: string
}> = {
  "Blue Oyster": { growth_characteristics: { colonization_days: "12-18", fruiting_days: "5-7" }, yield_expectations: { biological_efficiency: "100-150% BE" }, culinary_notes: "Mild, slightly anise flavor. Excellent sautéed, in soups, or as a meat substitute.", market_value: "medium" },
  "Pearl Oyster": { growth_characteristics: { colonization_days: "10-16", fruiting_days: "5-7" }, yield_expectations: { biological_efficiency: "100-150% BE" }, culinary_notes: "Delicate, mild flavor. Versatile in cooking — sautés, soups, stir-fries.", market_value: "medium" },
  "Pink Oyster": { growth_characteristics: { colonization_days: "10-14", fruiting_days: "4-6" }, yield_expectations: { biological_efficiency: "100-150% BE" }, culinary_notes: "Bacon-like flavor when cooked at high heat. Vibrant pink color fades when cooked.", market_value: "high" },
  "Golden Oyster": { growth_characteristics: { colonization_days: "10-14", fruiting_days: "4-6" }, yield_expectations: { biological_efficiency: "80-120% BE" }, culinary_notes: "Delicate, slightly nutty, cashew-like flavor. Beautiful golden clusters.", market_value: "high" },
  "King Oyster": { growth_characteristics: { colonization_days: "18-25", fruiting_days: "7-14" }, yield_expectations: { biological_efficiency: "60-100% BE" }, culinary_notes: "Thick meaty stem, scallop-like texture. Best seared or grilled.", market_value: "very high" },
  "Italian Oyster": { growth_characteristics: { colonization_days: "12-18", fruiting_days: "5-8" }, yield_expectations: { biological_efficiency: "90-130% BE" }, culinary_notes: "Robust flavor, hearty texture. Excellent in Italian dishes and pasta.", market_value: "high" },
  "Phoenix Oyster": { growth_characteristics: { colonization_days: "12-18", fruiting_days: "5-7" }, yield_expectations: { biological_efficiency: "90-140% BE" }, culinary_notes: "Mild, delicate flavor similar to Pearl Oyster. Great warm-weather grower.", market_value: "medium" },
  "Elm Oyster": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "7-10" }, yield_expectations: { biological_efficiency: "60-100% BE" }, culinary_notes: "Mild flavor, firm texture. Good in stir-fries and soups.", market_value: "medium" },
  "Black Pearl Oyster": { growth_characteristics: { colonization_days: "12-18", fruiting_days: "5-8" }, yield_expectations: { biological_efficiency: "90-130% BE" }, culinary_notes: "Rich umami flavor with firm texture. Beautiful dark caps.", market_value: "high" },
  "Lion's Mane": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "7-10" }, yield_expectations: { biological_efficiency: "50-80% BE" }, culinary_notes: "Lobster/crab-like flavor and texture. Premium gourmet mushroom.", market_value: "very high" },
  "Shiitake": { growth_characteristics: { colonization_days: "30-60", fruiting_days: "7-10" }, yield_expectations: { biological_efficiency: "75-125% BE" }, culinary_notes: "Rich umami flavor. Excellent dried, in stir-fries, soups, and sauces.", market_value: "high" },
  "Maitake": { growth_characteristics: { colonization_days: "30-60", fruiting_days: "14-21" }, yield_expectations: { biological_efficiency: "30-60% BE" }, culinary_notes: "Rich, earthy, woodsy flavor. Excellent roasted, grilled, or in risottos.", market_value: "very high" },
  "Reishi": { growth_characteristics: { colonization_days: "30-60", fruiting_days: "60-90" }, yield_expectations: { biological_efficiency: "15-30% BE" }, culinary_notes: "Not culinary — medicinal only. Used for teas, tinctures, and extracts.", market_value: "very high" },
  "Turkey Tail": { growth_characteristics: { colonization_days: "14-28", fruiting_days: "30-60" }, yield_expectations: { biological_efficiency: "20-40% BE" }, culinary_notes: "Not culinary — medicinal only. Used for teas, tinctures, and extracts.", market_value: "high" },
  "Cordyceps": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "45-60" }, yield_expectations: { biological_efficiency: "10-25% BE" }, culinary_notes: "Mild, slightly sweet. Used in teas, broths, and supplements.", market_value: "very high" },
  "Chestnut": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "7-10" }, yield_expectations: { biological_efficiency: "50-80% BE" }, culinary_notes: "Nutty, rich flavor with crunchy cap. Popular in Asian cuisine.", market_value: "high" },
  "Pioppino": { growth_characteristics: { colonization_days: "21-35", fruiting_days: "10-14" }, yield_expectations: { biological_efficiency: "40-70% BE" }, culinary_notes: "Crunchy texture, peppery nutty flavor. Holds up well in cooking. Chef favorite.", market_value: "very high" },
  "Wine Cap": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "14-21" }, yield_expectations: { biological_efficiency: "50-100% BE" }, culinary_notes: "Burgundy caps with rich, potato-like flavor. Excellent grilled or sautéed.", market_value: "high" },
  "Nameko": { growth_characteristics: { colonization_days: "21-30", fruiting_days: "7-14" }, yield_expectations: { biological_efficiency: "40-70% BE" }, culinary_notes: "Amber caps with distinctive gelatinous coating. Essential for miso soup.", market_value: "very high" },
  "Enoki": { growth_characteristics: { colonization_days: "21-30", fruiting_days: "14-21" }, yield_expectations: { biological_efficiency: "30-60% BE" }, culinary_notes: "Delicate, mildly fruity. Excellent raw in salads or in hot pot.", market_value: "high" },
  "Chicken of the Woods": { growth_characteristics: { colonization_days: "30-60", fruiting_days: "21-35" }, yield_expectations: { biological_efficiency: "20-40% BE" }, culinary_notes: "Remarkable chicken-like flavor and texture. Excellent breaded and fried.", market_value: "very high" },
  "Black Poplar": { growth_characteristics: { colonization_days: "21-30", fruiting_days: "10-14" }, yield_expectations: { biological_efficiency: "40-70% BE" }, culinary_notes: "Delicate flavor, crisp texture. Popular in Mediterranean cuisine.", market_value: "high" },
  "Shimeji (White Beech)": { growth_characteristics: { colonization_days: "21-30", fruiting_days: "10-14" }, yield_expectations: { biological_efficiency: "50-80% BE" }, culinary_notes: "Slightly bitter raw, but nutty and mild when cooked. Always cook before eating.", market_value: "high" },
  "Shimeji (Brown Beech)": { growth_characteristics: { colonization_days: "21-30", fruiting_days: "10-14" }, yield_expectations: { biological_efficiency: "50-80% BE" }, culinary_notes: "Nuttier than white beech, with earthy flavor. Great in stir-fries.", market_value: "high" },
  "Comb Tooth": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "7-14" }, yield_expectations: { biological_efficiency: "40-70% BE" }, culinary_notes: "Similar to Lion's Mane but with cascading teeth. Mild, seafood-like flavor.", market_value: "very high" },
  "Bear's Head Tooth": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "7-14" }, yield_expectations: { biological_efficiency: "40-70% BE" }, culinary_notes: "Branching cascades of teeth. Lobster-like when sautéed in butter.", market_value: "very high" },
  "Chaga": { growth_characteristics: { colonization_days: "60-90", fruiting_days: "180-365" }, yield_expectations: { biological_efficiency: "5-15% BE" }, culinary_notes: "Not culinary — medicinal only. Used for teas and tinctures. Extremely slow growing.", market_value: "very high" },
  "Mesima": { growth_characteristics: { colonization_days: "30-60", fruiting_days: "90-180" }, yield_expectations: { biological_efficiency: "10-20% BE" }, culinary_notes: "Not culinary — medicinal only. Used in extracts and tinctures.", market_value: "very high" },
  "Agarikon": { growth_characteristics: { colonization_days: "30-60", fruiting_days: "180-365" }, yield_expectations: { biological_efficiency: "5-10% BE" }, culinary_notes: "Not culinary — medicinal only. One of the rarest and most potent medicinal fungi.", market_value: "very high" },
  "Wood Ear": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "7-14" }, yield_expectations: { biological_efficiency: "50-80% BE" }, culinary_notes: "Crunchy, gelatinous texture. Essential in hot and sour soup and Asian stir-fries.", market_value: "medium" },
  "Snow Fungus": { growth_characteristics: { colonization_days: "14-21", fruiting_days: "10-14" }, yield_expectations: { biological_efficiency: "30-50% BE" }, culinary_notes: "Translucent, jelly-like. Used in Chinese dessert soups and beauty tonics.", market_value: "high" },
  "Porcini": { growth_characteristics: { colonization_days: "60-120", fruiting_days: "30-60" }, yield_expectations: { biological_efficiency: "5-15% BE" }, culinary_notes: "King of culinary mushrooms. Rich, nutty, deeply savory. Extraordinary dried.", market_value: "very high" },
  "Morel": { growth_characteristics: { colonization_days: "60-90", fruiting_days: "30-60" }, yield_expectations: { biological_efficiency: "5-10% BE" }, culinary_notes: "Honeycomb cap, extraordinary nutty flavor. Must cook thoroughly — toxic raw.", market_value: "very high" },
  "Matsutake": { growth_characteristics: { colonization_days: "90-180", fruiting_days: "60-90" }, yield_expectations: { biological_efficiency: "1-5% BE" }, culinary_notes: "Intensely aromatic, spicy-piney flavor. Revered in Japanese cuisine.", market_value: "very high" },
  "Paddy Straw": { growth_characteristics: { colonization_days: "7-14", fruiting_days: "5-7" }, yield_expectations: { biological_efficiency: "15-30% BE" }, culinary_notes: "Silky texture, mild flavor. Popular in Southeast Asian and Chinese cooking.", market_value: "high" },
  "Tricholomopsis": { growth_characteristics: { colonization_days: "21-35", fruiting_days: "14-21" }, yield_expectations: { biological_efficiency: "20-40% BE" }, culinary_notes: "Decorative golden-orange. Some species edible with mild flavor.", market_value: "medium" },
}

async function migrate() {
  console.log("🔄 Starting data migration...\n")

  // 1. Fetch all species
  const { data: allSpecies, error: fetchErr } = await supabase
    .from("species_library")
    .select("id, common_name, optimal_temp_fruiting, humidity_range, market_value_per_lb")

  if (fetchErr) {
    console.error("❌ Failed to fetch species:", fetchErr.message)
    return
  }

  console.log(`📊 Found ${allSpecies?.length} species to update\n`)

  let updated = 0
  for (const sp of allSpecies || []) {
    const updates: Record<string, unknown> = {}

    // Parse temp range from "55-65°F"
    const tempMatch = sp.optimal_temp_fruiting?.match(/(\d+)\s*-\s*(\d+)/)
    if (tempMatch) {
      updates.optimal_temp_min = parseInt(tempMatch[1])
      updates.optimal_temp_max = parseInt(tempMatch[2])
    }

    // Parse humidity range from "85-95%"
    const humidMatch = sp.humidity_range?.match(/(\d+)\s*-\s*(\d+)/)
    if (humidMatch) {
      updates.optimal_humidity_min = parseInt(humidMatch[1])
      updates.optimal_humidity_max = parseInt(humidMatch[2])
    }

    // Fix difficulty_level to lowercase
    updates.difficulty_level = sp.common_name ? undefined : undefined // handled below

    // Map market_value from price
    const priceMatch = sp.market_value_per_lb?.match(/\$(\d+)/)
    if (priceMatch) {
      const price = parseInt(priceMatch[1])
      if (price >= 25) updates.market_value = "very high"
      else if (price >= 15) updates.market_value = "high"
      else if (price >= 8) updates.market_value = "medium"
      else updates.market_value = "low"
    }

    // Add enrichment data (growth_characteristics, yield_expectations, culinary_notes)
    const enrichment = speciesEnrichment[sp.common_name]
    if (enrichment) {
      if (enrichment.growth_characteristics) updates.growth_characteristics = enrichment.growth_characteristics
      if (enrichment.yield_expectations) updates.yield_expectations = enrichment.yield_expectations
      if (enrichment.culinary_notes) updates.culinary_notes = enrichment.culinary_notes
      if (enrichment.market_value) updates.market_value = enrichment.market_value
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from("species_library")
        .update(updates)
        .eq("id", sp.id)

      if (error) {
        console.error(`  ❌ ${sp.common_name}: ${error.message}`)
      } else {
        updated++
      }
    }
  }

  console.log(`  ✅ Species enriched: ${updated}/${allSpecies?.length}\n`)

  // 2. Fix difficulty_level to lowercase across all tables
  // Use RPC or direct updates
  const { data: speciesAll } = await supabase.from("species_library").select("id, difficulty_level")
  for (const sp of speciesAll || []) {
    if (sp.difficulty_level && sp.difficulty_level !== sp.difficulty_level.toLowerCase()) {
      await supabase.from("species_library").update({ difficulty_level: sp.difficulty_level.toLowerCase() }).eq("id", sp.id)
    }
  }
  console.log("  ✅ Species difficulty_level → lowercase\n")

  const { data: sopsAll } = await supabase.from("sop_templates").select("id, difficulty_level")
  for (const sop of sopsAll || []) {
    if (sop.difficulty_level && sop.difficulty_level !== sop.difficulty_level.toLowerCase()) {
      await supabase.from("sop_templates").update({ difficulty_level: sop.difficulty_level.toLowerCase() }).eq("id", sop.id)
    }
  }
  console.log("  ✅ SOPs difficulty_level → lowercase\n")

  const { data: contamAll } = await supabase.from("contamination_library").select("id, severity_level")
  for (const c of contamAll || []) {
    if (c.severity_level && c.severity_level !== c.severity_level.toLowerCase()) {
      await supabase.from("contamination_library").update({ severity_level: c.severity_level.toLowerCase() }).eq("id", c.id)
    }
  }
  console.log("  ✅ Contamination severity_level → lowercase\n")

  console.log("🎉 Migration complete!")
}

migrate().catch(console.error)
