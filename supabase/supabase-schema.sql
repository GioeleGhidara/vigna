-- ==============================================================================
-- PROGETTO VIGNETO APP - SCHEMA DATABASE (v3)
-- Eseguire tutto il codice in un'unica operazione nell'SQL Editor di Supabase.
-- ==============================================================================

-- 1. TRIGGER UPDATED_AT RIUSABILE
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================

-- 2. TABELLA: tipi_pianta
CREATE TABLE tipi_pianta (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,     -- "Nebbiolo", "Barbera", etc.
  colore_hex VARCHAR(7) NOT NULL,        -- "#8B0000"
  descrizione TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed iniziale per i tipi di pianta
INSERT INTO tipi_pianta (nome, colore_hex) VALUES
  ('Nebbiolo',  '#8B0000'),
  ('Barbera',   '#1E40AF'),
  ('Moscato',   '#D97706'),
  ('Mela',      '#10B981'),
  ('Pero',      '#92400E');

-- ==============================================================================

-- 3. TABELLA: filari
CREATE TABLE filari (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  ordine INT NOT NULL UNIQUE,            -- posizione visiva in mappa (1, 2, 3...)
  descrizione TEXT,
  numero_piante INT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================================================

-- 4. TABELLA: piante
CREATE TABLE piante (
  id TEXT PRIMARY KEY,                   -- "A-1", "B-23"
  filare_id INT NOT NULL REFERENCES filari(id) ON DELETE CASCADE,
  posizione_nel_filare INT NOT NULL,
  tipo_id INT NOT NULL REFERENCES tipi_pianta(id),
  eta_anni INT,
  anno_impianto INT,
  porta_innesto VARCHAR(100),
  note TEXT,
  stato VARCHAR(20) DEFAULT 'attiva'
    CHECK (stato IN ('attiva', 'morta', 'ripiantata')),  -- constraint esplicito
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_pianta_per_filare UNIQUE(filare_id, posizione_nel_filare)
);

CREATE INDEX idx_piante_filare ON piante(filare_id);
CREATE INDEX idx_piante_tipo ON piante(tipo_id);

CREATE TRIGGER set_piante_updated_at
  BEFORE UPDATE ON piante
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ==============================================================================

-- 5. TABELLA: operazioni
CREATE TABLE operazioni (
  id SERIAL PRIMARY KEY,
  pianta_id TEXT NOT NULL REFERENCES piante(id) ON DELETE CASCADE,
  tipo VARCHAR(100) NOT NULL,
  data DATE NOT NULL,
  descrizione TEXT,
  note_aggiuntive TEXT,
  foto_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_operazioni_pianta ON operazioni(pianta_id);
CREATE INDEX idx_operazioni_data ON operazioni(data DESC);
CREATE INDEX idx_operazioni_tipo ON operazioni(tipo);

CREATE TRIGGER set_operazioni_updated_at
  BEFORE UPDATE ON operazioni
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ==============================================================================

-- 6. TABELLA: proprieta_metadata
CREATE TABLE proprieta_metadata (
  id INT PRIMARY KEY DEFAULT 1,
  nome_proprieta VARCHAR(200),
  descrizione TEXT,
  ortofoto_url TEXT,
  bounds_geojson JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
