# 🌾 KrishiAI — AI-Powered Wholesale Market Price Prediction & Farmer Assistant Platform
## Complete Frontend Generation Prompt

> Build a **complete, production-ready React.js frontend** for an AI-powered agricultural intelligence platform.
> The frontend connects to an existing **Flask backend at `http://127.0.0.1:5000`**.
> All API calls use the prefix: `http://127.0.0.1:5000/api`
> **Do not modify any API endpoints.**

---

## 🎨 COLOR PALETTE — STRICT

Use **ONLY** these 5 colors across every UI element. No blues, purples, or grays allowed.

| Role              | Color Name     | Hex       | Usage                                          |
| ----------------- | -------------- | --------- | ---------------------------------------------- |
| Accent / CTA      | Harvest Orange | `#F5A623` | Buttons, badges, chart lines, highlights       |
| Primary / Active  | Olive Gold     | `#C8B400` | Active nav, progress bars, secondary charts    |
| Background        | Cream Ivory    | `#FFF8D6` | Page backgrounds, card surfaces, input fields  |
| Sidebar / Deep    | Forest Olive   | `#4A5C1A` | Sidebar bg, headings, primary buttons, borders |
| Danger / Alert    | Rust Red       | `#C0390A` | Error states, alert badges, warnings           |

### Tailwind Custom Config (`tailwind.config.js`)
```js
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        harvest: "#F5A623",
        olive:   "#C8B400",
        cream:   "#FFF8D6",
        forest:  "#4A5C1A",
        rust:    "#C0390A",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body:    ["Nunito", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
```

---

## 🛠 TECHNOLOGY STACK

| Layer           | Technology                        |
| --------------- | --------------------------------- |
| Framework       | React.js (Vite)                   |
| Styling         | Tailwind CSS (extended palette)   |
| Routing         | React Router DOM v6               |
| HTTP Client     | Axios                             |
| Charts          | Chart.js + react-chartjs-2        |
| Icons           | Lucide React                      |
| State / Auth    | React Context API + React Hooks   |
| Fonts           | Google Fonts (see below)          |

### Google Fonts — Add to `index.html`
```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

### Font Usage Rules
- **`Playfair Display`** → All page titles, card headings, section headers
- **`Nunito`** → Body copy, labels, nav items, descriptions, form text
- **`JetBrains Mono`** → All price numbers, percentages, stats, predicted values

---

## 📁 FOLDER STRUCTURE

```
frontend/
├── public/
│   └── favicon.svg                  # Wheat/leaf icon in Harvest Orange
│
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx              # Forest olive collapsible sidebar
│   │   ├── Navbar.jsx               # Top bar with notifications + avatar
│   │   ├── PredictionCard.jsx       # Predicted price result display
│   │   ├── MarketChart.jsx          # Reusable Chart.js wrapper
│   │   ├── CropSuggestionCard.jsx   # Single crop card with score + market
│   │   ├── WeatherWidget.jsx        # Temperature, humidity, rainfall
│   │   └── Chatbot.jsx              # Floating bottom-right chat widget
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Prediction.jsx
│   │   ├── MarketAnalytics.jsx
│   │   ├── CropSuggestions.jsx
│   │   ├── Alerts.jsx
│   │   └── AdminPanel.jsx
│   │
│   ├── services/
│   │   ├── api.js                   # Axios instance + interceptors
│   │   ├── authService.js           # Login / register calls
│   │   ├── predictionService.js     # Price prediction calls
│   │   ├── marketService.js         # Market trends + recommendations
│   │   └── alertService.js          # Alert create + fetch
│   │
│   ├── context/
│   │   └── AuthContext.jsx          # Global auth state + ProtectedRoute
│   │
│   ├── App.jsx                      # Router setup + route definitions
│   └── main.jsx                     # Vite entry point
```

---

## ⚙️ API SERVICE LAYER

### `services/api.js` — Do NOT change the baseURL or endpoints
```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔗 API ENDPOINTS REFERENCE — DO NOT MODIFY

### Auth
| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | `/api/auth/register` | Register user   |
| POST   | `/api/auth/login`    | Login user      |

### Prediction
| Method | Endpoint              | Body                                        |
| ------ | --------------------- | ------------------------------------------- |
| POST   | `/api/predict-price`  | `{ crop, market, date }`                    |

### Markets
| Method | Endpoint                           | Description               |
| ------ | ---------------------------------- | ------------------------- |
| GET    | `/api/markets`                     | List all markets          |
| GET    | `/api/markets/recommend?crop=X`    | Recommended market        |

### Market Trends (Charts)
| Method | Endpoint                                       | Description     |
| ------ | ---------------------------------------------- | --------------- |
| GET    | `/api/market-trends?crop=X&market=Y`           | Trend data      |

### Crop Suggestions
| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | `/api/crop/suggestions`   | Get suggested crops    |

