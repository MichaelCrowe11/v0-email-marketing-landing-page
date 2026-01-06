// Azure database seeding API
// Run once to populate production database with initial data
import { type NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/azure/database"

export async function POST(request: NextRequest) {
  try {
    const { seedKey } = await request.json()

    // Require seed key from environment
    const validSeedKey = process.env.DATABASE_SEED_KEY
    if (!validSeedKey || seedKey !== validSeedKey) {
      return NextResponse.json(
        { error: "Invalid seed key" },
        { status: 401 }
      )
    }

    const pool = await getPool()

    // Create mushroom_species_library table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'mushroom_species_library')
      BEGIN
        CREATE TABLE mushroom_species_library (
          id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          scientific_name NVARCHAR(255) NOT NULL,
          common_name NVARCHAR(255) NOT NULL,
          difficulty_level NVARCHAR(50),
          optimal_temp_min INT,
          optimal_temp_max INT,
          fruiting_temp_min INT,
          fruiting_temp_max INT,
          optimal_humidity_min INT,
          optimal_humidity_max INT,
          optimal_co2_ppm INT,
          colonization_days INT,
          fruiting_days INT,
          light_requirements NVARCHAR(255),
          substrate_preferences NVARCHAR(MAX),
          growth_characteristics NVARCHAR(MAX),
          common_contaminants NVARCHAR(MAX),
          medicinal_properties NVARCHAR(MAX),
          yield_expectations NVARCHAR(MAX),
          harvest_indicators NVARCHAR(MAX),
          market_value NVARCHAR(255),
          culinary_notes NVARCHAR(MAX),
          image_url NVARCHAR(500),
          created_at DATETIME2 DEFAULT GETUTCDATE()
        );
      END
    `)

    // Create contamination_library table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'contamination_library')
      BEGIN
        CREATE TABLE contamination_library (
          id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          name NVARCHAR(255) NOT NULL,
          type NVARCHAR(100),
          description NVARCHAR(MAX),
          appearance NVARCHAR(MAX),
          prevention NVARCHAR(MAX),
          treatment NVARCHAR(MAX),
          severity NVARCHAR(50),
          image_url NVARCHAR(500),
          created_at DATETIME2 DEFAULT GETUTCDATE()
        );
      END
    `)

    // Create sop_templates table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sop_templates')
      BEGIN
        CREATE TABLE sop_templates (
          id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          title NVARCHAR(255) NOT NULL,
          category NVARCHAR(100),
          description NVARCHAR(MAX),
          steps NVARCHAR(MAX),
          difficulty NVARCHAR(50),
          time_estimate NVARCHAR(100),
          created_at DATETIME2 DEFAULT GETUTCDATE()
        );
      END
    `)

    // Create knowledge_base table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'knowledge_base')
      BEGIN
        CREATE TABLE knowledge_base (
          id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          title NVARCHAR(255) NOT NULL,
          category NVARCHAR(100),
          content NVARCHAR(MAX),
          tags NVARCHAR(MAX),
          is_premium BIT DEFAULT 0,
          created_at DATETIME2 DEFAULT GETUTCDATE()
        );
      END
    `)

    // Create gpt_modules table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'gpt_modules')
      BEGIN
        CREATE TABLE gpt_modules (
          id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          name NVARCHAR(255) NOT NULL,
          description NVARCHAR(MAX),
          category NVARCHAR(100),
          price DECIMAL(10,2),
          features NVARCHAR(MAX),
          is_active BIT DEFAULT 1,
          created_at DATETIME2 DEFAULT GETUTCDATE()
        );
      END
    `)

    // Seed mushroom species
    const speciesData = [
      {
        scientific_name: 'Pleurotus ostreatus',
        common_name: 'Blue Oyster Mushroom',
        difficulty_level: 'beginner',
        optimal_temp_min: 55, optimal_temp_max: 75,
        fruiting_temp_min: 50, fruiting_temp_max: 65,
        optimal_humidity_min: 85, optimal_humidity_max: 95,
        optimal_co2_ppm: 800,
        colonization_days: 7, fruiting_days: 5,
        light_requirements: 'Indirect light 12h/day',
        substrate_preferences: JSON.stringify({ primary: ['Straw', 'Hardwood sawdust', 'Coffee grounds'] }),
        growth_characteristics: JSON.stringify({ growth_rate: 'Fast', flush_count: '3-4', colonization_days: 7, fruiting_days: 5 }),
        medicinal_properties: JSON.stringify({ compounds: ['Beta-glucans', 'Lovastatin'], benefits: ['Immune support', 'Cholesterol reduction'] }),
        yield_expectations: JSON.stringify({ biological_efficiency: '75-125%', yield_per_block: '1-2 lbs' }),
        market_value: 'medium',
        culinary_notes: 'Mild, slightly sweet flavor. Excellent sautéed or in stir-fries.',
      },
      {
        scientific_name: 'Lentinula edodes',
        common_name: 'Shiitake',
        difficulty_level: 'intermediate',
        optimal_temp_min: 55, optimal_temp_max: 75,
        fruiting_temp_min: 50, fruiting_temp_max: 60,
        optimal_humidity_min: 80, optimal_humidity_max: 90,
        optimal_co2_ppm: 1000,
        colonization_days: 14, fruiting_days: 7,
        light_requirements: 'Indirect light 12h/day',
        substrate_preferences: JSON.stringify({ primary: ['Oak sawdust', 'Hardwood logs'] }),
        growth_characteristics: JSON.stringify({ growth_rate: 'Medium', flush_count: '2-3', colonization_days: 14, fruiting_days: 7 }),
        medicinal_properties: JSON.stringify({ compounds: ['Lentinan', 'Eritadenine'], benefits: ['Anti-tumor', 'Cardiovascular health'] }),
        yield_expectations: JSON.stringify({ biological_efficiency: '60-80%', yield_per_block: '0.75-1.5 lbs' }),
        market_value: 'high',
        culinary_notes: 'Rich umami flavor. Meaty texture. Excellent dried or fresh.',
      },
      {
        scientific_name: 'Hericium erinaceus',
        common_name: "Lion's Mane",
        difficulty_level: 'intermediate',
        optimal_temp_min: 65, optimal_temp_max: 75,
        fruiting_temp_min: 55, fruiting_temp_max: 65,
        optimal_humidity_min: 85, optimal_humidity_max: 95,
        optimal_co2_ppm: 500,
        colonization_days: 10, fruiting_days: 7,
        light_requirements: 'Low light preferred',
        substrate_preferences: JSON.stringify({ primary: ['Hardwood sawdust', 'Supplemented sawdust'] }),
        growth_characteristics: JSON.stringify({ growth_rate: 'Medium', flush_count: '2-3', colonization_days: 10, fruiting_days: 7 }),
        medicinal_properties: JSON.stringify({ compounds: ['Hericenones', 'Erinacines'], benefits: ['Cognitive function', 'Nerve regeneration'] }),
        yield_expectations: JSON.stringify({ biological_efficiency: '50-75%', yield_per_block: '0.5-1 lb' }),
        market_value: 'very high',
        culinary_notes: 'Seafood-like flavor, similar to crab or lobster. Tender texture.',
      },
      {
        scientific_name: 'Ganoderma lucidum',
        common_name: 'Reishi',
        difficulty_level: 'advanced',
        optimal_temp_min: 70, optimal_temp_max: 80,
        fruiting_temp_min: 65, fruiting_temp_max: 75,
        optimal_humidity_min: 85, optimal_humidity_max: 95,
        optimal_co2_ppm: 5000,
        colonization_days: 21, fruiting_days: 14,
        light_requirements: 'Indirect light 12h/day',
        substrate_preferences: JSON.stringify({ primary: ['Hardwood sawdust', 'Supplemented sawdust'] }),
        growth_characteristics: JSON.stringify({ growth_rate: 'Slow', flush_count: '1-2', colonization_days: 21, fruiting_days: 14 }),
        medicinal_properties: JSON.stringify({ compounds: ['Triterpenes', 'Polysaccharides'], benefits: ['Immune modulation', 'Anti-inflammatory'] }),
        yield_expectations: JSON.stringify({ biological_efficiency: '40-60%', yield_per_block: '0.3-0.8 lbs' }),
        market_value: 'very high',
        culinary_notes: 'Not culinary - medicinal only. Used for teas, tinctures, and extracts.',
      },
      {
        scientific_name: 'Pleurotus eryngii',
        common_name: 'King Oyster',
        difficulty_level: 'intermediate',
        optimal_temp_min: 55, optimal_temp_max: 65,
        fruiting_temp_min: 50, fruiting_temp_max: 60,
        optimal_humidity_min: 85, optimal_humidity_max: 95,
        optimal_co2_ppm: 800,
        colonization_days: 10, fruiting_days: 7,
        light_requirements: 'Indirect light 12h/day',
        substrate_preferences: JSON.stringify({ primary: ['Hardwood sawdust', 'Straw'] }),
        growth_characteristics: JSON.stringify({ growth_rate: 'Medium', flush_count: '2-3', colonization_days: 10, fruiting_days: 7 }),
        medicinal_properties: JSON.stringify({ compounds: ['Ergothioneine', 'Beta-glucans'], benefits: ['Antioxidant', 'Immune support'] }),
        yield_expectations: JSON.stringify({ biological_efficiency: '70-100%', yield_per_block: '1-1.5 lbs' }),
        market_value: 'high',
        culinary_notes: 'Meaty texture, mild flavor. Excellent grilled or roasted.',
      },
      {
        scientific_name: 'Pleurotus djamor',
        common_name: 'Pink Oyster',
        difficulty_level: 'beginner',
        optimal_temp_min: 65, optimal_temp_max: 85,
        fruiting_temp_min: 65, fruiting_temp_max: 80,
        optimal_humidity_min: 85, optimal_humidity_max: 95,
        optimal_co2_ppm: 800,
        colonization_days: 5, fruiting_days: 3,
        light_requirements: 'Indirect light 12h/day',
        substrate_preferences: JSON.stringify({ primary: ['Straw', 'Hardwood sawdust'] }),
        growth_characteristics: JSON.stringify({ growth_rate: 'Very fast', flush_count: '2-3', colonization_days: 5, fruiting_days: 3 }),
        medicinal_properties: JSON.stringify({ compounds: ['Beta-glucans', 'Antioxidants'], benefits: ['Immune support', 'Anti-inflammatory'] }),
        yield_expectations: JSON.stringify({ biological_efficiency: '80-120%', yield_per_block: '1-2 lbs' }),
        market_value: 'high',
        culinary_notes: 'Delicate flavor, slightly woody. Best cooked immediately. Vibrant pink color.',
      },
      {
        scientific_name: 'Pholiota adiposa',
        common_name: 'Chestnut Mushroom',
        difficulty_level: 'intermediate',
        optimal_temp_min: 55, optimal_temp_max: 65,
        fruiting_temp_min: 45, fruiting_temp_max: 55,
        optimal_humidity_min: 85, optimal_humidity_max: 90,
        optimal_co2_ppm: 1000,
        colonization_days: 12, fruiting_days: 7,
        light_requirements: 'Low light preferred',
        substrate_preferences: JSON.stringify({ primary: ['Hardwood sawdust', 'Supplemented sawdust'] }),
        growth_characteristics: JSON.stringify({ growth_rate: 'Medium', flush_count: '2-3', colonization_days: 12, fruiting_days: 7 }),
        medicinal_properties: JSON.stringify({ compounds: ['Beta-glucans', 'Polysaccharides'], benefits: ['Immune support', 'Antioxidant'] }),
        yield_expectations: JSON.stringify({ biological_efficiency: '60-80%', yield_per_block: '0.8-1.2 lbs' }),
        market_value: 'medium',
        culinary_notes: 'Nutty, earthy flavor. Firm texture. Excellent in soups and stews.',
      },
      {
        scientific_name: 'Pleurotus pulmonarius',
        common_name: 'Phoenix Oyster',
        difficulty_level: 'beginner',
        optimal_temp_min: 60, optimal_temp_max: 80,
        fruiting_temp_min: 55, fruiting_temp_max: 75,
        optimal_humidity_min: 85, optimal_humidity_max: 95,
        optimal_co2_ppm: 800,
        colonization_days: 7, fruiting_days: 4,
        light_requirements: 'Indirect light 12h/day',
        substrate_preferences: JSON.stringify({ primary: ['Straw', 'Hardwood sawdust', 'Cardboard'] }),
        growth_characteristics: JSON.stringify({ growth_rate: 'Fast', flush_count: '3-4', colonization_days: 7, fruiting_days: 4 }),
        medicinal_properties: JSON.stringify({ compounds: ['Beta-glucans', 'Lovastatin'], benefits: ['Immune support', 'Heart health'] }),
        yield_expectations: JSON.stringify({ biological_efficiency: '75-100%', yield_per_block: '1-1.5 lbs' }),
        market_value: 'medium',
        culinary_notes: 'Mild, delicate flavor. More heat tolerant than blue oyster.',
      },
    ]

    // Insert species data
    for (const species of speciesData) {
      await pool.request()
        .input('scientific_name', species.scientific_name)
        .input('common_name', species.common_name)
        .input('difficulty_level', species.difficulty_level)
        .input('optimal_temp_min', species.optimal_temp_min)
        .input('optimal_temp_max', species.optimal_temp_max)
        .input('fruiting_temp_min', species.fruiting_temp_min)
        .input('fruiting_temp_max', species.fruiting_temp_max)
        .input('optimal_humidity_min', species.optimal_humidity_min)
        .input('optimal_humidity_max', species.optimal_humidity_max)
        .input('optimal_co2_ppm', species.optimal_co2_ppm)
        .input('colonization_days', species.colonization_days)
        .input('fruiting_days', species.fruiting_days)
        .input('light_requirements', species.light_requirements)
        .input('substrate_preferences', species.substrate_preferences)
        .input('growth_characteristics', species.growth_characteristics)
        .input('medicinal_properties', species.medicinal_properties)
        .input('yield_expectations', species.yield_expectations)
        .input('market_value', species.market_value)
        .input('culinary_notes', species.culinary_notes)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM mushroom_species_library WHERE scientific_name = @scientific_name)
          INSERT INTO mushroom_species_library (
            scientific_name, common_name, difficulty_level,
            optimal_temp_min, optimal_temp_max, fruiting_temp_min, fruiting_temp_max,
            optimal_humidity_min, optimal_humidity_max, optimal_co2_ppm,
            colonization_days, fruiting_days, light_requirements,
            substrate_preferences, growth_characteristics,
            medicinal_properties, yield_expectations, market_value, culinary_notes
          ) VALUES (
            @scientific_name, @common_name, @difficulty_level,
            @optimal_temp_min, @optimal_temp_max, @fruiting_temp_min, @fruiting_temp_max,
            @optimal_humidity_min, @optimal_humidity_max, @optimal_co2_ppm,
            @colonization_days, @fruiting_days, @light_requirements,
            @substrate_preferences, @growth_characteristics,
            @medicinal_properties, @yield_expectations, @market_value, @culinary_notes
          )
        `)
    }

    // Seed contamination data
    const contaminationData = [
      { name: 'Trichoderma (Green Mold)', type: 'Mold', severity: 'high', description: 'Fast-spreading green mold that outcompetes mushroom mycelium', prevention: 'Proper sterilization, clean air, proper substrate moisture', treatment: 'Remove affected area, increase air flow, consider discarding if severe' },
      { name: 'Cobweb Mold', type: 'Mold', severity: 'medium', description: 'Gray, fluffy mold that spreads quickly over substrate surface', prevention: 'Good air circulation, proper humidity control', treatment: 'Spray with hydrogen peroxide 3%, increase FAE' },
      { name: 'Bacterial Blotch', type: 'Bacteria', severity: 'medium', description: 'Brown slimy spots on mushroom caps caused by Pseudomonas bacteria', prevention: 'Avoid water on caps, proper air circulation', treatment: 'Reduce humidity, increase air flow, harvest affected fruits quickly' },
      { name: 'Black Mold (Aspergillus)', type: 'Mold', severity: 'high', description: 'Black or dark green mold, potentially hazardous to health', prevention: 'Strict sterilization, HEPA filtration, proper PPE', treatment: 'Discard immediately, sanitize entire grow area' },
      { name: 'Lipstick Mold', type: 'Mold', severity: 'low', description: 'Pink or red mold that appears on grain spawn', prevention: 'Proper grain hydration, complete sterilization', treatment: 'Can sometimes be out-competed if caught early' },
    ]

    for (const contam of contaminationData) {
      await pool.request()
        .input('name', contam.name)
        .input('type', contam.type)
        .input('severity', contam.severity)
        .input('description', contam.description)
        .input('prevention', contam.prevention)
        .input('treatment', contam.treatment)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM contamination_library WHERE name = @name)
          INSERT INTO contamination_library (name, type, severity, description, prevention, treatment)
          VALUES (@name, @type, @severity, @description, @prevention, @treatment)
        `)
    }

    // Get counts
    const speciesCount = await pool.request().query('SELECT COUNT(*) as count FROM mushroom_species_library')
    const contamCount = await pool.request().query('SELECT COUNT(*) as count FROM contamination_library')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      counts: {
        species: speciesCount.recordset[0].count,
        contamination: contamCount.recordset[0].count,
      }
    })

  } catch (error) {
    console.error('[Seed Error]', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
