import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with actual database calls
let sessions: any[] = [
  {
    id: "1",
    title: "Oyster Mushroom Contamination Study",
    description: "Analyzing green mold contamination patterns in substrate blocks",
    type: "contamination-analysis",
    status: "active",
    progress: 67,
    lastActivity: "2 hours ago",
    datasets: 3,
    hypotheses: 5,
    insights: 12,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Substrate Formula Optimization",
    description: "Testing hardwood sawdust ratios for Lion's Mane production",
    type: "substrate-optimization",
    status: "active",
    progress: 45,
    lastActivity: "5 hours ago",
    datasets: 2,
    hypotheses: 3,
    insights: 8,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Yield Prediction Model",
    description: "Building predictive model for shiitake yields based on environmental factors",
    type: "yield-prediction",
    status: "paused",
    progress: 82,
    lastActivity: "1 day ago",
    datasets: 5,
    hypotheses: 7,
    insights: 24,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

// GET /api/workbench/sessions/[id] - Fetch single session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = sessions.find(s => s.id === params.id)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

// PATCH /api/workbench/sessions/[id] - Update session
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const sessionIndex = sessions.findIndex(s => s.id === params.id)
    
    if (sessionIndex === -1) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    // Update session
    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      ...body,
      updatedAt: new Date().toISOString(),
      lastActivity: 'Just now',
    }
    
    return NextResponse.json(sessions[sessionIndex])
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

// DELETE /api/workbench/sessions/[id] - Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionIndex = sessions.findIndex(s => s.id === params.id)
    
    if (sessionIndex === -1) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    // Delete session
    sessions.splice(sessionIndex, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}
