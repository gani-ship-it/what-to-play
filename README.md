<div align="center">

# 🎮 WHAT · TO · PLAY

### *Next-Gen PC Game Discovery & Real-Time Deal Tracking Platform*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Async-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

---

</div>

## 📌 Overview

**WHAT · TO · PLAY** (WTP) is a modern, high-performance web platform built for PC gamers. It empowers users to explore trending games, inspect PC hardware requirements, track real-time price discounts across authorized digital stores (Steam, Epic Games, GOG, Fanatical), and view authentic gamer sentiment ratings.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and **FastAPI**, WTP combines glassmorphism aesthetic, ultra-fast responses, and seamless data architecture.

---

## ✨ Key Features

- **🌟 Hero Spotlight Carousel**: Interactive full-bleed game wallpapers, motion animations, real-time discount tags, and direct detail inspection.
- **🌟 Gamer Rating & Sentiment Badges**: Real gamer star ratings (`★ 4.9 / 5`), Metacritic scores, and sentiment tags (`Overwhelmingly Positive`, `98% Positive`).
- **🏷️ Real-Time Authorized PC Deals**: Track legitimate key price drops across Steam, Epic Games, GOG, and Fanatical (zero grey-market keys).
- **💻 PC System Requirements Inspector**: Interactive hardware breakdown for Minimum & Recommended PC specifications.
- **📊 Price History & All-Time Low (ATL) Graph**: Detailed store comparison tables and historical price analytics.
- **👥 Steam Live Active Player Counter**: Concurrent live player counts and peak activity statistics.
- **🔍 Instant Game Discovery**: Multi-filter catalog search (by genre, popularity, release date, and keywords).
- **🌐 Dual Currency Engine**: Seamless real-time currency conversion between INR (`₹`) and USD (`$`).
- **📱 Ultra-Responsive Glassmorphic UI**: Vertical 3:4 box art capsules, dark mode aesthetics, and micro-interactions.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + TypeScript (Strict Mode)
- **Build Tool**: Vite 6
- **Styling**: Vanilla CSS + Tailwind CSS (Custom Dark Theme & Glassmorphism)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### **Backend**
- **Framework**: FastAPI (Async Native)
- **ORM**: SQLAlchemy 2.0 (Async Engine)
- **Database**: AsyncSQLite / SQLite
- **Validation**: Pydantic v2
- **Server**: Uvicorn

---

## 📁 Repository Structure

```
what-to-play/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/        # API route handlers (games, deals, health)
│   │   │       └── router.py         # Main API router registry
│   │   ├── core/                     # Configs & database setup
│   │   ├── models/                   # SQLAlchemy ORM schemas
│   │   └── schemas/                  # Pydantic data schemas
│   ├── main.py                       # FastAPI application entrypoint
│   └── run.py                        # Server runner script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── deals/                # Deal cards, price charts, store comparisons
│   │   │   ├── games/                # Game grids, catalog cards, detail page views
│   │   │   ├── home/                 # Hero spotlight carousel
│   │   │   ├── layout/               # Blended navbar & footer
│   │   │   └── players/              # Steam live player statistics widget
│   │   ├── services/                 # API service layer
│   │   ├── types/                    # TypeScript interfaces & definitions
│   │   └── App.tsx                   # Main React App router & state container
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have installed:
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **npm** or **yarn**

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   # Or install core packages:
   pip install fastapi uvicorn sqlalchemy aiosqlite pydantic pydantic-settings
   ```

4. Start the FastAPI backend server:
   ```bash
   python run.py
   ```
   The backend server will run live on `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/api/v1/docs`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Backend service health check |
| `GET` | `/api/v1/games/` | Get paginated games catalog with filters (`search`, `genre`, `ordering`) |
| `GET` | `/api/v1/games/{slug}` | Get complete details for a specific game |
| `GET` | `/api/v1/games/{slug}/players` | Get live concurrent Steam player counts |
| `GET` | `/api/v1/deals/` | Get live store deals & discounts |
| `GET` | `/api/v1/deals/{slug}/prices` | Get authorized store price comparisons for a title |
| `GET` | `/api/v1/deals/{slug}/history` | Get historical low & price history points |
| `GET` | `/api/v1/stores` | List all authorized digital stores |

---

## 🎨 Design Philosophy & Principles

- **Zero Placeholders**: Every game entry features authentic box art, screenshots, hardware requirements, and store links.
- **Cinematic Dark Aesthetics**: Tailored dark palette (`#0a0a0d`), glowing crimson accents (`#E50914`), and subtle glassmorphic blurs.
- **Authentic Aspect Ratios**: Vertical **3:4 box art poster cards** for an authentic Steam/Epic Games storefront feel.
- **Seamless Ergonomics**: Clean header blending, instant search input, and fluid carousel transitions.

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome!
1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Crafted with ❤️ for the PC Gaming Community.

</div>
