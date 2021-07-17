const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  publicId : {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

ImageSchema.index({imageUrl: 1})
const Image = mongoose.model("Image", ImageSchema)
module.exports = { Image };
