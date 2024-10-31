const axios = require("axios");
const Recipe = require("../models/Recipe");

  const getRecipe = async (req, res, next) => {
    try {
        const imageUrl = "https://food-recog.onrender.com/images/" + req.savedImages[0];
        const response = await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'arraybuffer'
        });
        const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
        axios({
    method: "POST",
    //url: "https://detect.roboflow.com/food-ingredients-detection-qfit7/35",
    url: "https://detect.roboflow.com/food-ingredients-detection-qfit7/48",
    params: {
        api_key: "",
    },
    data: imageBase64,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})
.then(async function(apiResponse) {
    const predictions = apiResponse.data.predictions;
  const classMapping = {
          "potato": "potato",
          "lemon": "lemon",
          "tomato": "tomato",
          "onion": "onion",
          "egg": "egg",
          "mushroom": "mushroom",
          "olive": "olive",
          "bell pepper": "bell pepper",
          "garlic": "garlic",
          "zucchini": "zucchini",
          "cucumber": "cucumber",
          "green pepper": "green pepper",
          "milk": "milk",
          "eggplant": "eggplant",
          "banana": "banana",
          "tomato paste": "tomato paste",
          "olive oil": "olive oil",
          "rice": "rice",
          "cheese": "cheese",
          "chickpeas": "chickpeas",
          "chicken": "chicken",
          "mayonnaise": "mayonnaise",
          "yogurt": "yogurt",
          "margarine": "margarine",
          "red lentils": "red lentils",
          "ketchup": "ketchup",
          "spaghetti": "spaghetti",
          "fusilli pasta": "fusilli pasta",
          "parsley": "parsley",
          "carrot": "carrot",
          "bulgur": "bulgur",
          "ground meat": "ground meat",
          "sausage": "sausage",
          "farfalle pasta": "farfalle pasta",
          "turkish dumplings": "turkish dumplings",
          "cabbage": "cabbage",
        };

    // predictions dizisini sınıflara göre gruplayacak bir obje oluşturalım
      const classGroups = {};
      predictions.forEach(item => {
          const className = classMapping[item.class] || 'Bilinmeyen Sınıf';
          if (!classGroups[className] || item.confidence > classGroups[className].confidence) {
            classGroups[className] = {
                class: className,
                confidence: item.confidence.toFixed(2)
            };
        }
    });

      // Oluşturduğumuz objeden sadece değerleri alarak bir dizi elde edelim
    const detectedClasses = Object.values(classGroups);
    const gelenIngredients = detectedClasses || [];
    console.log("GELEN INGREDIENTS ", gelenIngredients);
    const allRecipes = await Recipe.find({});
   const sonuc = allRecipes.map(recipe => {
    const { name, coverPhoto, ingredients, detailedIngredients, description, images } = recipe;
    const kullanilanIngredients = ingredients.filter((ingredient) =>
        gelenIngredients.some(item => item.class === ingredient)
    );

    if (kullanilanIngredients.length === 0) {
        return null; // Eşleşen malzeme bulunamadı, bu tarifi döndürme
    }
    const kullanilmayanIngredients = gelenIngredients.filter(
        (item) => !ingredients.includes(item.class)
    ).map(item => item.class);
    const eksikIngredients = ingredients.filter(
        (ingredient) => !gelenIngredients.some(item => item.class === ingredient)
    );

    return {
        yemekAdi: name,
        tarif: description,
        resim: coverPhoto,
        kullanilanIngredients,
        kullanilmayanIngredients,
        eksikIngredients,
        digerResimler: images,
        detailedIngredients
    };
}).filter(recipe => recipe !== null) // null olmayanları filtrele
  .sort((a, b) => b.kullanilanIngredients.length - a.kullanilanIngredients.length); // kullanılan malzemelerin sayısına göre sırala

res.json({sonuc, algilananIngredients: gelenIngredients});

})
.catch(function(error) {
      console.log("ROBFLOW HATASI:", error.message);
      res.status(500).json(error);
});
    } catch (err) {
        console.log("server hatasi: ", err.message);
        res.status(500).json(err);
    }
};


module.exports = {
   getRecipe
  };