### Alerts
| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/api/alerts/create`  | Create a price alert |
| GET    | `/api/alerts/user`    | Get user's alerts    |

### Chatbot
| Method | Endpoint        | Body                  |
| ------ | --------------- | --------------------- |
| POST   | `/api/chatbot`  | `{ message: "..." }`  |

### Admin
| Method | Endpoint                    | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| POST   | `/api/admin/upload-dataset` | Upload CSV + retrain ML model      |

---

## 🔐 AUTHENTICATION SYSTEM

### `context/AuthContext.jsx`
- Provides `user`, `token`, `login()`, `logout()` globally
- On app load, read token from `localStorage` and decode user role
- Expose `isAdmin` boolean derived from `user.role === "admin"`

### `ProtectedRoute` Component
- Wraps all dashboard routes
- If no token in `localStorage` → redirect to `/login`
- If route is admin-only and user is not admin → redirect to `/dashboard`

### Token Storage
```javascript
// On login success:
localStorage.setItem("token", response.data.token);

// On logout:
localStorage.removeItem("token");
```

---

## 🖥 DESIGN SYSTEM RULES

### Cards
```
bg: white
border-radius: rounded-2xl
shadow: 0 4px 24px rgba(74, 92, 26, 0.12)   ← olive-tinted shadow
left accent border: 4px solid #F5A623         ← harvest orange
padding: p-6
```

### Primary Buttons
```
bg: #4A5C1A (Forest Olive)
text: #FFF8D6 (Cream Ivory)
hover: bg #F5A623 (Harvest Orange)
border-radius: rounded-xl
transition: 200ms ease
active: scale(0.97)
```

### Danger Buttons
```
bg: #C0390A (Rust Red)
text: white
hover: opacity 90%
```

### Input Fields
```
bg: #FFF8D6 (Cream Ivory)
border: 1.5px solid #C8B400 (Olive Gold)
focus-ring: #F5A623 (Harvest Orange)
border-radius: rounded-xl
font: Nunito
```

### Badges / Pills
```
Active / Success:  bg #F5A623  text white   (Harvest Orange)
Warning:           bg #C8B400  text white   (Olive Gold)
Alert / Error:     bg #C0390A  text white   (Rust Red)
border-radius: rounded-full
padding: px-3 py-1
font: Nunito 600
```

---

## 🧭 SIDEBAR (`Sidebar.jsx`)

### Visual Spec
- Background: `#4A5C1A` Forest Olive
- Width: `w-64` (desktop) → `w-16` icon-only (tablet) → hidden (mobile, bottom nav replaces)
- Logo: wheat SVG icon + **"KrishiAI"** in Playfair Display, Cream Ivory color
- Bottom: user avatar chip + name + logout button

### Navigation Items (with Lucide icons)
| Icon          | Label             | Route             | Visibility  |
| ------------- | ----------------- | ----------------- | ----------- |
| `LayoutDashboard` | Dashboard     | `/dashboard`      | All users   |
| `TrendingUp`  | Price Prediction  | `/prediction`     | All users   |
| `BarChart2`   | Market Analytics  | `/analytics`      | All users   |
| `Leaf`        | Crop Suggestions  | `/crops`          | All users   |
| `Bell`        | Alerts            | `/alerts`         | All users   |
| `Shield`      | Admin Panel       | `/admin`          | Admin only  |

### Active Item Style
```
left border: 4px solid #F5A623
background: rgba(255, 248, 214, 0.1)
text: #F5A623
```

### Hover Style
```
background: rgba(255, 255, 255, 0.08)
text: #FFF8D6
```

---

## 🔝 NAVBAR (`Navbar.jsx`)

- Background: `#FFF8D6` Cream Ivory
- Left: hamburger toggle (mobile/tablet) + current page title in Playfair Display, Forest Olive
- Right:
  - Mini weather pill (temperature + icon) in Olive Gold
  - Notification bell with Rust Red badge (count from `/api/alerts/user`)
  - User avatar dropdown → Profile / Logout

---

## 🏠 DASHBOARD PAGE (`/dashboard`)

### Layout — 12-column CSS Grid

#### Row 1 — Stats Cards (4 columns)
Each card: white, `rounded-2xl`, harvest orange left border, olive shadow

| Card Title             | Data Source                  | Icon         | Value Color     |
| ---------------------- | ---------------------------- | ------------ | --------------- |
| Today's Best Price     | `/api/predict-price`         | `IndianRupee`| Harvest Orange  |
| Recommended Crop       | `/api/crop/suggestions`      | `Leaf`       | Forest Olive    |
| Active Alerts          | `/api/alerts/user`           | `Bell`       | Rust Red        |
| Available Markets      | `/api/markets`               | `Store`      | Olive Gold      |

