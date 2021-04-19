const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DbUsers = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  username: String,
  password: {
    type: String,
  },
});

module.exports = mongoose.model("profile", DbUsers);
