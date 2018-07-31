const express = require("express");
const router = express.Router();

const Categories = require("../../models/categories");

router.get("/", (req, res) => {
  Categories.find()
    .then(categories => res.json(categories));
});

router.get("/:id", (req, res) => {
  Categories.findById(req.params.id)
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
  let categories = {};
  categories.name = req.body.name;
  categories.description = req.body.description;

  let qurery = { _id: req.params.id };

  Categories.update(qurery, categories, err => {
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
