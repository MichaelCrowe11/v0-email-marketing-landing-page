import { Pinecone } from "@pinecone-database/pinecone"

const INDEX_NAME = "mushroom-grower-chunks"
const NAMESPACE = "book-content"

let pineconeClient: Pinecone | null = null

function getPinecone(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    })
  }
  return pineconeClient
}

export interface RAGResult {
  text: string
  chapter?: number
  chapterTitle?: string
  section?: string
  volume?: number
  topics?: string[]
  score: number
}

export async function queryKnowledgeBase(
  query: string,
  topK: number = 5
): Promise<RAGResult[]> {
  if (!process.env.PINECONE_API_KEY) {
    console.warn("[RAG] No PINECONE_API_KEY set, skipping RAG")
    return []
  }

  try {
    const pc = getPinecone()
    const index = pc.index(INDEX_NAME)
    const ns = index.namespace(NAMESPACE)

    const results = await ns.searchRecords({
      query: {
        topK,
        inputs: { text: query },
      },
    })

    return (results.result?.hits || []).map((hit: any) => ({
      text: hit.fields?.chunk_text || hit.fields?.text || "",
      chapter: hit.fields?.chapter,
      chapterTitle: hit.fields?.chapter_title,
      section: hit.fields?.section,
      volume: hit.fields?.volume,
      topics: hit.fields?.topics,
      score: hit._score || 0,
    }))
  } catch (error) {
    console.error("[RAG] Pinecone query error:", error)
    return []
  }
}

export function formatRAGContext(results: RAGResult[]): string {
  if (results.length === 0) return ""

  const chunks = results.map((r, i) => {
    const source = [
      r.volume ? `Volume ${r.volume}` : null,
      r.chapter ? `Chapter ${r.chapter}` : null,
      r.chapterTitle || null,
      r.section ? `Section: ${r.section}` : null,
    ]
      .filter(Boolean)
      .join(", ")

    return `[${i + 1}] ${source}\n${r.text}`
  })

  return `[KNOWLEDGE BASE — The Mushroom Grower by Michael Crowe]\n\n${chunks.join("\n\n---\n\n")}`
}

export async function getRAGContext(query: string, topK: number = 5): Promise<string> {
  const results = await queryKnowledgeBase(query, topK)
  return formatRAGContext(results)
}
