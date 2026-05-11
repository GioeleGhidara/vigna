# 🍷 Vigna Fojachini: Digital Twin & Management System

[![GitHub Stars](https://img.shields.io/github/stars/GioeleGhidara/vigna?style=for-the-badge&color=emerald)](https://github.com/GioeleGhidara/vigna)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

Un'applicazione **Digital Twin (Gemello Digitale)** ad alte prestazioni per la gestione granulare del vigneto. Progettata per trasformare la viticoltura tradizionale in un processo data-driven, mantenendo un'estetica "Boutique" raffinata e un'usabilità ottimizzata per il lavoro in campo.

---

## 🎯 Obiettivo del Progetto

Vigna Fojachini nasce per abbandonare la gestione cartacea e passare a un approccio spaziale e temporale. Il sistema permette di:
- **Mappare visivamente** ogni singola vite, rispettando la geometria reale dei filari.
- **Tracciare la salute** e lo storico di ogni pianta (varietà, porta-innesto, anno di impianto).
- **Registrare operazioni** agricole (potature, trattamenti) per una tracciabilità totale.
- **Analizzare dati** statistici in tempo reale per monitorare la produttività e le perdite.

---

## 🚀 Potenzialità e Funzionalità Core

### 🛰️ Motore Grafico Passive LOD (Level of Detail)
Gestione di migliaia di punti con fluidità estrema:
- **Dinamismo efficiente**: Lo zoom e il pan non appesantiscono la CPU. La visibilità di etichette e dettagli è gestita da classi CSS native.
- **Deep Zoom (10x)**: Passa dalla visione d'insieme dell'azienda al dettaglio chirurgico della singola barbatella.
- **Birdseye View**: Ottimizzazione automatica delle risorse quando si visualizza la vigna dall'alto.

### 🧬 Gestione Identità Ibrida
Ogni vite ha una doppia anima:
1.  **UUID Tecnico**: Garantisce l'integrità dei dati a livello di database (Supabase).
2.  **Codice Etichetta (F1-001)**: Il riferimento human-readable che corrisponde ai cartellini fisici in campo.

### 🧱 Modellazione Infrastrutturale
- **Filari Dinamici**: Calcolo matematico delle posizioni e gestione dei venditori/vivai.
- **Punti di Interesse (POI)**: Iconografia professionale per alberi da frutto, pozzi, cascine e infrastrutture.
- **Impianto Massivo**: Generazione transazionale di centinaia di viti in un singolo click.

---

## 🛠️ Stack Tecnologico

- **Frontend**: React 18, Vite, TypeScript.
- **Styling**: Tailwind CSS v4 (Custom Design System "Modern Rustic").
- **State Management**: TanStack Query (React Query).
- **Persistenza**: **IndexedDB** tramite `@tanstack/query-async-storage-persister` per l'uso offline-first.
- **Mappa**: SVG Rendering puro con `react-zoom-pan-pinch`.
- **Backend**: Supabase (PostgreSQL).

---

## 💻 Setup per Sviluppatori

### 1. Requisiti
- Node.js (v18+)
- Progetto Supabase attivo

### 2. Installazione
```bash
git clone https://github.com/GioeleGhidara/vigna.git
cd vigna
npm install
```

### 3. Configurazione Database
Esegui gli script nella cartella `/supabase` sul SQL Editor di Supabase in questo ordine:
1. `supabase-schema.sql` (Struttura tabelle)
2. `alter_schema.sql` (Supporto coordinate X/Y)
3. `seed_vigna.sql` (Popolamento geometria iniziale)

### 4. Variabili d'Ambiente
Crea un file `.env.local` partendo dall'esempio:
```bash
cp .env.example .env.local
```
E inserisci i tuoi `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

---

## 🗄️ Schema del Database

### Tabelle Principali
- **`filari`**: Definizione strutturale e ordine spaziale.
- **`tipi_pianta`**: Catalogo varietà (Vermentino, Moscato, ecc.).
- **`piante`**: L'entità centrale del Digital Twin (UUID, Etichetta, Stato, Coordinate).
- **`punti_interesse`**: Landmark e infrastrutture.
- **`operazioni`**: Registro storico degli interventi agricoli.

---

## 📈 Roadmap e Migliorie Future

Il progetto è predisposto per evoluzioni di alto livello:
- **🌡️ IoT Integration**: Sensori di umidità e stazioni meteo con dati live sulla mappa.
- **🤖 Predictive Maintenance**: Algoritmi per prevedere stress idrici o malattie.
- **🛰️ Layer Satellitari**: Integrazione indici NDVI per il vigore vegetativo.
- **🔗 Blockchain Traceability**: Dal "codice etichetta" in campo al QR code sulla bottiglia.

---
*Progetto Vigna Fojachini - Digitalizzazione Agricola*
