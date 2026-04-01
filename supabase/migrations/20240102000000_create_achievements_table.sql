-- ============================================================
-- Migration: create_achievements_table
-- Description: Create enum types, achievements table,
--              RPC helper function, and storage bucket
-- ============================================================

-- Enum: achievement type
CREATE TYPE achievement_type AS ENUM (
  'Certificate',
  'Award',
  'Badge',
  'Course',
  'Competition'
);

-- Enum: achievement category
CREATE TYPE achievement_category AS ENUM (
  'Backend',
  'Frontend',
  'Mobile',
  'DevOps',
  'Cloud',
  'Database',
  'Security',
  'AI/ML',
  'Other'
);

-- Table: achievements
CREATE TABLE IF NOT EXISTS achievements (
  id             UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT                 NOT NULL UNIQUE,
  name           TEXT                 NOT NULL,
  issuer         TEXT,
  type           achievement_type,
  category       achievement_category,
  issued_date    DATE,
  expired_date   DATE,
  credential_url TEXT,
  is_show        BOOLEAN              NOT NULL DEFAULT true,
  order_index    INT                  DEFAULT 0,
  created_at     TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ          NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_achievements_slug     ON achievements (slug);
CREATE INDEX IF NOT EXISTS idx_achievements_is_show  ON achievements (is_show);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements (category);
CREATE INDEX IF NOT EXISTS idx_achievements_type     ON achievements (type);

-- Auto update updated_at
CREATE OR REPLACE TRIGGER achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RPC Function: get_enum_values
-- Dipakai oleh services/achievements.ts untuk mendapatkan
-- list nilai dari enum type tertentu secara dinamis
-- ============================================================
CREATE OR REPLACE FUNCTION get_enum_values(type_name TEXT)
RETURNS TABLE(enum_value TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT e.enumlabel::TEXT
  FROM pg_enum e
  JOIN pg_type t ON e.enumtypid = t.oid
  WHERE t.typname = type_name
  ORDER BY e.enumsortorder;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Storage bucket for achievement images
-- Images should be named: {slug}.webp
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'achievements',
  'achievements',
  true,
  5242880, -- 5MB max
  ARRAY['image/webp', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policy
CREATE POLICY "Allow public read on achievements bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'achievements');

-- Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are publicly readable"
  ON achievements FOR SELECT
  USING (is_show = true);
