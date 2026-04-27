require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();        // ✅ FIRST create app

app.use(cors());              // ✅ THEN use it
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// test
app.get("/", (req, res) => {
  res.send("API running clean");
});

// start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});