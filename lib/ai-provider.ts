import { azure } from '@ai-sdk/azure';
import { openai } from '@ai-sdk/openai';

export const getAIProvider = (modelName: string) => {
  // Check if Azure OpenAI is configured
  const useAzure = process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_RESOURCE_NAME;

  if (useAzure) {
    // If the user requests a specific deployment like "gpt-5.2", 
    // we use that as the deployment name in Azure.
    // Otherwise fallback to what was passed or a default.
    const deploymentName = modelName.includes('/') ? modelName.split('/')[1] : modelName;
    return azure(deploymentName);
  }

  // Fallback to standard OpenAI
  return openai(modelName);
};