#### Row 2 — Main Content
- **Left (col-span-8):** Line chart (7-day price trend) from `/api/market-trends`
  - Line color: `#F5A623`
  - Gradient fill: olive gold fading to transparent
  - Grid lines: `#FFF8D6`
- **Right (col-span-4):** `WeatherWidget` — temperature large number, humidity arc, rainfall bar

#### Row 3 — Bottom Content
- **Left (col-span-6):** Top 3 `CropSuggestionCard` mini-cards
- **Right (col-span-6):** Recent alerts list with Rust Red severity badges

---

## 📈 PRICE PREDICTION PAGE (`/prediction`)

### Left Panel — Input Form
- **Crop** dropdown (populated from `/api/crop/suggestions`)
- **Market** dropdown (populated from `/api/markets`)
- **Date** date picker (harvest orange calendar icon)
- **"Predict Price"** button: Forest Olive, full-width, animated spinner on loading

All inputs: Cream Ivory background, Olive Gold border, Forest Olive labels, `rounded-xl`

### Right Panel — Result
- **Empty state:** SVG wheat field illustration (cream + olive colors), prompt text
- **On result:** `PredictionCard` slides up with fade animation:
  - Predicted price: large JetBrains Mono, Harvest Orange
  - Trend arrow `↑` / `↓`: Rust Red (down) / Olive Gold (up)
  - Confidence bar: Olive Gold fill on Cream Ivory track
  - Market recommendation text: Forest Olive, Nunito

**API:** `POST /api/predict-price` → `{ crop, market, date }`

---

## 📊 MARKET ANALYTICS PAGE (`/analytics`)

### Filter Bar
- Crop selector + Market selector + Date range picker (start / end dates)
- All styled in harvest/olive palette, `rounded-xl`
- "Apply Filters" button: Forest Olive

### Charts — All from `GET /api/market-trends?crop=X&market=Y`

#### Chart 1 — Price Trend Line Chart (full width)
```
Type: Line
Dataset color: #F5A623
Fill gradient: #C8B400 → transparent
Grid: #FFF8D6
Axis labels: #4A5C1A
```

#### Chart 2 — Market Comparison Bar Chart (left half)
```
Type: Bar
Bar colors: alternating #F5A623 and #4A5C1A
Hover tooltip: cream bg, forest olive text, rust red border
```

#### Chart 3 — Crop Profitability Radar Chart (right half)
```
Type: Radar
Fill: #C8B400 at 40% opacity
Border: #4A5C1A
Point color: #F5A623
```

---

## 🌱 CROP SUGGESTIONS PAGE (`/crops`)

**API:** `GET /api/crop/suggestions`

**Layout:** Responsive grid — 3 cols desktop / 2 cols tablet / 1 col mobile

### `CropSuggestionCard.jsx` Spec
```
Card:
  bg: white
  border-radius: rounded-2xl
  top border: 4px solid #F5A623
  hover: translateY(-4px) + deeper shadow

Contents:
  - Crop name: Playfair Display, Forest Olive
  - Profitability score bar: Olive Gold fill, Cream Ivory track
  - Best market badge: Harvest Orange pill, Nunito 600
  - Expected price range: JetBrains Mono
    - Rising: Olive Gold
    - Falling: Rust Red
  - "View Details" button: Forest Olive outline → fill on hover
```

**Loading state:** Skeleton cards with Cream/Olive CSS pulse animation

---

## 🌤 WEATHER WIDGET (`WeatherWidget.jsx`)

**API:** `GET /api/weather`

**Displayed data:**
- Temperature: large JetBrains Mono, Harvest Orange
- Weather condition icon: SVG (sun/cloud/rain) in Olive Gold
- Humidity: arc gauge, Forest Olive fill
- Rainfall: vertical bar, Harvest Orange fill
- Wind speed: horizontal bar, Olive Gold fill
- Advisory badge: "Good for farming" (Olive Gold) / "Delay sowing" (Rust Red)

---

## 💬 CHATBOT (`Chatbot.jsx`)

**API:** `POST /api/chatbot` → `{ message: "..." }`

### Floating Trigger Button
```
Position: fixed bottom-6 right-6
Shape: circle w-14 h-14
bg: #4A5C1A
Icon: MessageCircle (Lucide), Harvest Orange
Notification dot: Rust Red pulse ring when idle
```

### Chat Window (expanded)
```
Width: w-80
Height: h-96
Border-radius: rounded-2xl
Shadow: large olive shadow

Header:
  bg: #4A5C1A
  Title: "KrishiAI Assistant" — Playfair Display, Cream Ivory
  Close button: X icon, Cream Ivory

Messages area:
  bg: #FFF8D6

User messages:
  bg: #F5A623
  text: white
  align: right
  border-radius: rounded-2xl rounded-br-sm

Bot messages:
  bg: white
  text: #4A5C1A
  align: left
  border-radius: rounded-2xl rounded-bl-sm
  Left avatar: small wheat icon

Input bar:
  bg: white
  border: Olive Gold, focus → Harvest Orange ring
  Send button: Harvest Orange

Typing indicator:
  3 dots, Olive Gold, animated bounce
```

