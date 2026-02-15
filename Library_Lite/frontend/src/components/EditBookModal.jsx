import { useState } from "react";
import { updateBook } from "../api/books.api";

function EditBookModal({ book, onClose, onSuccess }) {
  const [author, setAuthor] = useState(book.author);
  const [tags, setTags] = useState(book.tags?.join(", ") || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateBook(book.id, {
        author,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      alert("Book updated successfully");
      onSuccess();
    } catch (err) {
      alert("Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Edit Book</h3>

        <p>
          <strong>Title:</strong> {book.title}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />

          <input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBookModal;

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "white",
  padding: 24,
  borderRadius: 8,
  width: 350,
};
