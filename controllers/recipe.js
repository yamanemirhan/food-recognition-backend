const Recipe = require("../models/Recipe");

const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
};

const getSingleRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    res.json({ success: true, data: recipe });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllRecipes,
  getSingleRecipe
};
