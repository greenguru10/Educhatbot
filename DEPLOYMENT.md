# 🚀 Production Deployment Guide: Render & Vercel

This guide provides step-by-step instructions to deploy **LearnWise**:
- **Backend (FastAPI)** on **[Render](https://render.com)**
- **Frontend (React 19 + Vite)** on **[Vercel](https://vercel.com)**

---

## 🛠️ Step 1: Deploy Backend on Render

### Option A: Blueprints (Automated via `render.yaml`)
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** &rarr; **Blueprint**.
3. Connect your GitHub repository: `https://github.com/greenguru10/Educhatbot`.
4. Render will automatically detect `render.yaml`.
5. Enter your environment variable values when prompted:
   - `DATABASE_URL`: `postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require`
   - `LLM_API_KEY`: Your primary API key
   - `LLM_FALLBACK_API_KEYS`: `fallback_key_1,fallback_key_2`
6. Click **Apply**.

---

### Option B: Manual Web Service Setup
1. On Render Dashboard, click **New +** &rarr; **Web Service**.
2. Connect repository **`greenguru10/Educhatbot`**.
3. Configure the following fields:
   - **Name**: `learnwise-backend`
   - **Region**: Any (e.g. `Oregon (US West)` or `Ohio (US East)`)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Advanced &rarr; Environment Variables**, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.11.9` | Python runtime version |
| `APP_ENV` | `production` | Production environment flag |
| `API_PREFIX` | `/api/v1` | API base prefix |
| `DATABASE_URL` | `postgresql://neondb_owner:password@ep-sample-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require` | NeonDB connection string |
| `LLM_PROVIDER` | `openai_compatible` | Inference provider mode |
| `LLM_API_KEY` | `your_primary_api_key_here` | Primary inference key |
| `LLM_FALLBACK_API_KEYS` | `your_fallback_key_1,your_fallback_key_2` | Automatic fallback keys |
| `LLM_BASE_URL` | `https://api.groq.com/openai/v1` | API base URL |
| `LLM_MODEL` | `openai/gpt-oss-120b` | High-speed 120B model |
| `JWT_SECRET` | `learnwise-secret-jwt-key-2026` | Random secure secret |
| `ADMIN_API_KEY` | `learnwise-admin-key-2026` | Admin API key |

5. Click **Create Web Service**.
6. Once deployed, copy your Render service URL (e.g. `https://learnwise-backend.onrender.com`).
7. Test the health endpoint: `https://learnwise-backend.onrender.com/api/v1/health`.

---

## 🌐 Step 2: Deploy Frontend on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Import your GitHub repository: **`greenguru10/Educhatbot`**.
4. In the Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Click Edit and select the `frontend` folder)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend-name.onrender.com/api/v1` |

*(Replace `https://your-backend-name.onrender.com` with your actual Render URL from Step 1).*

6. Click **Deploy**.
7. Vercel will build and assign a production URL (e.g. `https://educhatbot.vercel.app`).

---

## 🔄 Step 3: Configure CORS (Backend)

By default, the backend allows requests from `*` and `https://*.vercel.app`. If you have a custom domain on Vercel:
1. Go to your Render Backend Service &rarr; **Environment**.
2. Update or add `ALLOWED_ORIGINS` if necessary (e.g. `https://your-custom-domain.com,https://educhatbot.vercel.app`).

---

## ⏱️ Step 5: Keep Render Backend Alive 24/7 (UptimeRobot)

Render's free tier spins down web services after 15 minutes of inactivity, causing cold-start delays. Set up UptimeRobot to ping the backend every 5 minutes:

### Setting Up UptimeRobot (Free)
1. Create a free account at **[uptimerobot.com](https://uptimerobot.com)**.
2. Click **Add New Monitor**.
3. Configure the monitor:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `LearnWise Backend`
   - **URL (or IP)**: `https://your-backend-name.onrender.com/ping` (or `/healthz`)
   - **Monitoring Interval**: `5 minutes`
4. Click **Create Monitor**.
5. UptimeRobot will now ping your Render backend every 5 minutes, keeping it **warm and instant 24/7 with zero cold starts**.

---

## ✅ Step 6: Verification Checklist

- [ ] Visit `https://your-backend-url.onrender.com/api/v1/health` &rarr; `{"status":"ok", "database":"ready"}`
- [ ] Visit `https://your-frontend-url.vercel.app` &rarr; Landing Page loads cleanly.
- [ ] Click **"Start Learning Now"** or ask a query in the Chat Workspace &rarr; Grounded answer with `[S1]` citations appears.
- [ ] Test **Light / Dark Mode Toggle** in navbar.
- [ ] Test **User Profile Switcher** & verify isolated chat histories.
- [ ] UptimeRobot monitor shows **Status: UP (100%)**.
