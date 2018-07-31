const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema({
  name: {
    type: String,
    require: true
  },
  presentation: {
    _id: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    quantity: {
      type: Number,
      require: true
    }
  },
  category: {
    _id: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    description: {
      type: String
    }
  },
  sku: {
    type: String
  }
});

module.exports = Product = mongoose.model("Product", ProductSchema);
