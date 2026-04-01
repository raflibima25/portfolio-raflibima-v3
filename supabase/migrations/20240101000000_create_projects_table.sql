-- ============================================================
-- Migration: create_projects_table
-- Description: Create projects table and storage bucket
--              for portfolio project showcase feature
-- ============================================================

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        NOT NULL UNIQUE,
  name        TEXT        NOT NULL,
  description TEXT,
  stacks      TEXT[],
  link_demo   TEXT,
  link_repo   TEXT,
  is_show     BOOLEAN     NOT NULL DEFAULT true,
  order_index INT         DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_projects_slug    ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_is_show ON projects (is_show);

-- Auto update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for project cover images
-- Images should be named: {slug}.webp
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  true,
  5242880, -- 5MB max
  ARRAY['image/webp', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policy: allow public read
CREATE POLICY "Allow public read on projects bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read projects that are shown
CREATE POLICY "Projects are publicly readable"
  ON projects FOR SELECT
  USING (is_show = true);
