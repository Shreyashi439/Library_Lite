import { useEffect, useState } from "react";
import { getBooks, createBook } from "../api/books.api";
import { getMembers } from "../api/members.api";
import LendBookModal from "../components/LendBookModal";

function Catalog() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    tags: "",
  });

  const fetchData = async () => {
    try {
      const [booksRes, membersRes] = await Promise.all([
        getBooks(search),
        getMembers(),
      ]);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await createBook({
        title: form.title,
        author: form.author,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setForm({ title: "", author: "", tags: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding book");
    }
  };

  return (
    <div>
      <h2>Catalog</h2>

      {/* Add Book */}
      <form onSubmit={handleAddBook} style={{ marginBottom: 30 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) =>
            setForm({ ...form, author: e.target.value })
          }
          required
        />
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value })
          }
        />
        <button type="submit">Add Book</button>
      </form>

      {/* Search */}
      <input
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Book List */}
      <div style={{ marginTop: 20 }}>
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              background: "white",
              padding: 16,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Tags: {book.tags?.join(", ")}</p>

            <p>
              Status:{" "}
              <strong
                style={{
                  color:
                    book.status === "AVAILABLE"
                      ? "#16A34A"
                      : "#DC2626",
                }}
              >
                {book.status}
              </strong>
            </p>

            {/* Always visible */}
            <button
              onClick={() => setSelectedBook(book)}
              style={{
                background:
                  book.status === "AVAILABLE"
                    ? "#16A34A"
                    : "#F59E0B",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {book.status === "AVAILABLE"
                ? "Lend"
                : "Join Waitlist"}
            </button>
          </div>
        ))}
      </div>

      {/* Lend / Waitlist Modal */}
      {selectedBook && (
        <LendBookModal
          book={selectedBook}
          members={members}   // 👈 important
          onClose={() => setSelectedBook(null)}
          onSuccess={() => {
            fetchData();
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
}

export default Catalog;
