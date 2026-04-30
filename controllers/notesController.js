const pool = require("../db");

// CREATE
exports.createNote = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, content) VALUES ($1, $2) RETURNING *",
      [req.user.id, content]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create note" });
  }
};

// READ
exports.getNotes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// UPDATE
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content required" });
  }

  try {
    const result = await pool.query(
      "UPDATE notes SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [content, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Update failed" });
  }
};

// DELETE
exports.deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
};