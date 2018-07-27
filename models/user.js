const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },  
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    requiere: false
  }
});

module.exports = User = mongoose.model(
  "User",
  UserSchema
);
