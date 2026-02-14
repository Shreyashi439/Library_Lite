const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");

// Overdue loans
router.get("/overdue", reportsController.overdueReport);

// Top N books
router.get("/top-books", reportsController.topBooksReport);

module.exports = router;
