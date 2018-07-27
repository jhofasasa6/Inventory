const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

router.post("/register", (req, resp) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  let newUser = new User({
    name: name,
    email: email,
    username: username,
    password: password
  });

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if (err) {
        console.log(err);
      }
      newUser.password = hash;
      newUser.save().then(presentation => resp.json(presentation));
    });
  });
});

router.post("/login", (req, res) => {
  let query = { username: req.body.username };
  User.findOne(query, function(err, user) {
    if (err) {
      return res.json({ success: false, message: err });
    }
    if (!user) {
      return res.json({ success: false, message: "Usuario invalido" });
    }

    //match password
    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        return res.json({ success: true, user ,message :"" });
      } else {
        return res.json({ success: false, message: "Password invalido" });
      }
    });
  });
});

module.exports = router;
