import { createClient as createAzureClient } from "@/lib/azure/client"

let client: ReturnType<typeof createAzureClient> | null = null

export function createClient() {
  if (client) return client

  client = createAzureClient()

  return client
}
