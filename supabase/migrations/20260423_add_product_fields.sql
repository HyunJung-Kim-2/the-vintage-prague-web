ALTER TABLE products ADD COLUMN IF NOT EXISTS gender text NOT NULL DEFAULT 'unisex' CHECK (gender IN ('unisex', 'men', 'women'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS measurements jsonb;
