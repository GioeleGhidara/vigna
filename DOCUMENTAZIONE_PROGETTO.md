# Documentazione Tecnica: Vigna Fojachini App

## 🍷 Visione del Progetto
L'applicazione **Vigna Fojachini** è un sistema di gestione e modellazione digitale del vigneto ad alte prestazioni. Progettata con un'estetica "Boutique" (Premium Dark/Paper), permette di mappare ogni singola vite, monitorarne lo stato di salute e configurare l'intera struttura dei filari in modo dinamico.

---

## 🛠️ Stack Tecnologico
- **Frontend**: React + Vite (TypeScript)
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS (Design System personalizzato)
- **Animazioni**: Framer Motion
- **Gestione Stato/Cache**: TanStack Query (React Query)
- **Mappa Interattiva**: SVG + `react-zoom-pan-pinch`

---

## 🗺️ 1. Mappa Interattiva & Navigazione

La mappa utilizza un sistema di rendering SVG puro per garantire velocità e nitidezza su ogni zoom.

### Zoom e Pan (`MapCanvas.tsx`)
Utilizziamo `react-zoom-pan-pinch` per gestire le interazioni touch e mouse.
```tsx
<TransformWrapper 
  minScale={0.05} 
  maxScale={4} 
  initialScale={0.2} 
  centerOnInit
  panning={{ disabled: !!repositioningId }} // Disabilita pan durante lo spostamento manuale
>
  <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
    <svg width={width} height={height}>
      {/* Contenuto dinamico della mappa */}
    </svg>
  </TransformComponent>
</TransformWrapper>
```

### Acquisizione Coordinate da Click (`MapCanvas.tsx`)
Per spostare una pianta "a mano", convertiamo le coordinate dello schermo in coordinate SVG relative.
```tsx
const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
  if (!repositioningId) return;
  const svg = e.currentTarget;
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  // Invertiamo la matrice di trasformazione (zoom/pan) per trovare il punto esatto nell'SVG
  const cursorPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
  onReposition(repositioningId, Math.round(cursorPt.x), Math.round(cursorPt.y));
};
```

---

## 🏗️ 2. Modellazione del Vigneto (CRUD)

### Gestione Filari e Varietà
Le operazioni di aggiunta e modifica utilizzano React Query per la sincronizzazione immediata.

**Snippet: Hook di Gestione (`useFilari.ts`)**
```typescript
const { mutateAsync: createFilare } = useMutation({
  mutationFn: (data: Partial<Filare>) => 
    supabase.from('filari').insert(data).throwOnError(),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['filari'] }),
});

const { mutateAsync: updateFilare } = useMutation({
  mutationFn: ({ id, data }) => 
    supabase.from('filari').update(data).eq('id', id).throwOnError(),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['filari'] }),
});
```

### Architettura "Digital Twin" Dinamica
La mappa combina elementi statici di contesto con elementi dinamici gestibili dall'utente:
1.  **Aree Naturali (Statiche)**: Bosco e confini fluviali (definiti via codice per stabilità).
2.  **Landmarks & Infrastrutture (Dinamici)**: Gestiti tramite la tabella `punti_interesse`.
    *   **Frutteto (Tabler Icons)**: Gli alberi da frutto (sia singoli che nei filari) utilizzano icone SVG professionali:
        *   🍎 `IconApple` (Melo/Pero), 🍒 `IconCherry` (Ciliegio)
        *   🍋 `IconLemon` (Limone), 🍌 `IconBanana` (Banana)
        *   🌸 `IconFlower` (Pesco/Albicocco), 🌿 `IconLeaf` (Vite)

Tutti gli alberi da frutto, anche se piantati nei filari del vigneto, mostreranno la loro icona specifica al posto del classico cerchio, permettendo una distinzione immediata delle varietà.
    *   **Infrastrutture**: Punti acqua (`Droplets`), centraline (`Gauge`), pali elettrici (`UtilityPole`).
    *   **Edifici**: Cascine e magazzini (`Home`, `Warehouse`).

Tutti i landmark possono essere **aggiunti, spostati, rinominati o eliminati** direttamente dalla mappa o dalla sidebar della Dashboard.

### Sistema di Posizionamento Ibrido (`PiantaForm.tsx`)
L'app permette di scegliere tra un posizionamento matematico (in linea) o libero.
```tsx
const finalData = {
  ...form,
  // Se 'line', le coordinate X/Y diventano NULL (il calcolo è automatico)
  // Se 'free', la posizione_nel_filare diventa NULL
  posizione_nel_filare: placementMode === 'line' ? form.posizione_nel_filare : null,
  coord_x: placementMode === 'free' ? form.coord_x : null,
  coord_y: placementMode === 'free' ? form.coord_y : null,
};
```

### Sincronizzazione Dati Real-time
- **Optimistic Updates**: Tutte le operazioni sui filari e sulle viti (spostamento, cambio stato) sono "ottimiste". L'interfaccia si aggiorna istantaneamente prima ancora che il server risponda. In caso di errore, il sistema effettua un "rollback" automatico ai dati precedenti.
- **Calcolo Ottimizzato**: Le statistiche della dashboard sono avvolte in `useMemo` con tipizzazione rigorosa, garantendo che i calcoli avvengano solo quando i dati cambiano effettivamente.

---

## 📊 3. Dashboard & Statistiche

