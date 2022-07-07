import * as React from 'react';
import {
  RiFileEditFill,
  RiDeleteBinFill,
  RiFileUploadFill,
} from 'react-icons/ri';

export interface NoteItemProp {
  title: string;
  text: string;
  deleted: boolean;
  deleteHandler: () => void;
  recoverHandler?: () => void;
  toggleModeHandler?: () => void;
}

export default function NoteItem({
  title,
  text,
  deleted,
  toggleModeHandler,
  deleteHandler,
  recoverHandler,
}: NoteItemProp) {
  return (
    <div className="note-item">
      <div className="note-item-title">{title}</div>
      <div className="note-item-text">{text}</div>
      <div className="note-item-footer">
        {deleted ? (
          <RiFileUploadFill color="green" onClick={() => recoverHandler && recoverHandler()} />
        ) : (
          <RiFileEditFill color="blue" onClick={() => toggleModeHandler && toggleModeHandler()} />
        )}
        <RiDeleteBinFill color="red" onClick={() => deleteHandler()} />
      </div>
    </div>
  );
}
