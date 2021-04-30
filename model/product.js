const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DbProduct = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sale: Number,
  like: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
  },
  dateNow: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: String,
    minlength: 15,
  },
  photo: {
    type: String,
  },
  author: {
    type: String
  }
});

module.exports = mongoose.model("tovar", DbProduct);
