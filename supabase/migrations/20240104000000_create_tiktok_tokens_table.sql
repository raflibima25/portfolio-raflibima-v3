-- ============================================================
-- Migration: create_tiktok_tokens_table
-- Description: Create tiktok_tokens table for storing
--              OAuth tokens for the TikTok API integration
--              (used by Contents page - currently hidden)
-- ============================================================

-- Table: tiktok_tokens
-- Hanya menyimpan 1 row (single static ID) karena ini
-- token untuk 1 akun TikTok creator saja (pemilik website)
CREATE TABLE IF NOT EXISTS tiktok_tokens (
  id                 UUID        PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  access_token       TEXT        NOT NULL,
  refresh_token      TEXT        NOT NULL,
  expires_at         TIMESTAMPTZ NOT NULL,
  refresh_expires_at TIMESTAMPTZ NOT NULL,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE tiktok_tokens ENABLE ROW LEVEL SECURITY;

-- Hanya service role (server-side) yang bisa akses tabel ini
-- Tidak ada policy untuk anon/authenticated karena token sensitif
-- Akses dilakukan via createClient() server-side saja
