# GoaVibe 🌴

> **Sun-drenched, accessible travel companion and smart itinerary planner for North & South Goa.**  
> Features multi-generational schedules, real-time coastal weather, interactive beach maps, budget splitting, and server-side Gemini AI integrations with Google Maps Grounding & voice search.

---

## 🌟 Key Highlights

- **Multi-Generational Itineraries**: Hand-curated and AI-customized day schedules balancing vibrant student hangouts, water sports, and step-free, senior-friendly coastal retreats.
- **AI Itinerary Generator**: Powered by **Gemini 3.8 Flash** (`gemini-3.8-flash`), creating tailored schedules based on group type, region focus, pacing, and interests.
- **Google Maps Grounding**: Grounded place verification powered by **Gemini 3.5 Flash** with Google Maps tools (`tools: [{ googleMaps: {} }]`), fetching real-time access notes, operating hours, and crowd trends.
- **Voice Search & Speech-to-Text**: Search spots and beaches via spoken natural language, transcribed server-side using **Gemini 3.5 Transcribe** (`gemini-3.5-transcribe`).
- **Interactive Coastal Map**: Visual comparison of North Goa (cliffs, cafes, flea markets) and South Goa (tranquil lagoons, white sand, heritage quarters) with beach safety ratings.
- **Live 5-Day Coastal Weather**: Integrates real-time meteorological conditions (temperature, UV index, wind speed, precipitation) with beach safety alerts.
- **Budget Splitter & Financial Calculator**: Dynamic expense projection covering scooter rentals, AC taxis, beach shacks, and water sports, broken down per traveler.
- **Safety Directory & Tourist Helplines**: Drishti Marine lifeguard flags, 24/7 medical and emergency numbers, official taxi fare guidelines, and local rental regulations.
- **Dual Viewport Modes**: Responsive full-desktop split view alongside a simulated 390px mobile phone frame with Dynamic Island and pinned 64px thumb-friendly bottom navigation.

---

## 📸 Core Modules

### 1. Daily Itinerary & Activity Timeline
- Daily breakdowns covering Morning, Afternoon, Golden Hour, and Evening slots.
- Clear audience indicators (`Student Friendly` vs `Family & Elderly Friendly`).
- Step-free accessibility scores, wheelchair access indicators, and verified landmark directions.
- Item completion tracking, bookmarking, and instant location inspection on the map.

### 2. Smart AI Travel Planner Modal
- Customizable duration (1 to 7 days).
- Party profiling: **Family with Elders**, **College Friends & Students**, **Couples & Honeymooners**, or **Solo Backpackers**.
- Regional focus: North Goa, South Goa, or Coast-to-Coast mix.
- Pace selector: Relaxed & Susegad vs High Energy adventure.

### 3. Coastal Map & Beach Inspector
- Interactive beach pins for iconic coastal stretches: Palolem, Anjuna, Morjim, Colva, Vagator, and Fontainhas.
- Detailed beach profiles: crowd levels, swimming conditions, sunbed costs, shack counts, and lifeguard availability.

### 4. Coastal Weather & Advisory
- Real-time weather fetched for Goan coastal coordinates (`15.2993° N, 74.1240° E`).
- High-UV alerts, sea chop warnings, and ideal sunset windows.

### 5. Multi-Generational Budget Calculator
- Configurable group size, duration, and stay categories (Backpacker, Boutique Heritage, Luxury Coastal Resort).
- Transport breakdown: scooties (₹350/day) vs chauffeured AC cabs (₹2,500/day).
- Group cost splitting with student discount considerations.

### 6. Safety & Insider Directory
- Drishti Marine beach warning flags (Red, Yellow, Double Red).
- Direct call links for Goa Police (112), Women's Helpline (1091), Tourist Ambulance (108), and GMC Hospital.
- Rules of the road: commercial yellow number plate rental verification, GoaMiles taxi booths, and local etiquette.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Plus Jakarta Sans (Google Fonts)
- **Design Philosophy**: Sunkissed tropical palette (`#FFF9F2`, `#0F9D94`, `#FF8A3D`, `#243330`), tactile borders, 48px minimum touch targets, WCAG AAA contrast compliance.

