const Market = require("../models/Market");

const getMissingIngredientsAndMarket = async (req, res, next) => {
  try {
    const { eksikIngredients, latitude, longitude, radius } = req.body;

    // Eksik malzemeler için en uygun marketleri bulacak fonksiyon
    const findCheapestMarketForIngredient = async (ingredient, nearbyMarkets) => {
      const markets = await Market.find({
        "_id": { $in: nearbyMarkets },
        "products.name": ingredient
      });

      if (markets.length === 0) return null; // Eğer bu malzemeyi satan bir market yoksa null döndür

      // En ucuz fiyatı bul
      let cheapestPrice = Infinity;
      let cheapestMarket = null;
      markets.forEach(market => {
        const product = market.products.find(product => product.name === ingredient);
        if (product.price < cheapestPrice) {
          cheapestPrice = product.price;
          cheapestMarket = {
            marketName: market.name,
            type: market.type,
            products: [{ name: product.name, price: product.price }],
            location: market.location,
            openingHours: market.openingHours
          };
        }
      });

      return cheapestMarket;
    };

    // Yakın marketleri bul
    const nearbyMarkets = await Market.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6378.1] // 6378.1 km cinsinden dunya yaricapi
        }
      }
    }).distinct('_id');

    // Tüm eksik malzemeler için en uygun marketleri bul
    const promises = eksikIngredients.map(ingredient => findCheapestMarketForIngredient(ingredient, nearbyMarkets));
    let results = await Promise.all(promises);

    // Boş olan market sonuçlarını kaldır
    const filteredResults = results.filter(result => result !== null);

    // Her marketin yalnızca bir kez görünmesini sağlayın
    const uniqueMarkets = {};
    filteredResults.forEach(result => {
      if (!uniqueMarkets[result.marketName]) {
        uniqueMarkets[result.marketName] = {
          marketName: result.marketName,
          type: result.type,
          location: result.location,
          openingHours: result.openingHours,
          products: []
        };
      }
      uniqueMarkets[result.marketName].products.push(...result.products);
    });

    // Bir nesne listesine dönüştürme
    let finalResults = Object.values(uniqueMarkets);

    // En ucuz ürünleri aynı fiyatla birden fazla markette bulunuyorsa, en yakın markete ekle
    finalResults = finalResults.map((market, index) => {
      const samePriceMarkets = finalResults.filter((m, i) => i !== index && m.products.some(p => p.price === market.products[0].price));
      if (samePriceMarkets.length > 0) {
        const nearestMarket = samePriceMarkets.reduce((nearest, current) => {
          const nearestDistance = Math.sqrt(Math.pow(nearest.location.coordinates[0] - latitude, 2) + Math.pow(nearest.location.coordinates[1] - longitude, 2));
          const currentDistance = Math.sqrt(Math.pow(current.location.coordinates[0] - latitude, 2) + Math.pow(current.location.coordinates[1] - longitude, 2));
          return nearestDistance < currentDistance ? nearest : current;
        });
        nearestMarket.products.push(...market.products);
        return null;
      } else {
        return market;
      }
    }).filter(market => market !== null);

    res.json({ success: true, data: finalResults });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllMarkets = async (req, res, next) => {
  try {
    const markets = await Market.find();
    res.json({ success: true, data: markets });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = {
    getMissingIngredientsAndMarket,
    getAllMarkets
};
