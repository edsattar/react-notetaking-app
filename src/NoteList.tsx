import React from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "./App";
import { EditTagsModal } from "./EditTagsModal";
import { NoteCard } from "./NoteCard";

type Props = {
  availableTags: Tag[];
  notes: Note[];
  deleteTag: (id: string) => void;
  updateTag: (id: string, label: string) => void;
};
const NoteList = ({
  availableTags,
  notes,
  updateTag,
  deleteTag,
}: Props) => {
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  const [title, setTitle] = React.useState("");
  const [showEditTagsModal, setShowEditTagsModal] = React.useState(false);

  const filteredNotes = React.useMemo(() => {
    return notes.filter((note) => {
      if (title && !note.title.toLowerCase().includes(title.toLowerCase())) {
        return false;
      }
      if (selectedTags.length > 0) {
        const noteTagIds = note.tags.map((tag) => tag.id);
        const selectedTagIds = selectedTags.map((tag) => tag.id);
        const hasAllTags = selectedTagIds.every((id) =>
          noteTagIds.includes(id)
        );
        if (!hasAllTags) {
          return false;
        }
      }
      return true;
    });
  }, [notes, title, selectedTags]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="new">
              <Button variant="primary">New Note</Button>
            </Link>
            <Button
              onClick={() => setShowEditTagsModal(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                value={selectedTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => ({
                      id: tag.value,
                      label: tag.label,
                    }))
                  );
                }}
                options={availableTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        show={showEditTagsModal}
        handleClose={() => setShowEditTagsModal(false)}
        availableTags={availableTags}
        onUpdateTag={updateTag}
        onDeleteTag={deleteTag}
      />
    </>
  );
};

export default NoteList;
