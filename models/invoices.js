const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoicesSchema = Schema({
  date: {
    type: Date,
    require: true
  },
  idClient: {
    type: String,
    require: true
  },
  products: [
    {
      idProduct: {
        type: String,
        require: true
      },
      quantity: {
        type: Number,
        requiere: true
      },
      price: {
        type: Number,
        requiere: true
      }
    }
  ],
  invoiceNumber: {
    type: String,
    requiere: false
  },
  totalProducts: {
    type: Number,
    requiere: true
  },
  subTotal: {
    type: Number,
    requiere: true
  },
  totalTax: {
    type: Number,
    requiere: true
  },
  total: {
    type: Number,
    requiere: true
  }
});

module.exports = Invoice = mongoose.model("Invoice", InvoicesSchema);
