import * as React from 'react';
import NoteForm from './NoteForm';
import NoteItem from './NoteItem';

export interface Note {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  deleted: boolean;
}

export interface NoteListProp {
  notes: ReadonlyArray<Note>;
  createNoteHandler: (data: { title: string; text: string }) => void;
  updateNoteHandler: (
    id: string,
    data: { title: string; text: string }
  ) => void;
  deleteNoteHandler: (id: string) => void;
  recoverNoteHandler: (id: string) => void;
}

export default function NoteList({
  notes,
  createNoteHandler,
  updateNoteHandler,
  deleteNoteHandler,
  recoverNoteHandler,
}: NoteListProp) {
  const [inEditMode, setInEditMode] = React.useState<{
    [key: string]: boolean;
  }>(notes.reduce((dict, note) => ({ ...dict, [note.id]: false }), {}));

  const toggleModeHandler = (id: string) => {
    setInEditMode({ ...inEditMode, [id]: !inEditMode[id] });
  };

  return (
    <div className="note-list">
      {notes.map((note) =>
        inEditMode[note.id] ? (
          <NoteForm
            key={note.id}
            title={note.title}
            text={note.text}
            isUpdate={true}
            createHandler={createNoteHandler}
            toggleModeHandler={() => toggleModeHandler(note.id)}
            updateHandler={(data) => updateNoteHandler(note.id, data)}
          />
        ) : (
          <NoteItem
            key={note.id}
            title={note.title}
            text={note.text}
            deleted={note.deleted}
            recoverHandler={() => recoverNoteHandler(note.id)}
            toggleModeHandler={() => toggleModeHandler(note.id)}
            deleteHandler={() => deleteNoteHandler(note.id)}
          />
        )
      )}
      <NoteForm isUpdate={false} createHandler={createNoteHandler} />
    </div>
  );
}
