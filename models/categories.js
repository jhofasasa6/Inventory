const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriesSchema = Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String    
  }
});

module.exports = Categories = mongoose.model(
  "Categories",
  CategoriesSchema
);
