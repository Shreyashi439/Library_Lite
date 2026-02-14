const express = require("express");
const router = express.Router();
const lendingController = require("../controllers/lending.controller");

// Lend a book
router.post("/lend", lendingController.lendBook);

// Return a book
router.post("/return", lendingController.returnBook);

module.exports = router;
