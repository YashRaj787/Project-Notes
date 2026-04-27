const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

const authController = require("../controllers/authController");

router.get("/test", (req, res) => {
  res.send("Auth route working");
});

router.post("/signup", authController.signup);

module.exports = router;
router.post("/login", authController.login);
