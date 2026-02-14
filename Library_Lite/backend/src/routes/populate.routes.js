const express = require("express");
const router = express.Router();
const populateController = require("../controllers/populate.controller");

router.post("/", populateController.populateByGenre);

module.exports = router;
