CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS full_name_trgm_idx ON users_table USING gin (full_name gin_trgm_ops);