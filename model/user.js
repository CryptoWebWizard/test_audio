
const { Schema, model } = require("mongoose");



const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    full_name: {
        type: String
    },

  });
  
  module.exports = model("user", userSchema);

