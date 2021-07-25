"use strict";

const { Project } = require("./models/project");

function createProject(title, image, owner, group, description) {
  return new Project({
    title: title,
    image: image,
    owner: owner,
    group: group,
    description: description,
  }).save();
}

function updateProject(pid, uid, update) {
  const cond = uid
    ? update.admin || update.owner
      ? { _id: pid, owner: uid }
      : { _id: pid, $or: [{ owner: uid }, { admin: uid }] }
    : { _id: pid };
  return Project.findOneAndUpdate(cond, update).exec();
}

function deleteProject(pid, uid) {
  const cond = uid
    ? { _id: pid, $or: [{ owner: uid }, { admin: uid }] }
    : { _id: pid };
  return Project.findOneAndDelete(cond).exec();
}

function canEditProject(project, uid) {
  return project && (project.owner.equals(uid) || project.admins.includes(uid))      
}

function findProjectById(id) {
  return Project.findById(id).exec();
}

function findProjects(cond, options) {
  return Project.find(cond, null, options).exec();
}

function incrementViews(projectId) {
  return Project.findByIdAndUpdate(projectId, { $inc: { views: 1 } }).exec();
}

function incrementLikes(projectId) {
  return Project.findByIdAndUpdate(projectId, { $inc: { likes: 1 } }).exec();
}

module.exports = {
  updateProject,
  createProject,
  deleteProject,
  canEditProject,
  findProjectById,
  findProjects,
  incrementViews,
  incrementLikes,
};