---

## 🔔 ALERTS PAGE (`/alerts`)

### Create Alert Form
- Crop selector (from `/api/crop/suggestions`)
- Condition selector: "Price above" (Rust Red indicator) / "Price below" (Olive Gold indicator)
- Target price input: JetBrains Mono font, Harvest Orange value color
- Submit button: "Set Alert" — Forest Olive

**API:** `POST /api/alerts/create` → `{ crop, condition, targetPrice }`

### Active Alerts List

**API:** `GET /api/alerts/user`

Each alert card:
```
Left border:
  Rust Red → "above" threshold alert
  Olive Gold → "below" threshold alert

Status badge:
  "Active"    → Harvest Orange
  "Triggered" → Rust Red pulse

Delete button: Rust Red trash icon
```

---

## 🛡 ADMIN PANEL (`/admin`)

**Visibility:** Only render if `user.role === "admin"`

### Stats Row — 3 Cards
| Metric             | Icon           | Color         |
| ------------------ | -------------- | ------------- |
| Total Users        | `Users`        | Forest Olive  |
| Total Crops        | `Leaf`         | Olive Gold    |
| Datasets Uploaded  | `Database`     | Harvest Orange|

### Dataset Upload Section
```
Upload zone:
  bg: Cream Ivory
  border: 2px dashed #4A5C1A
  icon: Upload (Lucide), Harvest Orange
  text: "Drag & drop CSV file or click to browse"

Accepted: .csv only

Upload progress bar: Harvest Orange fill on Cream track

Success state:
  Check icon: Olive Gold
  Animation: scale bounce
  Message: "Dataset uploaded and model retraining started"
```

**API:** `POST /api/admin/upload-dataset` (multipart/form-data)

### Analytics Summary Table
- Cream Ivory striped rows
- Forest Olive header row
- Harvest Orange hover row highlight
- Columns: filename, uploaded date, rows count, status

---

## 📱 RESPONSIVE DESIGN

| Breakpoint        | Behavior                                                      |
| ----------------- | ------------------------------------------------------------- |
| Mobile `< 640px`  | Sidebar hidden → Bottom navigation bar (5 icons, Forest Olive bg) |
| Tablet `640–1024px` | Sidebar collapses to icon-only `w-16`                       |
| Desktop `> 1024px` | Full sidebar `w-64` + multi-column grid layouts              |

---

## ✨ ANIMATIONS & MICRO-INTERACTIONS

| Element                 | Animation                                          |
| ----------------------- | -------------------------------------------------- |
| Page transition         | Fade + slide-up, 100ms stagger per element         |
| Card hover              | `translateY(-4px)` + deeper olive shadow           |
| Button press            | `scale(0.97)` spring                               |
| Chart load              | Animated draw-in via Chart.js `animation` config   |
| Prediction result       | Slide-up reveal + number count-up animation        |
| Chatbot open            | Scale + fade from bottom-right origin              |
| Alert triggered badge   | Rust Red pulse ring                                |
| Sidebar active bar      | Sliding Harvest Orange left border                 |
| Skeleton loaders        | Cream/Olive gradient shimmer                       |

---

## 🚀 INSTALLATION & SETUP

```bash
# 1. Create Vite project
npm create vite@latest frontend -- --template react
cd frontend

# 2. Install all dependencies
npm install react-router-dom axios react-chartjs-2 chart.js lucide-react

# 3. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Start development server
npm run dev
```

> **Backend must be running at `http://127.0.0.1:5000` before starting the frontend.**

---

## ✅ FINAL CHECKLIST

The generated frontend must include:

- [ ] All 8 pages fully built and routed
- [ ] All 7 components implemented
- [ ] Complete API integration via Axios (no dummy/mock data)
- [ ] JWT authentication with `ProtectedRoute`
- [ ] Admin-only route guard
- [ ] 3 Chart types (Line, Bar, Radar) using react-chartjs-2
- [ ] Floating chatbot with conversation bubbles
- [ ] Responsive layout for mobile / tablet / desktop
- [ ] All 5 palette colors used consistently — no other colors
- [ ] Playfair Display / Nunito / JetBrains Mono fonts applied correctly
- [ ] Smooth animations on all key interactions
- [ ] Tailwind config extended with custom palette
- [ ] `services/api.js` with interceptors (token attach + 401 logout)
- [ ] No hardcoded API endpoints — all calls go through `services/api.js`

---

*This platform should feel like a premium agricultural intelligence dashboard — warm, trustworthy, and easy to use for farmers across India.*