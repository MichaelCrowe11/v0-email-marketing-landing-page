/**
 * Test Azure OpenAI Connection
 * 
 * Run this script to verify your Azure OpenAI credentials are working:
 * npx tsx scripts/test-azure-openai.ts
 */

async function testAzureOpenAI() {
  console.log('🔍 Testing Azure OpenAI Connection...\n')

  // Check environment variables
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT
  const apiKey = process.env.AZURE_OPENAI_API_KEY
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME

  console.log('Environment Variables:')
  console.log(`✓ AZURE_OPENAI_ENDPOINT: ${endpoint ? '✓ Set' : '✗ Missing'}`)
  console.log(`✓ AZURE_OPENAI_API_KEY: ${apiKey ? '✓ Set' : '✗ Missing'}`)
  console.log(`✓ AZURE_OPENAI_DEPLOYMENT_NAME: ${deployment ? '✓ Set' : '✗ Missing'}`)
  console.log()

  if (!endpoint || !apiKey || !deployment) {
    console.error('❌ Missing required environment variables')
    console.log('\nAdd them to .env.local:')
    console.log('AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com')
    console.log('AZURE_OPENAI_API_KEY=your-api-key')
    console.log('AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4')
    process.exit(1)
  }

  // Test API call
  console.log('🚀 Making test API call...\n')

  const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Respond with valid JSON.',
          },
          {
            role: 'user',
            content: 'Say "Hello from Azure OpenAI!" in JSON format with a "message" field.',
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error (${response.status}): ${error}`)
    }

    const data = await response.json()
    const message = data.choices[0].message.content

    console.log('✅ Success! Azure OpenAI is working correctly.\n')
    console.log('Response:')
    console.log(message)
    console.log()
    console.log('📊 Usage:')
    console.log(`- Prompt tokens: ${data.usage.prompt_tokens}`)
    console.log(`- Completion tokens: ${data.usage.completion_tokens}`)
    console.log(`- Total tokens: ${data.usage.total_tokens}`)
    console.log()
    console.log('🎉 Your Azure OpenAI integration is ready!')
    console.log('You can now deploy the workbench and test hypotheses.')

  } catch (error) {
    console.error('❌ Test failed:', error)
    console.log('\nTroubleshooting:')
    console.log('1. Verify your Azure OpenAI resource is active')
    console.log('2. Check that the deployment name matches your Azure deployment')
    console.log('3. Ensure the API key is valid and not expired')
    console.log('4. Verify the endpoint URL is correct')
    console.log('5. Check that your model supports JSON mode (GPT-4 or GPT-3.5-turbo)')
    process.exit(1)
  }
}

// Run the test
testAzureOpenAI()
