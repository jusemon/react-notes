import * as React from 'react';
import { RiFileAddFill, RiSaveFill, RiCloseCircleFill } from 'react-icons/ri';

export interface NoteFormData {
  title: string;
  text: string;
}

export interface NoteFormProp {
  isUpdate: boolean;
  title?: string;
  text?: string;
  createHandler: (data: NoteFormData) => void;
  updateHandler?: (data: NoteFormData) => void;
  toggleModeHandler?: () => void;
}

export default function NoteForm({
  title,
  text,
  isUpdate,
  createHandler,
  updateHandler,
  toggleModeHandler,
}: NoteFormProp) {
  const [titleForm, setTitleForm] = React.useState(title || '');
  const [textForm, setTextForm] = React.useState(text || '');

  const ChangeIcon = isUpdate ? RiSaveFill : RiFileAddFill;

  const onChangeClick = () => {
    if (titleForm.length === 0 || textForm.length === 0) {
      return;
    }

    if (isUpdate && updateHandler && toggleModeHandler) {
      updateHandler({ title: titleForm, text: textForm });
      toggleModeHandler();
    } else {
      createHandler({ title: titleForm, text: textForm });
      setTitleForm('');
      setTextForm('');
    }
  };

  const onCancelClick = () => {
    if (isUpdate && toggleModeHandler) {
      toggleModeHandler();
    } else {
      setTitleForm('');
      setTextForm('');
    }
  };

  return (
    <div className="note-form">
      <input
        type="text"
        placeholder="Title"
        value={titleForm}
        onChange={(e) => setTitleForm(e.target.value)}
      />
      <textarea
        value={textForm}
        placeholder="Content"
        onChange={(e) => setTextForm(e.target.value)}
      ></textarea>
      <div className="note-form-footer">
        <ChangeIcon color="green" onClick={onChangeClick} />
        <RiCloseCircleFill color="red" onClick={onCancelClick} />
      </div>
    </div>
  );
}
