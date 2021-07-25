const { Role } = require("./models/role");

function addRoleToProject(projectId, title) {
  return new Role({ title: title, projectId: projectId }).save();
}

function applyToRole(roleId, userId) {
  return Role.findOneAndUpdate(
    { _id: roleId, userId: { $eq: null }, applicants: { $ne: userId } },
    { $push: { applicants: userId } }
  );
}

function acceptRole(roleId, acceptUserId) {
  return Role.findOneAndUpdate(
    {
      _id: roleId,
      applicants: acceptUserId,
    },
    { userId: acceptUserId }
  ).exec();
}

function rejectRole(roleId, rejectUserId) {
  return Role.findOneAndUpdate(
    {
      _id: roleId,
      applicants: rejectUserId,
    },
    { $pull: { applicants: rejectUserId } }
  ).exec();
}

function deleteRole(cond) {
  return Role.findOneAndDelete(cond).exec();
}

function deleteProjectRoles(pid) {
  return Role.deleteMany({ projectId: pid }).exec();
}

function deleteUserProjectRoles(uid, pid) {
  return Role.deleteMany({ projectId: pid, userId: uid }).exec();
}

function findRoles(cond) {
  return Role.find(cond).exec();
}

module.exports = {
  addRoleToProject,
  applyToRole,
  acceptRole,
  rejectRole,
  deleteRole,
  deleteProjectRoles,
  deleteUserProjectRoles,
  findRoles,
};
