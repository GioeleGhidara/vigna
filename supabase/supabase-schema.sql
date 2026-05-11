-- ==============================================================================
-- PROGETTO VIGNETO APP - SCHEMA DATABASE MASTER (v4 - React 19 / Vite 8 Ready)
-- Eseguire tutto il codice in un'unica operazione nell'SQL Editor di Supabase.
-- ==============================================================================

-- 1. ESTENSIONI
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TRIGGER UPDATED_AT RIUSABILE
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================

-- 3. TABELLA: tipi_pianta
CREATE TABLE tipi_pianta (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,     -- "Nebbiolo", "Barbera", etc.
  colore_hex VARCHAR(7) NOT NULL,        -- "#8B0000"
  descrizione TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================

-- 4. TABELLA: filari
CREATE TABLE filari (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  ordine INT NOT NULL UNIQUE,            -- posizione visiva in mappa (1, 2, 3...)
  descrizione TEXT,
  numero_piante INT DEFAULT 0,
  note TEXT,
  venditore TEXT,                        -- Produttore/Vivaio di default
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================

-- 5. TABELLA: piante
CREATE TABLE piante (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filare_id INT NOT NULL REFERENCES filari(id) ON DELETE CASCADE,
  tipo_id INT NOT NULL REFERENCES tipi_pianta(id),
  posizione_nel_filare INT,              -- NULL se posizionamento libero
  codice_etichetta TEXT NOT NULL UNIQUE, -- Identificativo human-readable (es. "F1-001")
  stato VARCHAR(20) DEFAULT 'attiva'
    CHECK (stato IN ('attiva', 'morta', 'ripiantata')),
  anno_impianto INT,
  eta_anni INT,
  porta_innesto VARCHAR(100),
  note TEXT,
  venditore TEXT,                        -- Override venditore se diverso dal filare
  coord_x FLOAT DEFAULT NULL,            -- Posizione manuale su mappa
  coord_y FLOAT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_piante_filare ON piante(filare_id);
CREATE INDEX idx_piante_tipo ON piante(tipo_id);
CREATE INDEX idx_piante_etichetta ON piante(codice_etichetta);

CREATE TRIGGER set_piante_updated_at
  BEFORE UPDATE ON piante
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ==============================================================================

-- 6. TABELLA: operazioni
CREATE TABLE operazioni (
  id SERIAL PRIMARY KEY,
  pianta_id UUID NOT NULL REFERENCES piante(id) ON DELETE CASCADE,
  tipo VARCHAR(100) NOT NULL,            -- "Potatura", "Trattamento", etc.
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descrizione TEXT,
  note_aggiuntive TEXT,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_operazioni_pianta ON operazioni(pianta_id);
CREATE INDEX idx_operazioni_data ON operazioni(data DESC);

CREATE TRIGGER set_operazioni_updated_at
  BEFORE UPDATE ON operazioni
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ==============================================================================

-- 7. TABELLA: punti_interesse (POI)
CREATE TABLE punti_interesse (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'altro' 
    CHECK (tipo IN ('albero', 'edificio', 'infrastruttura', 'altro')),
  icona VARCHAR(50) DEFAULT 'Albero',     -- Identificativo icona Lucide
  coord_x FLOAT NOT NULL,
  coord_y FLOAT NOT NULL,
  descrizione TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_poi_updated_at
  BEFORE UPDATE ON punti_interesse
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ==============================================================================

-- 8. TABELLA: proprieta_metadata
CREATE TABLE proprieta_metadata (
  id INT PRIMARY KEY DEFAULT 1,
  nome_proprieta VARCHAR(200),
  descrizione TEXT,
  ortofoto_url TEXT,
  bounds_geojson JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
