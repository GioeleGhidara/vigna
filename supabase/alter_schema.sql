-- ==============================================================================
-- AGGIORNAMENTO SCHEMA: Coordinate Personalizzate Piante
-- Esegui questo script nel SQL Editor di Supabase
-- ==============================================================================

-- Aggiungiamo due colonne per le coordinate X e Y manuali
-- Se sono NULL, l'app userà la posizione calcolata automaticamente (in fila indiana)
-- Se sono valorizzate, la pianta verrà disegnata in quel punto esatto
ALTER TABLE piante 
ADD COLUMN IF NOT EXISTS coord_x FLOAT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS coord_y FLOAT DEFAULT NULL;

-- Aggiorniamo la vista di test se necessario (ritorna OK)
SELECT 'Colonne coord_x e coord_y aggiunte con successo!' as status;
