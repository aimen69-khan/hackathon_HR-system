# HCM Lite — Full Stack

## IMPORTANT: Local development

Frontend MUST call the local backend, not Vercel.

File: `hcm-lite/.env`
```
VITE_API_URL=http://localhost:5000/api
```

If you see errors like `users.findOne() buffering timed out` or requests to
`hackathon-hr-system-kmdo.vercel.app`, your frontend is still pointed at Vercel.
Fix `.env`, restart `npm run dev`, and hard-refresh the browser.

## Run locally

### 1. Backend
```bash
cd backend
npm install
npm run seed
npm start
```
API: http://localhost:5000

### 2. Frontend (new terminal)
```bash
cd hcm-lite
npm install
npm run dev
```
App: http://localhost:5173

### Demo logins (password: password123)
- admin@hcm.test
- hr@hcm.test
- employee@hcm.test

## If MongoDB times out
1. Atlas → Network Access → Add IP → Allow Access from Anywhere (0.0.0.0/0)
2. Confirm `backend/.env` has the correct MONGODB_URI
3. Restart backend

## Vercel deploy (optional)
Set these env vars on Vercel:
- MONGODB_URI=mongodb+srv://...
- JWT_SECRET=...
- CLIENT_URL=https://your-frontend.vercel.app

And on the frontend Vercel project:
- VITE_API_URL=https://your-backend.vercel.app/api

Atlas Network Access must allow 0.0.0.0/0 for serverless.
