# AI Provider Configuration

This project supports diverse AI providers, including direct integration with **Azure OpenAI Resources**.

## Azure OpenAI Configuration

To use your custom Azure models (including `gpt-5.2` deployments):

1.  **Environment Variables**: Add these to your `.env.local` or Vercel Project Settings:
    \`\`\`bash
    AZURE_OPENAI_API_KEY="your-azure-api-key"
    AZURE_OPENAI_RESOURCE_NAME="your-resource-name" # e.g., "crowe-ai-eastus"
    \`\`\`

2.  **Model Usage**:
    - The system checks for these variables. If present, it will attempt to use Azure OpenAI.
    - If you request a model named `gpt-5.2`, it will look for a deployment named `gpt-5.2` in your Azure resource.

## Standard OpenAI

If the Azure variables are not set, the system falls back to the standard OpenAI API using:
\`\`\`bash
OPENAI_API_KEY="your-openai-api-key"
\`\`\`
