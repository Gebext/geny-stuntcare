# 🩺 GENY-StuntCare: AI-Driven Maternal & Child Health Intelligence

GENY-StuntCare is a comprehensive, AI-powered healthcare platform designed to monitor and improve maternal and child health, with a primary focus on preventing stunting through data-driven insights and AI diagnostics.

## 🌟 Key Features

-   **🤖 AI Medical Diagnosis:** Integrated with Gemini AI and Groq for pregnancy analysis and child health assessment.
-   **📈 Growth Tracking:** Accurate Z-score calculations for child height/weight using WHO standards.
-   **💉 Vaccination Monitoring:** Comprehensive tracking of child immunizations.
-   **🤰 Pregnancy Health:** Tools for mothers to monitor their pregnancy progress and receive AI-driven advice.
-   **👥 Role-Based Access:** Specialized interfaces for Healthcare Workers (Nakes), Community Volunteers (Kader), and Mothers.
-   **📊 Real-time Analytics:** Interactive charts for health trends using Recharts.

---

## 🛠 Tech Stack

### Frontend
-   **Framework:** Next.js 15 (App Router)
-   **Styling:** TailwindCSS + Framer Motion
-   **State Management:** Zustand
-   **Data Fetching:** TanStack Query (React Query)
-   **UI Components:** Radix UI + Lucide Icons

### Backend
-   **Framework:** NestJS
-   **Database:** PostgreSQL with Prisma ORM
-   **AI Integration:** Google Generative AI (Gemini) & Groq SDK
-   **Auth:** JWT with Passport.js
-   **Monitoring:** Prometheus & Grafana integrations

---

## 📂 Project Structure

```text
.
├── frontend/          # Next.js Application
├── backend/           # NestJS API Service
├── docs-site/         # Docusaurus Documentation (Port 3001)
├── docker-compose.yml # Container orchestration
└── ...
```

---

## 🚀 Quick Start

### Prerequisites
-   Docker and Docker Compose
-   Node.js (for local development)

### 1. Setup Environment
Create a `.env` file in the `backend/` directory:
```env
POSTGRES_HOST=db
POSTGRES_USER=transcendence
POSTGRES_PASSWORD=your_password
POSTGRES_DB=stuntcare
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

### 2. Run with Docker
```bash
docker-compose up --build
```

### 3. Local Development
If you prefer running without Docker:

**Terminal 1: Backend**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 3: Documentation**
```bash
cd docs-site
npm install
npm run start
```

---

## 📖 Documentation
Detailed technical documentation and user guides are available in the `docs-site` directory or can be accessed locally at `http://localhost:3001` when running the documentation service.

---

## 🧹 Cleanup
To stop and remove containers:
```bash
docker-compose down --rmi all
```
To deep clean Docker system:
```bash
./cleanup.sh
```

