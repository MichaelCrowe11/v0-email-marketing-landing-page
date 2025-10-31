-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Main videos table
CREATE TABLE ml_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  duration_seconds NUMERIC,
  resolution TEXT,
  fps NUMERIC,
  codec TEXT,
  file_hash TEXT UNIQUE,
  processing_status TEXT DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audio extracts table
CREATE TABLE ml_audio_extracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES ml_videos(id) ON DELETE CASCADE,
  format TEXT NOT NULL,
  sample_rate INTEGER,
  channels INTEGER,
  bitrate INTEGER,
  duration_seconds NUMERIC,
  storage_path TEXT,
  waveform_data JSONB,
  spectral_features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Speech transcripts table
CREATE TABLE ml_speech_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES ml_videos(id) ON DELETE CASCADE,
  audio_id UUID REFERENCES ml_audio_extracts(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  confidence NUMERIC,
  timestamps JSONB,
  speaker_diarization JSONB,
  sentiment_analysis JSONB,
  entities JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video frames table
CREATE TABLE ml_video_frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES ml_videos(id) ON DELETE CASCADE,
  timestamp_seconds NUMERIC NOT NULL,
  frame_number INTEGER NOT NULL,
  storage_path TEXT,
  thumbnail_path TEXT,
  scene_detection JSONB,
  object_detection JSONB,
  face_detection JSONB,
  ocr_text TEXT,
  color_histogram JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(video_id, frame_number)
);

-- Embeddings table for vector similarity search
CREATE TABLE ml_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL, -- 'video', 'audio', 'transcript', 'frame'
  source_id UUID NOT NULL,
  model_name TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training datasets table
CREATE TABLE ml_training_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  data_types TEXT[],
  total_samples INTEGER,
  training_samples INTEGER,
  validation_samples INTEGER,
  test_samples INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, version)
);

-- Dataset samples junction table
CREATE TABLE ml_dataset_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES ml_training_datasets(id) ON DELETE CASCADE,
  video_id UUID REFERENCES ml_videos(id) ON DELETE CASCADE,
  split TEXT NOT NULL, -- 'train', 'validation', 'test'
  weight NUMERIC DEFAULT 1.0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model training runs table
CREATE TABLE ml_training_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES ml_training_datasets(id),
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  hyperparameters JSONB,
  metrics JSONB,
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  artifacts_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_ml_videos_processing_status ON ml_videos(processing_status);
CREATE INDEX idx_ml_videos_created_at ON ml_videos(created_at DESC);
CREATE INDEX idx_ml_audio_video_id ON ml_audio_extracts(video_id);
CREATE INDEX idx_ml_transcripts_video_id ON ml_speech_transcripts(video_id);
CREATE INDEX idx_ml_frames_video_id ON ml_video_frames(video_id);
CREATE INDEX idx_ml_frames_timestamp ON ml_video_frames(timestamp_seconds);
CREATE INDEX idx_ml_embeddings_source ON ml_embeddings(source_type, source_id);
CREATE INDEX idx_ml_embeddings_vector ON ml_embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_ml_dataset_samples_dataset ON ml_dataset_samples(dataset_id, split);

-- Functions for data retrieval
CREATE OR REPLACE FUNCTION get_training_batch(
  batch_size INTEGER DEFAULT 100,
  batch_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  video_id UUID,
  transcript TEXT,
  audio_features JSONB,
  frame_features JSONB,
  embeddings JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id as video_id,
    st.transcript,
    ae.spectral_features as audio_features,
    jsonb_agg(DISTINCT jsonb_build_object(
      'timestamp', vf.timestamp_seconds,
      'objects', vf.object_detection,
      'scene', vf.scene_detection
    )) as frame_features,
    jsonb_agg(DISTINCT jsonb_build_object(
      'type', e.source_type,
      'embedding', e.embedding::text
    )) as embeddings
  FROM ml_videos v
  LEFT JOIN ml_speech_transcripts st ON v.id = st.video_id
  LEFT JOIN ml_audio_extracts ae ON v.id = ae.video_id
  LEFT JOIN ml_video_frames vf ON v.id = vf.video_id
  LEFT JOIN ml_embeddings e ON v.id = e.source_id
  WHERE v.processing_status = 'completed'
  GROUP BY v.id, st.transcript, ae.spectral_features
  LIMIT batch_size
  OFFSET batch_offset;
END;
$$;

-- Vector similarity search function
CREATE OR REPLACE FUNCTION vector_similarity_search(
  query_embedding vector(1536),
  match_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  source_type TEXT,
  source_id UUID,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.source_type,
    e.source_id,
    1 - (e.embedding <=> query_embedding) as similarity
  FROM ml_embeddings e
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Dataset statistics function
CREATE OR REPLACE FUNCTION get_dataset_statistics()
RETURNS TABLE (
  total_videos BIGINT,
  total_audio_hours NUMERIC,
  total_transcripts BIGINT,
  total_frames BIGINT,
  total_embeddings BIGINT,
  avg_video_duration NUMERIC,
  languages TEXT[],
  processing_status JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT v.id) as total_videos,
    SUM(v.duration_seconds) / 3600 as total_audio_hours,
    COUNT(DISTINCT st.id) as total_transcripts,
    COUNT(DISTINCT vf.id) as total_frames,
    COUNT(DISTINCT e.id) as total_embeddings,
    AVG(v.duration_seconds) as avg_video_duration,
    ARRAY_AGG(DISTINCT st.language) as languages,
    jsonb_object_agg(
      v.processing_status,
      COUNT(*)
    ) as processing_status
  FROM ml_videos v
  LEFT JOIN ml_speech_transcripts st ON v.id = st.video_id
  LEFT JOIN ml_video_frames vf ON v.id = vf.video_id
  LEFT JOIN ml_embeddings e ON v.id = e.source_id
  GROUP BY v.processing_status;
END;
$$;

-- Row-level security policies
ALTER TABLE ml_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_audio_extracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_speech_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_video_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_training_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_dataset_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_training_runs ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for API routes)
CREATE POLICY "Service role full access" ON ml_videos
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ml_audio_extracts
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ml_speech_transcripts
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ml_video_frames
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ml_embeddings
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ml_training_datasets
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ml_dataset_samples
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ml_training_runs
  FOR ALL USING (auth.role() = 'service_role');