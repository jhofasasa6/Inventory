const express = require("express");
const router = express.Router();

const Presentation = require("../../models/presentation");

router.get("/", (req, res) => {
  Presentation.find()
    .sort({ data: -1 })
    .then(presentation => res.json(presentation));
});

router.post("/", (req, res) => {
  let newPresentation = new Presentation({
    name: req.body.name,
    quantity: req.body.quantity
  });

  newPresentation.save().then(presentation => res.json(presentation));
});

router.put("/:id", (req, resp) => {
  let presentation = {};
  presentation.name = req.body.name;
  presentation.quantity = req.body.quantity;

  let qurery = { _id: req.params.id };

  Presentation.update(qurery, presentation, err => {
    if (err) {
      console.log(err);
    }
  }).then(presentation => resp.json(presentation));
});

router.delete("/:id", (req, res) => {
  Presentation.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