### Backend & API
- **Server**: [Express](https://expressjs.com/) running via `tsx server.ts`
- **SDK**: `@google/genai` (Google Gen AI SDK v2.4+)
- **AI Models**:
  - `gemini-3.8-flash`: Structured JSON itinerary generation
  - `gemini-3.5-flash`: Location grounding with `googleMaps` tool
  - `gemini-3.5-transcribe`: Voice audio transcription from WebM base64

---

## 📁 Project Structure

```
├── .env.example                       # Template for environment variables
├── index.html                         # Entry HTML with meta tags & typography
├── metadata.json                      # Applet title, description & capabilities
├── package.json                       # Dependencies & build scripts
├── server.ts                          # Express server with Gemini AI endpoints
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite build configuration
└── src/
    ├── App.tsx                        # Master layout, navigation tabs & viewport switcher
    ├── main.tsx                       # React application bootstrap
    ├── index.css                      # Tailwind CSS v4 styling rules
    ├── types/
    │   └── travel.ts                  # Type definitions for schedules, beaches & filters
    ├── data/
    │   └── goaData.ts                 # Curated itinerary items, beach profiles & emergency directory
    ├── assets/
    │   └── images/                    # Local optimized photography (Palolem, Anjuna, Fontainhas, etc.)
    └── components/
        ├── AIPlannerModal.tsx         # Modal for generating custom Gemini itineraries
        ├── BudgetCalculator.tsx       # Interactive group budget and expense splitter
        ├── CoastalMap.tsx             # Interactive Goa coast map with beach cards
        ├── ItineraryCard.tsx          # Card with accessibility tags, cost & map pin
        ├── LocalGuide.tsx             # Lifeguard safety flags, emergency contacts & travel tips
        ├── MapsGroundingModal.tsx     # Grounded location inspector modal
        ├── RegionBadge.tsx            # Visual pill badge for North/South Goa
        ├── TactileButton.tsx          # Accessible, high-contrast tactile button component
        ├── TravelFiltersSheet.tsx     # Drawer for filtering by price, accessibility & audience
        ├── VoiceSearchModal.tsx       # Microphone recording & audio transcription modal
        └── WeatherForecastCallout.tsx # Live coastal weather forecast & beach advisories
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- (Optional) **Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/) for live AI features (fallbacks provided when unconfigured).

### Installation

1. **Clone or enter the project directory:**
   ```bash
   cd /path/to/goavibe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key in `.env`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The Vite frontend will start on port `3000` (`http://localhost:3000`).*

5. **Run the full-stack server with AI endpoints:**
   ```bash
   npm run build
   npm start
   ```
   *Express serves the compiled frontend and proxy routes (`/api/generate-itinerary`, `/api/maps-grounding`, `/api/transcribe-audio`).*

---

## 📡 API Endpoints (`server.ts`)

| Method | Endpoint | Description | Model / Tool |
|---|---|---|---|
| `POST` | `/api/generate-itinerary` | Generates a multi-day day schedule in structured JSON | `gemini-3.8-flash` |
| `POST` | `/api/maps-grounding` | Grounded location details, opening hours & accessibility | `gemini-3.5-flash` (`googleMaps` tool) |
| `POST` | `/api/transcribe-audio` | Transcribes audio query recorded from microphone | `gemini-3.5-transcribe` |

> *Note: All endpoints include reliable fallback mechanisms when `GEMINI_API_KEY` is not present, ensuring graceful offline operation and prototyping.*

---

## ♿ Accessibility & UX Standards

- **WCAG AAA Compliance**: High-contrast text colors (`#243330` on `#FFF9F2`, `#006761` for primary links) exceeding 7:1 contrast ratios.
- **Touch-Friendly Targets**: All clickable buttons, pills, and navigation tabs adhere to minimum 48px touch targets.
- **Screen Reader Support**: Semantic markup (`<header>`, `<nav>`, `<main>`, `<footer>`), `aria-label`, and `aria-current` attributes.
- **Physical Accessibility Insights**: Each itinerary spot details step-free access, wheelchair ramp status, and walking distances from parking.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
