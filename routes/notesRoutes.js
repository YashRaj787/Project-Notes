const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const notesController = require("../controllers/notesController");

// create note
router.post("/", authMiddleware, notesController.createNote);

// get my notes
router.get("/", authMiddleware, notesController.getNotes);
router.put("/:id", authMiddleware, notesController.updateNote);
router.delete("/:id", authMiddleware, notesController.deleteNote);

module.exports = router;