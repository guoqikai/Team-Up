"use strict";

const { Skill } = require("./models/skill");

function createSkill(title, image, group, description) {
  new Skill({
    title: title,
    image: image,
    group: group,
    description: description
  }).save();
}

function joinSkill(uid, sid) {
  return Skill.findOneAndUpdate({_id: sid, relevantUsers: {$ne :uid}}, {$push: {relevantUsers: uid}}).exec();
}

function updateSkill(id, update) {
  return Skill.findByIdAndUpdate(id, update).exec();
}

function deleteSkill(id) {
  return Skill.findByIdAndDelete(id).exec();
}

function findSkills(cond, options) {
  return Skill.find(cond, null, options).exec();
}


module.exports = {
  createSkill,
  joinSkill,
  updateSkill,
  deleteSkill,
  findSkills
}