-- ==============================================================================
-- PROGETTO VIGNETO APP - SEED DATI INIZIALI
-- Popola il database con filari di esempio e configurazione base.
-- ==============================================================================

-- 1. PULIZIA (Opzionale)
-- TRUNCATE filari, tipi_pianta, piante, punti_interesse RESTART IDENTITY CASCADE;

-- 2. TIPI DI PIANTA
INSERT INTO tipi_pianta (nome, colore_hex, descrizione) VALUES
  ('Vermentino', '#10b981', 'Varietà principale per vino bianco'),
  ('Moscato',    '#fbbf24', 'Uva aromatica da tavola'),
  ('Barbera',    '#b91c1c', 'Uva a bacca nera locale'),
  ('Melo',       '#ef4444', 'Albero da frutto'),
  ('Pero',       '#f59e0b', 'Albero da frutto');

-- 3. FILARI
INSERT INTO filari (nome, ordine, numero_piante, venditore, descrizione) VALUES
  ('Filare A', 1, 10, 'Montina', 'Terrazzamento superiore'),
  ('Filare B', 2, 8,  'Montina', 'Versante Sud'),
  ('Filare C', 3, 12, 'Gallo',   'Zona pianeggiante');

-- 4. PIANTE (Esempio)
-- Nota: L'ID UUID viene generato automaticamente. Usiamo codice_etichetta come riferimento.
INSERT INTO piante (filare_id, tipo_id, posizione_nel_filare, codice_etichetta, stato, anno_impianto)
VALUES 
  (1, 1, 1, 'A-001', 'attiva', 2022),
  (1, 1, 2, 'A-002', 'attiva', 2022),
  (1, 1, 3, 'A-003', 'morta', 2022),
  (2, 2, 1, 'B-001', 'attiva', 2023),
  (2, 2, 2, 'B-002', 'ripiantata', 2024);

-- 5. PUNTI DI INTERESSE (POI)
INSERT INTO punti_interesse (nome, tipo, icona, coord_x, coord_y, descrizione)
VALUES
  ('Pozzo Principale', 'infrastruttura', 'Gauge', 150, 150, 'Punto prelievo acqua'),
  ('Magazzino Attrezzi', 'edificio', 'Warehouse', 500, 50, 'Rimessa trattori'),
  ('Melo del Nonno', 'albero', 'Apple', 1200, 300, 'Melo antico varietà autoctona');
