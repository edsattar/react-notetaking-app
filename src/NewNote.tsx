import React from "react";
import { NoteData, Tag } from "./App";
import NoteForm from "./NoteForm";

type Props = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

function NewNote({ onSubmit, onAddTag, availableTags }: Props) {
  return (
    <div>
      <h1 className="mb-4">New Note</h1>
      <NoteForm 
        onSubmit={onSubmit} 
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </div>
  );
}

export default NewNote;
