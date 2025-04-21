const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  image: {
    type: String,
    default: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg',
  },
});

// Add indexes
productSchema.index({ title: 1 });
productSchema.index({ category: 1 });

const ProductDataModel = mongoose.model('Products', productSchema);

module.exports = { ProductDataModel };