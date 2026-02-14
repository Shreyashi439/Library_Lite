const supabase = require("../db/supabaseClient");
const { getGeminiClient } = require("../utils/geminiClient");

exports.populateByGenre = async (req, res) => {
  const { genre } = req.body;

  if (!genre) return res.status(400).json({ message: "Genre is required" });

  try {
    const gemini = await getGeminiClient();

    const prompt = `
      Give me a list of 10 books in the genre "${genre}".
      For each book, provide:
      - title
      - author
      - tags (comma separated)
      Return JSON array like:
      [
        { "title": "...", "author": "...", "tags": ["..."] },
        ...
      ]
    `;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";

    let books;

    try {
      const cleanedText = text.replace(/```json|```/g, "").trim();
      books = JSON.parse(cleanedText);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to parse Gemini output",
        error: err,
        raw: text,
      });
    }

    const inserted = [];

    for (const book of books) {
      const { title, author, tags } = book;
      try {
        const { error } = await supabase
          .from("books")
          .insert([{ title, author, tags }]);

        if (!error) inserted.push(book);
      } catch (err) {
        // skip duplicates or invalid
      }
    }

    res.json({
      message: "Books populated",
      insertedCount: inserted.length,
      inserted,
    });
  } catch (err) {
    res.status(500).json({ message: "Gemini API error", error: err });
  }
};
