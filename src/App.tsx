import * as React from 'react';
import { nanoid } from 'nanoid';
import Swal from 'sweetalert2';
import {
  RiStickyNoteFill,
  RiStickyNoteLine,
  RiDeleteBinLine,
} from 'react-icons/ri';
import './style.css';
import NoteList, { Note } from './components/NoteList';
import { NoteFormData } from './components/NoteForm';
import NoteSearch from './components/NoteSearch';

export default function App() {
  const notesLS = localStorage.getItem('notes');
  const [inTrashBin, setInTrashBin] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [notes, setNotes] = React.useState<Array<Note>>(
    notesLS
      ? JSON.parse(notesLS)
      : []
  );

  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  });

  const createNoteHandler = (data: NoteFormData) => {
    setNotes([
      ...notes,
      { ...data, id: nanoid(), createdAt: new Date(), deleted: false },
    ]);
  };

  const updateNoteHandler = (id: string, data: NoteFormData) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      const noteIndex = notes.indexOf(note);
      notes.splice(noteIndex, 1, { ...note, ...data });
      setNotes([...notes]);
    }
  };

  const deleteNoteHandler = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      const noteIndex = notes.indexOf(note);
      const message = note.deleted
        ? `Are you sure that you want to delete permanently the note "${note.title}"?`
        : `Are you sure that you want to delete the note "${note.title}"?`;
      Swal.fire({
        title: 'Caution',
        text: message,
        icon: 'question',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          if (note.deleted) {
            notes.splice(noteIndex, 1);
          } else {
            notes.splice(noteIndex, 1, { ...note, deleted: true });
          }
          setNotes([...notes]);
        }
      });
    }
  };

  const searchNoteHandler = (text: string) => {
    setSearchText(text);
  };

  const recoverNoteHandler = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      const noteIndex = notes.indexOf(note);
      notes.splice(noteIndex, 1, { ...note, deleted: false });
      setNotes([...notes]);
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">
        <RiStickyNoteFill className="app-title-icon" />
        Notes App
        <NoteSearch text={searchText} searchNoteHandler={searchNoteHandler} />
      </h1>
      <div className="app-navigation">
        <div className="app-navigation-items">
          <div
            className={`app-navigation-item ${!inTrashBin ? 'selected' : ''}`}
            onClick={() => setInTrashBin(false)}
          >
            <RiStickyNoteLine className="app-navigation-icon" /> Notes
          </div>
          <div
            className={`app-navigation-item ${inTrashBin ? 'selected' : ''}`}
            onClick={() => setInTrashBin(true)}
          >
            <RiDeleteBinLine className="app-navigation-icon" /> Trash bin
          </div>
        </div>
        <div className="app-navigation-content">
          <NoteList
            inTrashBin={inTrashBin}
            notes={notes
              .filter((n) => (inTrashBin ? n.deleted : !n.deleted))
              .filter(
                (n) =>
                  n.title
                    .toLowerCase()
                    .includes(searchText.toLowerCase().trim()) ||
                  n.text.toLowerCase().includes(searchText.toLowerCase().trim())
              )}
            createNoteHandler={createNoteHandler}
            updateNoteHandler={updateNoteHandler}
            deleteNoteHandler={deleteNoteHandler}
            recoverNoteHandler={recoverNoteHandler}
          />
        </div>
      </div>
    </div>
  );
}
