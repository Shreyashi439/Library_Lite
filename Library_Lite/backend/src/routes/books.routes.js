 const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books.controller");

// CRUD routes
router.post("/", booksController.createBook);
router.get("/", booksController.getBooks);
router.put("/:id", booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

module.exports = router;  // ✅ MUST export router
