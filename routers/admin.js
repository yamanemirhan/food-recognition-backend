const express = require("express");
const {
  addRecipe,
  addMarket
} = require("../controllers/admin");
const { getAccessToRoute } = require("../middlewares/authorization/authMiddleware");
const imageUpload = require("../middlewares/libraries/imageUpload");

const router = express.Router();

router.post("/add-recipe", imageUpload.fields([{ name: 'food_image' }, { name: 'cover_image' }]), addRecipe);
router.post("/add-market", imageUpload.single("market_image"), addMarket);

module.exports = router;
