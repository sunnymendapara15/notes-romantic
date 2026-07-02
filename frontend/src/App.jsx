import { useCallback, useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingDraft, setEditingDraft] = useState({ title: '', content: '' });

  const refreshNotes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) throw new Error('Unable to fetch notes');
      const data = await response.json();
      setNotes(data);
      setStatus('');
    } catch (error) {
      console.error(error);
      setStatus('Unable to load notes from the backend.');
    }
  }, []);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!newNote.title.trim() && !newNote.content.trim()) {
      setStatus('Add a title or some content before saving.');
      return;
    }

    try {
      setStatus('Saving note...');
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });

      if (!response.ok) throw new Error('Save failed');

      setNewNote({ title: '', content: '' });
      setStatus('Note saved');
      refreshNotes();
    } catch (error) {
      console.error(error);
      setStatus('Unable to reach the backend.');
    }
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditingDraft({ title: note.title, content: note.content });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingDraft({ title: '', content: '' });
  };

  const submitEdit = async () => {
    if (!editingId) return;

    try {
      setStatus('Updating note...');
      const response = await fetch(`${API_BASE_URL}/notes/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDraft)
      });

      if (!response.ok) throw new Error('Update failed');

      setStatus('Note updated');
      cancelEditing();
      refreshNotes();
    } catch (error) {
      console.error(error);
      setStatus('Unable to update the note.');
    }
  };

  const removeNote = async (id) => {
    try {
      setStatus('Deleting note...');
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Delete failed');

      if (editingId === id) cancelEditing();
      setStatus('Note deleted');
      refreshNotes();
    } catch (error) {
      console.error(error);
      setStatus('Unable to delete the note.');
    }
  };

  return (
    <div className="app-shell">
      <header>
        <p className="eyebrow">Private scratchpad</p>
        <h1>Notes Just for You</h1>
        <p>Unlimited notes, edit them instantly, and delete what you no longer need. No login required.</p>
      </header>

      <section className="note-form">
        <h2>Add a new note</h2>
        <form onSubmit={handleAdd}>
          <label>
            Title
            <input
              type="text"
              value={newNote.title}
              onChange={(event) => setNewNote({ ...newNote, title: event.target.value })}
              placeholder="Give your note a title (optional)"
            />
          </label>
          <label>
            Content
            <textarea
              rows={4}
              value={newNote.content}
              onChange={(event) => setNewNote({ ...newNote, content: event.target.value })}
              placeholder="Type your note here"
            />
          </label>
          <div className="form-actions">
            <button type="submit">Save note</button>
            <span className="status" aria-live="polite">
              {status}
            </span>
          </div>
        </form>
      </section>

      <section className="note-list">
        <div className="section-heading">
          <h2>Your notes</h2>
          <p>{notes.length === 0 ? 'No notes yet. Start by saving the one above.' : `${notes.length} note${notes.length === 1 ? '' : 's'}`}</p>
        </div>
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              {editingId === note.id ? (
                <div className="note-edit">
                  <input
                    type="text"
                    value={editingDraft.title}
                    onChange={(event) => setEditingDraft({ ...editingDraft, title: event.target.value })}
                    placeholder="Title"
                  />
                  <textarea
                    rows={4}
                    value={editingDraft.content}
                    onChange={(event) => setEditingDraft({ ...editingDraft, content: event.target.value })}
                  />
                  <div className="note-actions">
                    <button onClick={submitEdit}>Save changes</button>
                    <button type="button" className="ghost" onClick={cancelEditing}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="note-stack">
                    <div>
                      <h3>{note.title || 'Untitled note'}</h3>
                      <p className="meta">Created {new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="note-actions note-actions--top">
                      <button onClick={() => startEditing(note)}>Edit</button>
                      <button type="button" className="ghost" onClick={() => removeNote(note.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="note-content">{note.content || '— No content yet.'}</p>
                  {note.updatedAt ? (
                    <p className="meta subtle">Last updated {new Date(note.updatedAt).toLocaleString()}</p>
                  ) : null}
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <p>Use `VITE_API_URL` to point the frontend at the running backend before launching.</p>
      </footer>
    </div>
  );
}
