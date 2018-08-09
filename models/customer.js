const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = Schema({
  identification: {
    type: String,
    require: true
  },
  names: {
    type: String,
    require: true
  },
  lastNames: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  address: {
    type: String,
    require: true
  }
});

module.exports = Customer = mongoose.model("Customer", CustomerSchema);
