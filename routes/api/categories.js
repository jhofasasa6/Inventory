const express = require("express");
const router = express.Router();

const Categories = require("../../models/categories");

router.get("/", (req, res) => {
  Categories.find()
    .sort({ data: -1 })
    .then(categories => res.json(categories));
});

router.post("/", (req, res) => {
  let newCategories = new Categories({
    name: req.body.name,
    description: req.body.description
  });

  newCategories.save().then(categories => res.json(categories));
});

router.put("/:id", (req, resp) => {
  let categorie = {};
  categorie.name = req.body.name;
  categorie.description = req.body.description;

  let qurery = { _id: req.params.id };

  Categories.update(qurery, categorie, err => {
    if (err) {
      console.log(err);
    }
  }).then(categories => resp.json(categories));
});

router.delete("/:id", (req, res) => {
  Categories.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
