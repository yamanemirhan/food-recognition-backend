const express = require("express");
const {
  register,
  login,
  logout
} = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/logout", getAccessToRoute, logout);
module.exports = router;