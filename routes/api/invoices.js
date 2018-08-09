const express = require("express");
const router = express.Router();

const Invoices = require("../../models/invoices");

router.get("/", (req, res) => {
  Invoices.find({}).then(product => {
    res.json(product);
  });
});

router.post("/", (req, res) => {
  console.log(req.body.products);
  let newInvoices = new Invoices({
    date: req.body.date,
    idClient: req.body.idClient,
    products: req.body.products,
    invoiceNumber: req.body.invoiceNumber,
    totalProducts: req.body.totalProducts,
    subTotal: req.body.subTotal,
    totalTax: req.body.totalTax,
    total: req.body.total
  });

  newInvoices.save().then(invoices => res.json(invoices));
});

router.put("/:id", (req, resp) => {
  let invoices = {};
  invoices.name = req.body.name;
  invoices.presentation = req.body.presentation;
  invoices.category = req.body.category;
  invoices.sku = req.body.sku;
  invoices.Inputs = req.body.Inputs;
  invoices.ActualAmount = req.body.ActualAmount;
  invoices.price = req.body.price;
  invoices.enable = req.body.enable;

  let qurery = { _id: req.params.id };

  Invoices.update(qurery, invoices, err => {
    if (err) {
      console.log(err);
    }
  }).then(invoices => resp.json(invoices));
});

module.exports = router;
