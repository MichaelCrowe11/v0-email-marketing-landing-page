# Crowe Logic AI Chat Setup Guide

This guide will help you configure the AI chat interface with all required API keys and secrets.

## Required Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

### 1. Azure OpenAI (Required for AI Chat)

Get these from your Azure portal:

```bash
AZURE_AI_API_KEY=your_azure_openai_api_key_here
AZURE_AI_ENDPOINT=https://your-resource-name.openai.azure.com
```

**How to get Azure OpenAI credentials:**
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Azure OpenAI resource
3. Go to "Keys and Endpoint" section
4. Copy Key 1 and Endpoint URL

### 2. Anthropic API (Required for Image Analysis/Vision)

Get this from Anthropic Console:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**How to get Anthropic API key:**
1. Go to [Anthropic Console](https://console.anthropic.com)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key (starts with `sk-ant-`)

### 3. Supabase (Required for Database & Auth)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**How to get Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy the Project URL, anon/public key, and service_role key

### 4. Vercel Blob Storage (Required for Image Uploads)

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**How to get Vercel Blob token:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Storage > Create Database > Blob
4. Copy the generated token

## Quick Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in all the required values in `.env.local`

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Features Enabled

Once configured, you'll have access to:

- **AI Chat**: Conversational AI assistant powered by Azure OpenAI
- **Voice Input**: Speak your questions using the microphone button
- **Image Upload**: Upload mushroom cultivation images
- **Computer Vision**: AI-powered image analysis for contamination detection
- **Conversation History**: Saved conversations in Supabase
- **Multiple Models**: Switch between different AI models

## Troubleshooting

### Error: "AI service configuration error"
- Check that `AZURE_AI_API_KEY` and `AZURE_AI_ENDPOINT` are set correctly
- Verify the endpoint URL includes the full Azure OpenAI resource URL
- Ensure your Azure OpenAI deployment is active

### Error: "Vision API configuration error"
- Check that `ANTHROPIC_API_KEY` is set
- Verify the API key starts with `sk-ant-`
- Ensure you have available credits in your Anthropic account

### Image Upload Fails
- Check that `BLOB_READ_WRITE_TOKEN` is set
- Verify the image is less than 5MB
- Ensure the file is a valid image format (JPG, PNG, etc.)

### Chat Messages Not Saving
- Check all Supabase environment variables are set
- Verify your Supabase tables are created (see database schema)
- Check Supabase service role key has proper permissions

## Testing the Setup

1. **Test Chat**: Type "Hello" in the chat interface
2. **Test Voice**: Click the microphone button and speak
3. **Test Image Upload**: Click the image icon and upload a test image
4. **Test Vision**: After uploading, click "Analyze" to run computer vision

## Security Notes

- Never commit `.env.local` to version control
- Keep your API keys secure and rotate them regularly
- Use environment variables in production (Vercel/deployment platform)
- The `.env.local` file is already in `.gitignore`

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all API services have active subscriptions/credits
4. Check the network tab for failed API requests
