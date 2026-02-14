import { useState } from "react";
import { populateByGenre } from "../api/populate.api";

function Populate() {
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePopulate = async (e) => {
    e.preventDefault();
    if (!genre.trim()) return alert("Enter a genre");

    try {
      setLoading(true);
      const res = await populateByGenre(genre);
      setResult(res.data);
      setGenre("");
    } catch (err) {
      alert("Failed to populate books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Populate Library by Genre</h2>

      <form onSubmit={handlePopulate} style={{ marginBottom: 20 }}>
        <input
          placeholder="Genre (e.g. Fantasy, Sci‑Fi)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Populating..." : "Populate"}
        </button>
      </form>

      {result && (
        <div
          style={{
            background: "white",
            padding: 16,
            borderRadius: 8
          }}
        >
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Books Added:</strong> {result.insertedCount}</p>
        </div>
      )}
    </div>
  );
}

export default Populate;
