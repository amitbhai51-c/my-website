# FixLocal - Local Civic Problem Reporting Platform

A web platform that empowers citizens and students to report local civic issues (potholes, broken streetlights, water leakage, garbage accumulation, public hazards) and enables municipal authorities to track, prioritize, and resolve them with real-time analytics.

---

## 🌟 Key Features

### 1. Issue Reporting with Evidence & Geolocation
- **Photo Evidence**: Upload images from device, capture on mobile camera, or pick from pre-verified civic hazard presets.
- **Interactive Map Location Pinning**: Click or drag a pin on a Leaflet map or use browser GPS Geolocation to log exact latitude & longitude coordinates.
- **Multi-Category Classification**: Roads & Infrastructure, Water Supply & Drainage, Streetlights & Electricity, Garbage & Sanitation, Public Safety, Parks & Public Infrastructure.

### 2. Interactive Locality Map
- OpenStreetMap / Leaflet map rendering colored custom pins for all active reports.
- **Pulsing Radar Rings** for high-risk critical pending emergencies.
- Interactive popups with photos, upvote counters, and direct links to full timeline audit logs.
- Category filters, status filters, and "Fit to View" map controls.

### 3. Community Upvoting & Priority Endorsements
- "Affects Me Too / Upvote" system allowing citizens to boost collective visibility.
- Prevents double voting per session via local storage.
- Real-time priority sorting: **Most Upvoted**, **Newest**, and **High Severity**.

### 4. Issue Status Lifecycle & Audit Timeline
- Complete lifecycle tracking: `Reported` ➔ `In Progress` ➔ `Resolved`.
- Visual step progression and chronological audit trail logging officer notes, dispatch updates, and completion signoffs.

### 5. Authority Management & Municipal Analytics Dashboard
- **Role Switcher**: Toggle between Citizen Mode and Municipal Authority Officer Mode.
- **Authority Console**: Update issue status, assign responsible department, and log official inspection notes.
- **Executive KPIs**: Total Reports, Resolution Rate %, Average Turnaround Time (hours), and Critical Alerts.
- **Visual Analytics**:
  - Issues by Category breakdown with progress percentages.
  - Resolution Pipeline Funnel (`Reported` vs `In Progress` vs `Resolved`).
  - Severity Tier breakdown (`Critical`, `High`, `Medium`, `Low`).
  - Locality & Ward Hotspot Leaderboard ranking zones with pending tickets.
- **Export Tools**: One-click downloadable CSV reports and print-ready city council reports.

### 6. Bonus Features
- 🧠 **Civic-AI Severity Prediction**: Real-time evaluation of hazard severity (`Critical`, `High`, `Medium`, `Low`), risk score (0-100), and turnaround SLA target (6h, 24h, 72h, 120h).
- 📝 **AI-Generated Municipal Dispatch Summaries**: Extracts risk keywords (e.g. `sparking`, `deep pothole`, `sinkhole`) and generates a concise work-order dispatch alert.
- 🛡️ **Anonymous Reporting**: Citizens can toggle anonymous reporting to protect personal privacy while keeping geolocation authentic.
- 📱 **QR Code Quick Reporting**: Dynamic QR code generator for sharing tickets or generating printable Locality Kiosk Posters.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
https://github.com/amitbhai51-c/my-website.git
cd /home/user/folder-name
npm init -y
npm install
```
### Check what packges to install from npm
```bash
npx npm-detective .
```
### Install npm packges
```bash
npm install (packges name)
```
### Running the Application

#### Option A: Unified Fullstack Server (Frontend + Backend on Port 3001)
```bash
npm run build
npm start
```
Open **`http://localhost:3001`** in your browser.

#### Option B: Development Mode with Hot Reloading
```bash
npm run dev
```
Runs Express API on `http://localhost:3001` and Vite dev server on `http://localhost:5173`.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/issues` | List issues with query filters (`category`, `status`, `severity`, `search`, `sort`) |
| `GET` | `/api/issues/:id` | Get single issue details & complete timeline audit log |
| `POST` | `/api/issues` | Report a new civic issue |
| `POST` | `/api/issues/:id/upvote` | Toggle citizen upvote / endorsement |
| `PATCH` | `/api/issues/:id/status` | Update status (`Reported` / `In Progress` / `Resolved`) with authority notes |
| `POST` | `/api/issues/reset` | Reset demo data to default seeded state |
| `GET` | `/api/analytics` | Get aggregated municipal KPIs, category distribution & ward hotspots |
| `POST` | `/api/ai/analyze` | Run real-time AI severity scoring, SLA calculation & dispatch summary |

---

## 📁 Project Structure
```
community-connect/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
├── server/
│   ├── server.js               # Express server & unified app hosting
│   ├── data/
│   │   ├── defaultData.js      # Seed civic dataset
│   │   └── store.js            # In-memory data store with live state
│   ├── controllers/
│   │   ├── issuesController.js # CRUD, upvoting & status workflow
│   │   ├── analyticsController.js # Aggregated metrics & hotspot rankings
│   │   └── aiController.js     # Civic-AI engine for severity & summaries
│   └── routes/
│       └── api.js              # Express API router
└── src/
    ├── main.jsx                # React entry
    ├── App.jsx                 # App shell, tab router, modals & state
    ├── index.css               # Tailwind & Leaflet customizations
    ├── components/
    │   ├── Navbar.jsx          # Top navigation & authority toggle
    │   ├── HeroBanner.jsx      # Hero stats, search & filter controls
    │   ├── IssueCard.jsx       # Card displaying status, photo, upvotes
    │   ├── IssueMap.jsx        # Interactive Leaflet map with custom pins
    │   ├── IssueDetailModal.jsx# Full timeline audit trail & authority console
    │   ├── ReportModal.jsx     # Report form with GPS map picker & AI assistant
    │   ├── AnalyticsDashboard.jsx # Municipal KPI charts & CSV export
    │   └── QRCodeModal.jsx     # QR code generator for tickets & kiosk posters
    ├── services/
    │   └── api.js              # Frontend API client
    └── utils/
        ├── constants.js        # Categories, statuses, severities & wards
        └── samplePhotos.js     # Civic evidence photo presets
```
# Our Website URL: https://fixlocal.zendevelopment.in/
**Admin :-
Email: admin@fixlocal.gov 
Pass: admin123 
(Municipal Officer)**
