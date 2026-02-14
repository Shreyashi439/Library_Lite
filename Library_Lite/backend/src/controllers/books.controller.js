const supabase = require("../db/supabaseClient");

/**
 * CREATE BOOK
 */
exports.createBook = async (req, res) => {
  const { title, author, tags } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required"
    });
  }

  const { data, error } = await supabase
    .from("books")
    .insert([{ title, author, tags }])
    .select()
    .single();

  if (error) {
    // PostgreSQL unique constraint violation
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Book with this title already exists"
      });
    }
    return res.status(500).json(error);
  }

  res.status(201).json(data);
};

/**
 * GET BOOKS + SEARCH (title, author, tags)
 */
exports.getBooks = async (req, res) => {
  const { search } = req.query;

  let query = supabase.from("books").select("*");

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,author.ilike.%${search}%,tags.cs.{${search}}`
    );
  }

  const { data, error } = await query.order("title", { ascending: true });

  if (error) {
    return res.status(500).json({
      message: "Failed to fetch books",
      error
    });
  }

  res.json(data);
};

/**
 * UPDATE BOOK (author, tags only)
 */
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { author, tags } = req.body;

  const { data, error } = await supabase
    .from("books")
    .update({ author, tags })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      message: "Failed to update book",
      error
    });
  }

  res.json(data);
};

/**
 * DELETE BOOK
 */
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({
      message: "Failed to delete book",
      error
    });
  }

  res.json({ message: "Book deleted successfully" });
};
