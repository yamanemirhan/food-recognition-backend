const CustomError = require("../helpers/error/CustomError");
const Recipe = require("../models/Recipe");
const Market = require("../models/Market");

const addRecipe = async (req, res, next) => {
    try {
        // Eğer yüklü dosya yoksa veya birden fazla dosya yüklenmişse hata fırlat
        if (!req.savedImages || req.savedImages.length === 0) {
            throw new CustomError("Please upload a file", 400);
        }
        
        // Yüklü dosyaların URL'lerini al
        const images = req.savedImages.filter(image => !image.startsWith("cover_"));
        const coverPhoto = req.savedImages.find(image => image.startsWith("cover_"));

        // Gelen istekten diğer bilgileri al
        const { name, ingredients, detailedIngredients, description } = JSON.parse(req.body.recipeData);
        
        // Yeni bir tarif oluştur
        const recipe = new Recipe({
            name,
            coverPhoto,
            images,
            ingredients,
            detailedIngredients,
            description
        });

        // Tarifi kaydet
        const savedRecipe = await recipe.save();

        res.status(201).json({
            success: true,
            data: savedRecipe
        });
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Server Error"
        });
    }
};

const addMarket = async (req, res, next) => {
    try {
        console.log("geldi MARKETEE");
        // Eğer yüklü dosya yoksa veya birden fazla dosya yüklenmişse hata fırlat
        if (!req.savedImages || req.savedImages.length === 0) {
            throw new CustomError("Please upload a file", 400);
        }
        
        // Yüklü dosyaların URL'lerini al
        const coverPhoto = req.savedImages.find(image => image.startsWith("market_"));

        // Gelen istekten diğer bilgileri al
        const { name, type, products, location, openingHours } = JSON.parse(req.body.marketData);
        
        // Yeni bir market nesnesi oluştur
        const newMarket = new Market({
            name,
            type,
            products,
            location,
            openingHours,
            coverPhoto // coverPhoto burada market_image olarak atanıyor
        });

        // Yeni marketi veritabanına kaydet
        const savedMarket = await newMarket.save();

        res.status(201).json({
            success: true,
            data: savedMarket
        });
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Server Error"
        });
    }
};

module.exports = {
    addRecipe,
    addMarket
};
