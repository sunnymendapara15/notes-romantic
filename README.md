# Notes Romantic

Personal notes workspace with a React front-end and a .NET Lite API backend. There is no authentication—everything runs locally so you can jot down as many notes as you like and edit or delete them on demand. It is intentionally lightweight so you can keep your notes private inside your own browser or self-host it for a quick preview.

## Backend
1. `cd backend`
2. `dotnet run --urls http://localhost:5000`

The API keeps notes in memory and exposes the following endpoints:
- `GET /notes` – list all notes
- `POST /notes` – create a note with `{ title, content }`
- `PUT /notes/{id}` – update the title/content of a note
- `DELETE /notes/{id}` – remove the note

## Frontend
1. `cd frontend`
2. `npm install`
3. Set `VITE_API_URL` to match where the backend is running (default: `http://localhost:5000`)
4. `npm run dev`

The React app lets you add, edit, and delete notes one at a time, keeping your changes in sync with the API.

## Preview deployment stack

To avoid running anything locally, you can deploy the backend and frontend to Render and Vercel respectively. The repository already includes helpful configuration (`render.yaml` for Render and `vercel.json` for Vercel) so you can import and deploy the project in just a few clicks.

### Backend (Render)
1. Import `notes-romantic` into Render as a **Web Service**.
2. When prompted, point the **root** to `backend`, choose the `main` branch, and let Render run the existing `render.yaml` (you can also paste the same settings manually).
3. Use `dotnet publish -c Release -o ./publish` as the build command and `dotnet ./publish/notes-api.dll --urls http://0.0.0.0:10000` as the start command.
4. Set the environment variables listed in `render.yaml` (`DOTNET_ENVIRONMENT=Production` and `ASPNETCORE_URLS=http://0.0.0.0:10000`).
5. Render will expose a public URL such as `https://notes-romantic-api.onrender.com` after deployment.

### Frontend (Vercel)
1. Import the repo into Vercel and configure the **Root Directory** as `frontend`.
2. Verify the build command is `npm install && npm run build` (Vercel usually infers this) and the output directory is `dist`.
3. Add an environment variable named `VITE_API_URL` pointing to the Render backend URL.
4. Deploy the project—Vercel will provide a production URL that instantly serves the notes UI, now wired to your Render API.

Once both services are live, the Vercel frontend will talk to the Render backend giving you a live preview without installing anything locally. You can share the Vercel URL with anyone you trust and keep the notes to yourself.
