"use strict";

const { Role } = require("./models/role");

function addRoleToProject(projectId, title) {
    return new Role({ title: title, projectId: projectId}).save();
}

function applyToRole(roleId, userId) {
    return Role.findOneAndUpdate({_id: roleId, userId: {$eq: null}, applicants: {$ne : userId}}, {$push: {applicants: userId}});
}

function updateRole(cond, update) {
    return Role.findOneAndUpdate(cond, update).exec();
}

function deleteRole(cond) {
    return Role.findOneAndDelete(cond).exec();
}

function deleteProjectRoles(pid) {
    return Role.deleteMany({projectId: pid}).exec();
}

function deleteUserProjectRoles(uid, pid) {
    return Role.deleteMany({projectId: pid, userId:uid}).exec();
}


function findRoles(cond) {
    return Role.find(cond).exec();
}

module.exports = {
    addRoleToProject,
    applyToRole,
    updateRole,
    deleteRole,
    deleteProjectRoles,
    deleteUserProjectRoles,
    findRoles
}