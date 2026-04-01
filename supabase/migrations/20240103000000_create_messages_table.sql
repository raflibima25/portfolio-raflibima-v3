-- ============================================================
-- Migration: create_messages_table
-- Description: Create messages table for the Chat Room feature
--              with Supabase Realtime support
-- ============================================================

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT        NOT NULL,
  user_name   TEXT        NOT NULL,
  user_image  TEXT,
  user_email  TEXT,
  content     TEXT        NOT NULL,
  replied_to  UUID        REFERENCES messages(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_user_id    ON messages (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_replied_to ON messages (replied_to);

-- Enable Realtime untuk fitur live chat
-- Pastikan tabel ini muncul di Supabase Dashboard → Realtime → Enable
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: semua user (termasuk anonymous) bisa baca pesan
CREATE POLICY "Messages are publicly readable"
  ON messages FOR SELECT
  USING (true);

-- Policy: hanya authenticated user yang bisa insert pesan
CREATE POLICY "Authenticated users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: user hanya bisa hapus pesannya sendiri
CREATE POLICY "Users can delete their own messages"
  ON messages FOR DELETE
  USING (user_id = auth.uid()::TEXT);
