import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'video_metadata':
        const { data: video, error: videoError } = await supabase
          .from('ml_videos')
          .insert(data)
          .select()
          .single()
        
        if (videoError) throw videoError
        return NextResponse.json({ success: true, video })

      case 'audio_extract':
        const { data: audio, error: audioError } = await supabase
          .from('ml_audio_extracts')
          .insert(data)
          .select()
          .single()
        
        if (audioError) throw audioError
        return NextResponse.json({ success: true, audio })

      case 'speech_transcript':
        const { data: transcript, error: transcriptError } = await supabase
          .from('ml_speech_transcripts')
          .insert(data)
          .select()
          .single()
        
        if (transcriptError) throw transcriptError
        return NextResponse.json({ success: true, transcript })

      case 'frame_extract':
        const { data: frame, error: frameError } = await supabase
          .from('ml_video_frames')
          .insert(data)
          .select()
          .single()
        
        if (frameError) throw frameError
        return NextResponse.json({ success: true, frame })

      case 'embeddings':
        const { data: embedding, error: embeddingError } = await supabase
          .from('ml_embeddings')
          .insert(data)
          .select()
          .single()
        
        if (embeddingError) throw embeddingError
        return NextResponse.json({ success: true, embedding })

      default:
        return NextResponse.json(
          { error: 'Invalid data type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('ML dataset error:', error)
    return NextResponse.json(
      { error: 'Failed to process ML data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const datasetType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query
    switch (datasetType) {
      case 'training_batch':
        // Get a batch of data for training
        const { data: batch, error: batchError } = await supabase
          .rpc('get_training_batch', {
            batch_size: limit,
            batch_offset: offset
          })
        
        if (batchError) throw batchError
        return NextResponse.json({ batch })

      case 'vector_search':
        // Similarity search using pgvector
        const embedding = searchParams.get('embedding')
        if (!embedding) {
          return NextResponse.json(
            { error: 'Embedding required for vector search' },
            { status: 400 }
          )
        }

        const { data: similar, error: searchError } = await supabase
          .rpc('vector_similarity_search', {
            query_embedding: JSON.parse(embedding),
            match_count: limit
          })
        
        if (searchError) throw searchError
        return NextResponse.json({ similar })

      default:
        // Return dataset statistics
        const { data: stats, error: statsError } = await supabase
          .rpc('get_dataset_statistics')
        
        if (statsError) throw statsError
        return NextResponse.json({ stats })
    }
  } catch (error) {
    console.error('ML dataset retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve ML data' },
      { status: 500 }
    )
  }
}