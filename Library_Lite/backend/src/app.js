const express = require("express");
const cors = require("cors");

const app = express();
const supabase = require("./db/supabaseClient");
const booksRoutes = require("./routes/books.routes");
const membersRoutes = require("./routes/members.routes");
const lendingRoutes = require("./routes/lending.routes");
const reportsRoutes = require("./routes/reports.routes");
// Your other routes
const populateRoutes = require("./routes/populate.routes");

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.use("/api/books", booksRoutes);
app.use("/api/members", membersRoutes);
app.use("/api", lendingRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/populate", populateRoutes);
module.exports = app;
