const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true 
  },
  image: String,
  owner: {
    type: ObjectId,
    required: true
  },
  admins: {
    type: [ObjectId],
    default: [],
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  created: {
    type: Date, 
    default: Date.now 
  },
  description: String,
  group: ObjectId
});

ProjectSchema.pre('save', function(next){
  this.admins.addToSet(this.owner);
  next();
})

ProjectSchema.index({ title: "text" });
const Project = mongoose.model("Project", ProjectSchema);

module.exports = { Project };
