# 🍷 Vigneto App

Un'applicazione gestionale "su misura" per mappare, monitorare e gestire un vigneto a livello di singola pianta. 

## 🎯 Obiettivo del Progetto

Vigneto App nasce per abbandonare la vecchia gestione su carta (o Excel) e passare a un approccio altamente granulare basato su mappa visiva. Il sistema permette al viticoltore di:
- **Mappare visivamente** la disposizione fisica dei filari e delle singole viti, rispettando le esatte posizioni sul campo.
- **Tracciare la salute** di ogni singola pianta (età, porta innesto, varietà d'uva, stato attiva/morta/ripiantata).
- **Registrare le operazioni** agricole sul campo (potature, trattamenti, raccolti) creando uno storico dettagliato pianta per pianta, propedeutico alla compilazione del Quaderno di Campagna.
- **Analizzare i dati** tramite una dashboard statistica per avere sempre sotto controllo la composizione del vigneto e la produttività.

## 🛠️ Stack Tecnologico

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Mappa Interattiva**: SVG Rendering puro con `react-zoom-pan-pinch` per drag & drop e zoom fluido
- **Backend / Database**: Supabase (PostgreSQL)

---

## 💻 Setup per Sviluppatori

L'app è pensata per essere immediata da configurare per un ambiente single-user (o team fidato) senza logiche complesse di RLS (Row Level Security).

### 1. Requisiti
- Node.js (v18+)
- Progetto Supabase attivo

### 2. Installazione
Clona il repository e installa le dipendenze:
```bash
git clone https://github.com/GioeleGhidara/vigna.git
cd vigna
npm install
```

### 3. Configurazione Database (Supabase)
Tutti gli script necessari sono salvati nella cartella `/supabase`. Nel **SQL Editor** del tuo progetto Supabase, esegui in questo ordine:
1. `supabase-schema.sql` — Crea le tabelle (`filari`, `tipi_pianta`, `piante`, `operazioni`, ecc.) e i trigger per l'`updated_at`.
2. `alter_schema.sql` — Aggiunge le colonne per il riposizionamento libero delle coordinate (X/Y) sulla mappa.
3. `seed_vigna.sql` — Genera l'impianto base del vigneto popolando le tabelle con i filari e la geometria esatta fornita.

### 4. Variabili d'Ambiente
Crea un file `.env.local` nella root del progetto:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Avvio
```bash
npm run dev
```
L'app sarà disponibile su `http://localhost:5173`.
