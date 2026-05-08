-- ==============================================================================
-- SCRIPT DI POPOLAMENTO VIGNA (SEED DATI INIZIALI) - VERSIONE AGGIORNATA
-- ==============================================================================

-- 1. Inseriamo i nuovi tipi di pianta visti nello schizzo
INSERT INTO tipi_pianta (nome, colore_hex) VALUES
  ('Moscato d''Amburgo', '#8b5a2b'),
  ('Vittoria', '#eecbad'),
  ('Italia', '#ffebcd'),
  ('Regina', '#ffd700'),
  ('Cardinale', '#cd2626'),
  ('Moscato Bianco', '#fdf5e6'),
  ('Barbarossa', '#a52a2a'),
  ('Globe', '#8b1a1a'),
  ('Crimson Seedless', '#ee3b3b'),
  ('Vermentino Montina', '#9acd32'),
  ('Rebulla Treb', '#ffff00'),
  ('Rebulla Trebbiano', '#ffd700'),
  ('Pampanino Vermentino', '#adff2f'),
  ('Montina Vermentino', '#7cfc00'),
  ('Gallo', '#dda0dd'),
  ('Olivo', '#556b2f')
ON CONFLICT (nome) DO NOTHING;

-- 2. Creiamo i filari basandoci sulle righe orizzontali
INSERT INTO filari (nome, ordine, numero_piante) VALUES
  ('Filare A (Top 1)', 1, 20),
  ('Filare B (Top 2)', 2, 20),
  ('Filare C', 3, 38),
  ('Filare D', 4, 50),
  ('Filare E', 5, 52),
  ('Filare F (Olivi)', 6, 10),
  ('Filare G', 7, 58),   -- 52 + 6 perpendicolari
  ('Filare H', 8, 53),   -- 52 + 1 perpendicolare
  ('Filare I', 9, 50),   -- 25 Gallo + 23 Pamp + 2 perpendicolari
  ('Filare L', 10, 60),  -- 57 + 3 perpendicolari
  ('Filare M', 11, 60),  -- 56 + 4 perpendicolari
  ('Filare N', 12, 46)   -- 41 + 5 perpendicolari
ON CONFLICT (nome) DO NOTHING;

-- 3. Inseriamo le piante
DO $$
DECLARE
  v_filare_id INT;
  v_tipo_id INT;
BEGIN
  -- ==========================================
  -- FILARE C: 21 Vermentino + 17 Rebulla
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare C';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Vermentino Montina';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'C-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 21) AS i;
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Rebulla Treb';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'C-' || (21 + i), v_filare_id, 21 + i, v_tipo_id FROM generate_series(1, 17) AS i;

  -- ==========================================
  -- FILARE D: 13 Vermentino + Spazio + 37 Vermentino
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare D';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Vermentino Montina';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'D-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 13) AS i;
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'D-' || (18 + i), v_filare_id, 18 + i, v_tipo_id FROM generate_series(1, 37) AS i;

  -- ==========================================
  -- FILARE E: 2 Rebulla Treb | 25 Reb Trebbiano | 25 Rebulla Treb
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare E';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Rebulla Treb';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'E-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 2) AS i;
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Rebulla Trebbiano';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'E-' || (2 + i), v_filare_id, 2 + i, v_tipo_id FROM generate_series(1, 25) AS i;
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Rebulla Treb';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'E-' || (27 + i), v_filare_id, 27 + i, v_tipo_id FROM generate_series(1, 25) AS i;

  -- ==========================================
  -- FILARE G: 52 Pampanino + 6 perpendicolari = 58
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare G';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Pampanino Vermentino';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'G-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 58) AS i;

  -- ==========================================
  -- FILARE H: 52 Montina + 1 perpendicolare = 53
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare H';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Montina Vermentino';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'H-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 53) AS i;

  -- ==========================================
  -- FILARE I: 25 Gallo + (23 + 2) Pampanino = 25
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare I';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Gallo';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'I-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 25) AS i;
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Pampanino Vermentino';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'I-' || (25 + i), v_filare_id, 25 + i, v_tipo_id FROM generate_series(1, 25) AS i;

  -- ==========================================
  -- FILARE L: 57 Montina + 3 = 60
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare L';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Vermentino Montina';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'L-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 60) AS i;

  -- ==========================================
  -- FILARE M: 56 Montina + 4 = 60
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare M';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Montina Vermentino';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'M-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 60) AS i;

  -- ==========================================
  -- FILARE N: 41 + 5 = 46
  -- ==========================================
  SELECT id INTO v_filare_id FROM filari WHERE nome = 'Filare N';
  SELECT id INTO v_tipo_id FROM tipi_pianta WHERE nome = 'Montina Vermentino';
  INSERT INTO piante (id, filare_id, posizione_nel_filare, tipo_id)
  SELECT 'N-' || i, v_filare_id, i, v_tipo_id FROM generate_series(1, 46) AS i;

END $$;
