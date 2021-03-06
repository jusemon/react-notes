import * as React from 'react';
import NoteItem from './NoteItem';
import { Note } from './NoteList';

export interface NoteBinProp {
  notes: ReadonlyArray<Note>;
  deleteNoteHandler: (id: string) => void;
  recoverNoteHandler: (id: string) => void;
}

export default function NoteList({
  notes,
  deleteNoteHandler,
  recoverNoteHandler,
}: NoteBinProp) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          title={note.title}
          text={note.text}
          deleted={note.deleted}
          recoverHandler={() => recoverNoteHandler(note.id)}
          deleteHandler={() => deleteNoteHandler(note.id)}
        />
      ))}
    </div>
  );
}
