import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./NewNote";
import { v4 as uuidv4 } from "uuid";
import NoteList from "./NoteList";
import NoteLayout from "./NoteLayout";
import Note from "./Note";
import EditNote from "./EditNote";

export type Tag = {
  id: string;
  label: string;
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Note = {
  id: string;
} & NoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tag_ids: string[];
};

export type RawNote = {
  id: string;
} & RawNoteData;

function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      return item
        ? JSON.parse(item)
        : typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Save state to local storage on state change
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [storedValue, key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  return [storedValue, setStoredValue] as [T, typeof setStoredValue];
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    // loop through notes and add tags to each note
    // based on tag_ids array of note object
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tag_ids.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    // add note to notes array
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        // add id and tag_ids to note data to make it a RawNote
        { ...data, id: uuidv4(), tag_ids: tags.map((tag) => tag.id) },
      ];
    });
  }
  
  function onUpdateNote(id: string, { tags, ...data }: NoteData): void {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tag_ids: tags.map((tag) => tag.id),
          };
        }
        return note;
      });
    });
  }
  function onDeleteNote(id: string) {
    // remove note from notes array
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });  
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return {
            ...tag,
            label,
          };
        }
        return tag;
      });
    });
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id);
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<NoteList availableTags={tags} notes={notesWithTags} updateTag={updateTag} deleteTag={deleteTag}/>}
          />
        <Route
          path="new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote}/>} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
