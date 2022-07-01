import * as React from 'react';

export interface NoteSearchProp {
  text: string;
  searchNoteHandler: (text: string) => void;
}

export default function NoteSearch({
  text,
  searchNoteHandler,
}: NoteSearchProp) {
  return (
    <div className="note-search">
      <input
        type="text"
        placeholder="Search..."
        value={text}
        onChange={(e) => searchNoteHandler(e.target.value)}
      />
    </div>
  );
}
