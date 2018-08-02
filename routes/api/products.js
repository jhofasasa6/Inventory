const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Products = require("../../models/products");
const Presentation = require("../../models/presentation");

router.get("/", (req, res) => {
  Products.find({}).then(product => {    
    res.json(product);
  });
});

router.post("/", (req, res) => {
  let newProducts = new Products({
    name: req.body.name,
    presentation: req.body.presentation,
    category: req.body.category,
    sku: req.body.sku,
    Inputs : req.body.Inputs,
    ActualAmount: req.body.ActualAmount
  });

  newProducts.save().then(products => res.json(products));
});

router.put("/:id", (req, resp) => {
  let products = {};
  products.name = req.body.name;
  products.presentation = req.body.presentation;
  products.category = req.body.category;
  products.sku = req.body.sku;
  products.Inputs = req.body.Inputs;
  products.ActualAmount= req.body.ActualAmount;

  let qurery = { _id: req.params.id };

  Products.update(qurery, products, err => {
    if (err) {
      console.log(err);
    }
  }).then(products => resp.json(products));
});

router.delete("/:id", (req, res) => {
  Products.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
