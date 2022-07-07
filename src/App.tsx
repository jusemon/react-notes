import * as React from 'react';
import { nanoid } from 'nanoid';
import Swal from 'sweetalert2';
import {
  RiStickyNoteFill,
  RiStickyNoteLine,
  RiDeleteBinLine,
} from 'react-icons/ri';
import { NavLink, Route, Routes } from 'react-router-dom';
import './style.css';
import NoteList, { Note } from './components/NoteList';
import { NoteFormData } from './components/NoteForm';
import NoteSearch from './components/NoteSearch';
import NoteBin from './components/NoteBin';

export default function App() {
  const [searchText, setSearchText] = React.useState('');
  const [notes, setNotes] = React.useState<Array<Note>>(() => {
    const notesLS = localStorage.getItem('notes');
    return notesLS ? JSON.parse(notesLS) : [];
  });

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchText.toLowerCase().trim()) ||
      n.text.toLowerCase().includes(searchText.toLowerCase().trim())
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

  const isNavigationActiveClass = ({ isActive }: { isActive: boolean }) =>
    `app-navigation-item ${isActive && 'selected'}`;

  return (
    <div className="app">
      <h1 className="app-title">
        <RiStickyNoteFill className="app-title-icon" />
        Notes App
        <NoteSearch text={searchText} searchNoteHandler={searchNoteHandler} />
      </h1>
      <div className="app-navigation">
        <div className="app-navigation-items">
          <NavLink className={isNavigationActiveClass} to="/">
            <RiStickyNoteLine className="app-navigation-icon" /> Notes
          </NavLink>
          <NavLink className={isNavigationActiveClass} to="/trashbin">
            <RiDeleteBinLine className="app-navigation-icon" /> Trash bin
          </NavLink>
        </div>
        <div className="app-navigation-content">
          <Routes>
            <Route
              path="/"
              element={
                <NoteList
                  notes={filteredNotes.filter((n) => !n.deleted)}
                  createNoteHandler={createNoteHandler}
                  updateNoteHandler={updateNoteHandler}
                  deleteNoteHandler={deleteNoteHandler}
                  recoverNoteHandler={recoverNoteHandler}
                />
              }
            />
            <Route
              path="/trashbin"
              element={
                <NoteBin
                  notes={filteredNotes.filter((n) => n.deleted)}
                  deleteNoteHandler={deleteNoteHandler}
                  recoverNoteHandler={recoverNoteHandler}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
