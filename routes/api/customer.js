const express = require("express");
const router = express.Router();

const Customer = require("../../models/customer");

//get all
router.get("/", (req, res) => {
  Customer.find({}).then(customer => {
    res.json(customer);
  });
});

//Save
router.post("/", (req, res) => {
  let newCustomer = new Customer({
    identification: req.body.identification,
    names: req.body.names,
    lastNames: req.body.lastNames,
    phone: req.body.phone,
    address: req.body.address
  });

  newCustomer.save().then(customer => res.json(customer));
});

//Update
router.put("/:id", (req, resp) => {
  let customer = {};
  customer.identification = req.body.identification;
  customer.names = req.body.names;
  customer.lastNames = req.body.lastNames;
  customer.phone = req.body.phone;
  customer.address = req.body.address;

  let qurery = { _id: req.params.id };

  Customer.update(qurery, customer, err => {
    if (err) {
      console.log(err);
    }
  }).then(customer => resp.json(customer));
});

router.delete("/:id", (req, res) => {
  Products.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
