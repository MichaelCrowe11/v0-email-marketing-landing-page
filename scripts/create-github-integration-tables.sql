-- GitHub Integration Tables for Crowe Code

-- Store GitHub OAuth tokens for users
CREATE TABLE IF NOT EXISTS github_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT DEFAULT 'bearer',
  scope TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Store cloned repositories
CREATE TABLE IF NOT EXISTS github_repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL, -- e.g., "MichaelCrowe11/synapse-lang"
  repo_url TEXT NOT NULL,
  clone_path TEXT, -- Local workspace path
  default_branch TEXT DEFAULT 'main',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store file system for each workspace
CREATE TABLE IF NOT EXISTS workspace_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repository_id UUID REFERENCES github_repositories(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL, -- e.g., "src/main.syn"
  content TEXT,
  language TEXT, -- synapse, python, javascript, etc.
  is_modified BOOLEAN DEFAULT FALSE,
  last_saved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, repository_id, file_path)
);

-- Store git commits
CREATE TABLE IF NOT EXISTS git_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repository_id UUID NOT NULL REFERENCES github_repositories(id) ON DELETE CASCADE,
  commit_sha TEXT,
  commit_message TEXT NOT NULL,
  files_changed JSONB, -- Array of changed file paths
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE github_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE git_commits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own GitHub tokens" ON github_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own repositories" ON github_repositories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workspace files" ON workspace_files
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own commits" ON git_commits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own commits" ON git_commits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
