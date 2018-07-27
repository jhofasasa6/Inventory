const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PresentationSchema = Schema({
  name: {
    type: String,
    require: true
  },
  quantity: {
    type: Number,
    require: true
  }
});

module.exports = Presentation = mongoose.model(
  "Presentation",
  PresentationSchema
);
