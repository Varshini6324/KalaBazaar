const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Metalwork', 'Other'],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one product image'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 1,
    },
    storySnippet: {
      type: String, // Short story for the product card
      maxlength: 150,
    },
    artisanStory: {
      type: String, // Full artisan story for product detail
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
