const express = require("express");
const {
  getAllRecipes,
  getSingleRecipe
} = require("../controllers/recipe");

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/detail/:id", getSingleRecipe);

module.exports = router;