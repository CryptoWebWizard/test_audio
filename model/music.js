
const { Schema, model } = require("mongoose");



const musicSchema = new Schema({
    song: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },

  });
  
  module.exports = model("music", musicSchema);

