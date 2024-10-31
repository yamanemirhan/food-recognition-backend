const express = require("express");
const {
  getMissingIngredientsAndMarket, getAllMarkets
} = require("../controllers/market");

const router = express.Router();

router.post("/", getMissingIngredientsAndMarket);
router.get("/", getAllMarkets);

module.exports = router;
