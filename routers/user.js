const express = require("express");
const {
  getRecipe
} = require("../controllers/user");
const { getAccessToRoute } = require("../middlewares/authorization/authMiddleware");
const imageUpload = require("../middlewares/libraries/imageUpload");

const router = express.Router();

router.post("/get-recipe", imageUpload.single("food_recog_image"), getRecipe);

module.exports = router;