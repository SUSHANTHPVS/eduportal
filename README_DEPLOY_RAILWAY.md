Railway Deployment Guide — EduPortal

Overview

This repo contains a React + Vite frontend in `client/` and an Express backend in `server/`. The backend serves `client/dist` in production allowing a single-service deployment.

Recommended: deploy a single Railway service from the repository root.

Required environment variables

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — optional; default 5000

Railway (Web UI)

1. Create a new project on Railway and connect your GitHub repository.
2. When adding a service, choose "Deploy from GitHub" and point to this repo.
3. Set the service root directory to the repository root (or `.`).
4. Set the Build Command to:

   npm run build:client && cd server && npm install

   or use the top-level helper script:

   npm run install:all && npm run build:client

5. Set the Start Command to:

   cd server && npm start

6. In Railway dashboard -> Variables, add:
- `MONGO_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: a strong secret
- `PORT` (optional): 5000

7. Deploy. Railway will build the client and start the server. The server will serve the frontend from `/client/dist`.

Railway (CLI)

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. From repo root run:

   railway init

   Choose to create a new project or link to an existing one.

4. Set the environment variables via CLI or in the web dashboard:

   railway variables set MONGO_URI "your_uri"
   railway variables set JWT_SECRET "your_secret"

5. Deploy (build & run):

   railway up

Notes & Verification

- The backend serves the static client when `NODE_ENV=production`.
- After deployment, set `VITE_API_URL` in the client (on Vercel or as env for client) if you host client separately. For single Railway service this is not required.
- Verify the service URL in Railway and visit it in the browser.
- If APIs return 500, check Railway logs for DB connectivity or missing env vars.

Troubleshooting

- If MongoDB Atlas blocks connections, ensure IP access is allowed (you can allow 0.0.0.0/0 for testing).
- If large JS chunks trigger warnings, consider code-splitting or reducing bundle size.

If you want, I can:
- Create a Railway-specific `railway.json` file
- Prepare a GitHub Actions workflow to auto-deploy on push
- Walk you through the Railway web UI and run `railway up` locally (you'll need to authorize CLI)
