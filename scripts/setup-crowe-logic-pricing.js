const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCroweLogicProducts() {
  try {
    console.log('Creating Crowe Logic subscription products...\n');

    // Pro Access Monthly
    const proMonthly = await stripe.products.create({
      name: 'Crowe Logic Pro Access',
      description: 'Complete AI-powered mycological platform with unlimited chat, contamination analysis, and cultivation tools',
      metadata: {
        tier: 'pro',
        billing: 'monthly'
      }
    });

    const proMonthlyPrice = await stripe.prices.create({
      product: proMonthly.id,
      unit_amount: 9700, // $97 in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        tier: 'pro',
        billing: 'monthly'
      }
    });

    console.log('✅ Pro Monthly created:');
    console.log(`   Product ID: ${proMonthly.id}`);
    console.log(`   Price ID: ${proMonthlyPrice.id}`);
    console.log(`   Amount: $97/month\n`);

    // Pro Access Yearly
    const proYearly = await stripe.products.create({
      name: 'Crowe Logic Pro Access (Annual)',
      description: 'Complete AI-powered mycological platform - Save $167 with annual billing',
      metadata: {
        tier: 'pro',
        billing: 'yearly'
      }
    });

    const proYearlyPrice = await stripe.prices.create({
      product: proYearly.id,
      unit_amount: 99700, // $997 in cents
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: {
        tier: 'pro',
        billing: 'yearly',
        savings: '167'
      }
    });

    console.log('✅ Pro Yearly created:');
    console.log(`   Product ID: ${proYearly.id}`);
    console.log(`   Price ID: ${proYearlyPrice.id}`);
    console.log(`   Amount: $997/year (Save $167)\n`);

    // Expert Access Monthly
    const expertMonthly = await stripe.products.create({
      name: 'Crowe Logic Expert Access',
      description: 'Everything in Pro plus all GPT modules, priority support, and monthly consulting calls',
      metadata: {
        tier: 'expert',
        billing: 'monthly'
      }
    });

    const expertMonthlyPrice = await stripe.prices.create({
      product: expertMonthly.id,
      unit_amount: 19700, // $197 in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        tier: 'expert',
        billing: 'monthly'
      }
    });

    console.log('✅ Expert Monthly created:');
    console.log(`   Product ID: ${expertMonthly.id}`);
    console.log(`   Price ID: ${expertMonthlyPrice.id}`);
    console.log(`   Amount: $197/month\n`);

    // Expert Access Yearly
    const expertYearly = await stripe.products.create({
      name: 'Crowe Logic Expert Access (Annual)',
      description: 'Everything in Pro plus all GPT modules - Save $367 with annual billing',
      metadata: {
        tier: 'expert',
        billing: 'yearly'
      }
    });

    const expertYearlyPrice = await stripe.prices.create({
      product: expertYearly.id,
      unit_amount: 199700, // $1,997 in cents
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: {
        tier: 'expert',
        billing: 'yearly',
        savings: '367'
      }
    });

    console.log('✅ Expert Yearly created:');
    console.log(`   Product ID: ${expertYearly.id}`);
    console.log(`   Price ID: ${expertYearlyPrice.id}`);
    console.log(`   Amount: $1,997/year (Save $367)\n`);

    // Master Access Monthly (Future tier)
    const masterMonthly = await stripe.products.create({
      name: 'Crowe Logic Master Access',
      description: 'White-label solution with API access, dedicated manager, and quarterly consultations',
      metadata: {
        tier: 'master',
        billing: 'monthly'
      }
    });

    const masterMonthlyPrice = await stripe.prices.create({
      product: masterMonthly.id,
      unit_amount: 49700, // $497 in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        tier: 'master',
        billing: 'monthly'
      }
    });

    console.log('✅ Master Monthly created:');
    console.log(`   Product ID: ${masterMonthly.id}`);
    console.log(`   Price ID: ${masterMonthlyPrice.id}`);
    console.log(`   Amount: $497/month\n`);

    // Master Access Yearly
    const masterYearly = await stripe.products.create({
      name: 'Crowe Logic Master Access (Annual)',
      description: 'White-label solution - Save $967 with annual billing',
      metadata: {
        tier: 'master',
        billing: 'yearly'
      }
    });

    const masterYearlyPrice = await stripe.prices.create({
      product: masterYearly.id,
      unit_amount: 499700, // $4,997 in cents
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: {
        tier: 'master',
        billing: 'yearly',
        savings: '967'
      }
    });

    console.log('✅ Master Yearly created:');
    console.log(`   Product ID: ${masterYearly.id}`);
    console.log(`   Price ID: ${masterYearlyPrice.id}`);
    console.log(`   Amount: $4,997/year (Save $967)\n`);

    // Summary
    console.log('=' .repeat(50));
    console.log('\n🎉 All products created successfully!\n');
    console.log('Add these price IDs to your .env file:\n');
    console.log(`STRIPE_PRO_MONTHLY_PRICE_ID=${proMonthlyPrice.id}`);
    console.log(`STRIPE_PRO_YEARLY_PRICE_ID=${proYearlyPrice.id}`);
    console.log(`STRIPE_EXPERT_MONTHLY_PRICE_ID=${expertMonthlyPrice.id}`);
    console.log(`STRIPE_EXPERT_YEARLY_PRICE_ID=${expertYearlyPrice.id}`);
    console.log(`STRIPE_MASTER_MONTHLY_PRICE_ID=${masterMonthlyPrice.id}`);
    console.log(`STRIPE_MASTER_YEARLY_PRICE_ID=${masterYearlyPrice.id}`);

  } catch (error) {
    console.error('Error creating products:', error);
    process.exit(1);
  }
}

// Run the script
createCroweLogicProducts();