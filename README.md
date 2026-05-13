<div align="center">
  <img src="assets/app.png" alt="AlitapWatt" width="120" height="120" />

  # ⚡ AlitapWatt

  **A small light for your home's energy.**  
  *AI-powered energy assistant helping Filipino households see, understand, and reduce electricity use.*

  <p align="center">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TanStack_Start-FF4154?logo=react-router&logoColor=white" alt="TanStack Start" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Cloudflare-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare" />
  </p>

  <br />
</div>

---

## ✨ Features

### 🏠 Smart Home Dashboard
- Real-time energy consumption monitoring
- Smart Energy Score with circular progress visualization
- Daily, weekly, and peak hour usage charts
- Live alert banners and budget tracking
- AI-generated insights with personalized recommendations

### 📄 AI Bill Scanner
- Upload or snap a photo of your Meralco bill
- OCR-powered text detection and charge extraction
- AI-generated bill explanations in plain language
- Bill breakdown cards with Taglish translations
- Sample bills for demonstration

### 🧠 AI Energy Hub
- Central command center for all AI features
- Floating AI chatbot assistant with suggested prompts
- Smart appliance intelligence with efficiency ratings
- AI savings recommendation engine
- Energy saver gamification with XP and badges
- Community impact tracking

### 🔌 Smart Home Control
- Connected device monitoring with real-time wattage
- Live energy cost tracker (₱/hour)
- Automation rules (schedules, alerts, notifications)
- Voice AI control simulation
- Device health overview

### 📊 Appliance Tracker
- Energy calculator with 24 appliance presets
- Track estimated monthly costs per appliance
- Consumption breakdown with color-coded charts
- Scenario simulation tool — see savings from changes
- AI analysis per appliance

### 📈 Energy History
- Monthly bill timeline with AI insights
- Yearly trends and seasonal patterns
- Savings achievements and milestones
- Vertical energy journey timeline
- Exportable PDF reports

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19 + SSR) |
| **Routing** | [TanStack Router](https://tanstack.com/router) |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + `tw-animate-css` |
| **Animations** | CSS animations, Tailwind `animate-*` utilities |
| **Icons** | [Lucide React](https://lucide.dev) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com) + shadcn/ui patterns |
| **Charts** | [Recharts](https://recharts.org) |
| **Forms** | React Hook Form + Zod |
| **Build** | [Vite 7](https://vitejs.dev) + Cloudflare adapter |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── AppShell.tsx      # Main app shell with bottom nav
│   ├── BottomNav.tsx     # Tab navigation (Home, Scan, AI Hub, History, Profile)
│   ├── Logo.tsx          # AlitapWatt logo component
│   └── MobileFrame.tsx   # Mobile-frame wrapper
├── routes/
│   ├── __root.tsx        # Root layout (head, shell, error/not-found)
│   ├── index.tsx         # Splash / landing screen
│   ├── login.tsx         # Email/phone login
│   ├── onboarding.tsx    # Onboarding carousel
│   ├── home.tsx          # Main dashboard
│   ├── scan.tsx          # Bill scanner with camera & gallery
│   ├── insights.tsx      # AI Energy Hub
│   ├── forecast.tsx      # Energy History & Forecasting
│   ├── appliances.tsx    # Appliance Tracker & Calculator
│   ├── smart-home.tsx    # Smart Home Control Center
│   ├── profile.tsx       # User profile & settings
│   └── admin.tsx         # Admin analytics dashboard
├── styles.css            # Global styles + Tailwind theme tokens
└── lib/
    └── utils.ts          # cn() utility (clsx + tailwind-merge)

assets/                   # Static assets (images, mascots, sample bills)
├── app.png               # App icon
├── happy.png             # Mascot — happy/success
├── idea.png              # Mascot — idea/tip
├── sad.png               # Mascot — sad/alert
├── teach.png             # Mascot — teach/guide
├── thinking.png          # Mascot — thinking/loading
└── bills/                # Sample bill images for scanner demo
    ├── 1.png
    ├── 2.png
    └── 3.png
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `oklch(0.705 0.19 45)` — `#F97316` | Brand orange, buttons, accents |
| `--primary-dark` | `oklch(0.62 0.2 38)` — `#EA580C` | Hover states, gradients |
| `--primary-soft` | `oklch(0.82 0.13 60)` — `#FDBA74` | Soft backgrounds, glow effects |
| `--background` | `oklch(0.985 0.025 75)` | Page background |
| `--card` | `oklch(1 0 0)` | Card surfaces |
| `--foreground` | `oklch(0.28 0.05 40)` | Primary text |
| `--success` | `oklch(0.7 0.16 150)` | Positive states |
| `--warning` | `oklch(0.78 0.17 75)` | Warning states |
| `--destructive` | `oklch(0.62 0.22 27)` | Error/danger |

### Typography
- **Font**: System UI stack (`ui-sans-serif, system-ui, -apple-system, ...`)
- **Scale**: `text-xs` through `text-4xl` with `font-medium`, `font-semibold`, `font-bold`

### Shadows
- `shadow-glow` — Primary-colored glow for hero cards
- `shadow-button` — Figma-designed button shadow (drop + inner + stroke)
- `shadow-card` — Subtle card elevation
- `shadow-soft` — Soft ambient shadow

---

## 🚦 Getting Started

### Prerequisites
- [Bun](https://bun.sh) or Node.js 18+
- A [Cloudflare](https://cloudflare.com) account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/alitapwatt.git
cd alitapwatt

# Install dependencies
bun install
# or
npm install

# Start the development server
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
bun run build
# or
npm run build
```

### Preview Production Build

```bash
bun run preview
# or
npm run preview
```

---

## ☁️ Deployment

AlitapWatt is built for [Cloudflare Pages](https://pages.cloudflare.com).

```bash
# Deploy to Cloudflare
npx wrangler pages deploy dist/client
```

Make sure to configure your `wrangler.jsonc` with the appropriate Cloudflare account details.

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

<div align="center">
  <sub>Built with ❤️ for every Filipino household</sub>
  <br />
  <sub>🇵🇭 AlitapWatt — *A small light for your home's energy*</sub>
</div>
