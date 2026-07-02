# Notes Romantic

Personal notes workspace with a React front-end and a .NET Lite API backend. There is no authentication—everything runs locally so you can jot down as many notes as you like and edit or delete them on demand.

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
