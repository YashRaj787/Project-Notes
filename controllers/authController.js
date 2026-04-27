const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id,name,email",
      [name, email, hashed]
    );

    res.json(result.rows[0]);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Signup failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7D" }
    );

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
};
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const result = await pool.query(
      "UPDATE notes SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [content, id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Update failed" });
  }
};
exports.deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
};