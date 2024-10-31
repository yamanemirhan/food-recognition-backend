const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['market', 'manav', 'kasap'], // Sadece belirli tipleri kabul ediyoruz
    required: true
  },
  products: [{
    name: String,
    price: Number
  }],
  location: {
    type: { type: String, default: 'Point' }, // Konum tipi Point (MongoDB Geospatial Index için)
    coordinates: [Number] // Koordinatlar [longitude, latitude] sırasıyla
  },
  openingHours: {
    type: String // Açılış ve kapanış saatleri metin olarak saklanabilir
  },
  coverPhoto: {
    type: String,
    required: false
  },
});

// Konum alanı için indeks oluştur
marketSchema.index({ location: '2dsphere' });

const Market = mongoose.model('Market', marketSchema);

module.exports = Market;