### Aggregazione Dati Real-time
Le statistiche vengono ricalcolate ad ogni modifica dei dati tramite `useMemo` o `reduce`.

**Snippet: Calcolo Stato (`DashboardPage.tsx`)**
```typescript
const statoPiante = useMemo(() => {
  return piante.reduce((acc: Record<string, number>, p) => { 
    acc[p.stato] = (acc[p.stato] || 0) + 1;
    return acc; 
  }, { attiva: 0, morta: 0, ripiantata: 0 });
}, [piante]);
```

### Creazione Massiva in Serie (`PiantaBulkAdd.tsx`)
Permette di popolare un filare intero in pochi secondi.
```typescript
const piante = [];
for (let i = 0; i < form.count; i++) {
  const pos = form.start + i;
  piante.push({
    id: `${form.prefix}${pos.toString().padStart(3, '0')}`,
    filare_id: form.filare_id,
    posizione_nel_filare: pos,
    stato: 'attiva',
    anno_impianto: form.anno_impianto,
  });
}
await supabase.from('piante').insert(piante);
```

---

## 🎨 4. Design System & UX

### Design System Agritech
Abbiamo implementato un sistema visivo unico bilanciato tra natura e tecnologia:
- **Typography**: `Montserrat` (Bold) per titoli e loghi, `Inter` per la massima leggibilità del corpo testo, e `JetBrains Mono` per dati tecnici, ID e coordinate.
- **Texture**: Un filtro SVG Noise applicato globalmente per simulare la carta.
```css
.noise-bg::before {
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200'...");
  opacity: 0.03;
  pointer-events: none;
}
```

### Mobile First
Tutta la navigazione è pensata per l'uso in campo:
- **Responsive Drawer**: I menu di gestione sono "Bottom Sheets" su mobile.
- **Touch Targets**: Bottoni minimi di 48px per facilitare l'uso con guanti o mani sporche.

## 🚀 5. Guida Rapida (Getting Started)

### Requisiti
- Node.js 18+
- Un progetto Supabase attivo

### Installazione
```bash
# Installa le dipendenze
npm install

# Avvia in locale
npm run dev
```

### Variabili d'Ambiente (.env)
Crea un file `.env` nella root con le seguenti chiavi:
```env
VITE_SUPABASE_URL=tua_url_supabase
VITE_SUPABASE_ANON_KEY=tua_chiave_anonima
```

---

### 2. Struttura del Vigneto
*   **Filari**: Ogni filare è un'unità logica.
    *   **Produttore/Venditore**: È ora possibile tracciare l'origine delle barbatelle (es. Montina, Pampanino, Gallo) direttamente sul filare.
    *   **Varietà Prevalente**: Tipicamente Vermentino per il vino, ma con supporto a diverse uve da tavola.
*   **Uve da Tavola**: Supporto a varietà specifiche:
    *   Moscato d'Amburgo, Vittoria, Italia, Cardinale, Moscato Bianco, Barbarossa, Globo, Crimson Seedless.
    *   Varietà numerate: **"5"** e **"8"** (identificate dai cartellini in campo).

## 🗄️ 6. Schema del Database

### Tabella: `filari`
| Campo | Tipo | Descrizione |
| :--- | :--- | :--- |
| `id` | int8 (PK) | Identificativo unico |
| `nome` | text | Nome del filare (es. "A", "Z") |
| `ordine` | int4 | Ordine di apparizione sulla mappa |
| `venditore` | text | Produttore/Vivaio di default per il filare |

### Tabella: `tipi_pianta`
| Campo | Tipo | Descrizione |
| :--- | :--- | :--- |
| `id` | int8 (PK) | Identificativo unico |
| `nome` | text | Varietà (es. "Nebbiolo") |
| `colore_hex` | text | Colore CSS per la mappa |

### Tabella: `piante`
| Campo | Tipo | Descrizione |
| :--- | :--- | :--- |
| `id` | text (PK) | Codice vite (es. "VIG-001") |
| `filare_id` | int8 (FK) | Riferimento a `filari.id` |
| `tipo_id` | int8 (FK) | Riferimento a `tipi_pianta.id` |
| `stato` | text | `attiva`, `morta`, `ripiantata` |
| `posizione_nel_filare` | int4 | Indice per calcolo automatico |
| `coord_x` / `coord_y` | int4 | Coordinate per posizionamento libero |
| `venditore` | text | Origine specifica (override se diversa dal filare) |

---

## 📶 7. Supporto Offline & PWA

L'app è configurata come **Progressive Web App (PWA)** per l'uso in campo:
- **Service Workers**: Gestiti tramite `vite-plugin-pwa` per il caching degli asset.
- **Persistence**: TanStack Query utilizza **IndexedDB** (`idb-keyval`) per persistere i dati della mappa sul dispositivo. Se la connessione cade, l'utente vede l'ultima versione caricata.
- **Robustezza**: Abbiamo implementato dei **React Error Boundaries** per gestire i fallimenti di rete senza crash dell'interfaccia.

---

## 🚢 8. Deployment

- **Frontend**: Il progetto è pronto per il deployment su **Vercel** o **Netlify** (basta collegare la repo).
- **Database**: Database PostgreSQL gestito su **Supabase**. Si raccomanda di attivare le policy RLS (Row Level Security) per limitare l'accesso in scrittura.

---
*Documentazione Progetto Vigna Fojachini - Aggiornata Maggio 2024*
