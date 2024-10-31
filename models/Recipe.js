const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: {
    type: String
  },
  coverPhoto: {
    type: String
  },
  images: {
    type: [String],
  },
  ingredients: {
    type: [String],
  },
  detailedIngredients: {
    type: [String],
  },
  description: {
    type: [String],
  },
}, {timestamps: true});


module.exports = mongoose.model("Recipe", RecipeSchema);
