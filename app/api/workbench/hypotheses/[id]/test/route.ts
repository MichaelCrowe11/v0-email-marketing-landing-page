import { NextRequest, NextResponse } from 'next/server'
import { testHypothesisWithAI } from '@/lib/ai/hypothesis-testing'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { hypothesis, datasets, sessionContext } = body

    // Validate inputs
    if (!hypothesis || !hypothesis.statement) {
      return NextResponse.json(
        { error: 'Invalid hypothesis data' },
        { status: 400 }
      )
    }

    // Test hypothesis using Azure OpenAI
    const results = await testHypothesisWithAI({
      hypothesis,
      datasets: datasets || [],
      sessionContext,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error testing hypothesis:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to test hypothesis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
