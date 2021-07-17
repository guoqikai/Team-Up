import React from "react";
import "./styles.css";

import {
  acceptApplication,
  rejectApplication,
  applyToRole,
  createRole,
} from "./../../../api/project-api";

import FetchWrapper from "./../../fetchWrapper";
import { Link } from "react-router-dom";
import { getUserMetaData } from "./../../../api/user-api";
import ContributorCard from "../contributor-card";

const userPicDefaultSrc = require("../../../static/user-default.png");

function mergeRoles(roles) {
  const merged = {};
  for (const role of roles) {
    if (role.userId in merged) merged[role.userId].push(role.title);
    else merged[role.userId] = [role.title];
  }
  return merged;
}

function ApplyCard({ userId, role, reload }) {
  const canApply = !role.applicants.includes(userId);
  return (
    <div className="project-application-apply-role">
      <span className={!canApply && "project-application-role-applied"}>
        {role.title}{" "}
      </span>
      {userId && (
        <button
          className={
            "project-application-button " +
            (canApply ? "button-common" : "button-common-disabled")
          }
          disabled={!canApply}
          onClick={() => {
            applyToRole(role._id, () => reload());
          }}
        >
          {canApply ? "Apply" : "Applied"}
        </button>
      )}
    </div>
  );
}

function ApplyViewCard({ data, role, reload }) {
  const { picture, username, uid } = data;
  return (
    <div className="project-application-view">
      <img
        src={picture || userPicDefaultSrc}
        alt="not foound"
        className="project-application-profile-pic"
      />
      <Link to={`/user-detail/${uid}`}>{username}</Link>{" "}
      <button
        className="button-common project-application-button "
        onClick={() =>
          acceptApplication(role.projectId, role._id, uid, () => reload())
        }
      >
        Accpet
      </button>
      <button
        className="button-common project-application-button "
        onClick={() =>
          rejectApplication(
            role.projectId,
            role._id,
            uid,
            role.applicants,
            () => reload()
          )
        }
      >
        Reject
      </button>{" "}
    </div>
  );
}

function WarppedApplyViewCard({ userId, role, reload }) {
  return (
    <FetchWrapper fetchData={(cb) => getUserMetaData(userId, cb)}>
      <ApplyViewCard role={role} reload={reload} />
    </FetchWrapper>
  );
}

class ProjectApplication extends React.Component {
  state = { newTitleName: "" };

  render() {
    const { roles, editable, projectId, userId, reload } = this.props;
    const filledRoles = mergeRoles(roles.filter((role) => role.userId));
    const openRoles = roles.filter((role) => !role.userId);
    return (
      <>
        <h2>Team Members: </h2>
        <div>
          {Object.keys(filledRoles).length == 0 ? (
            <h3>No team memebr yet.</h3>
          ) : (
            Object.keys(filledRoles).map((uid) => {
              return (
                <Link to={`/user-detail/${uid}`}>
                  <ContributorCard userId={uid} roles={filledRoles[uid]} />
                </Link>
              );
            })
          )}
        </div>
        <div>
          <h2>Roles open to apply:</h2>
          {editable && (
            <div className="project-application-add-role">
              <input
                onChange={(e) =>
                  this.setState({ newTitleName: e.target.value })
                }
                value={this.state.newTitleName}
              />
              <button
                className="button-common project-application-button "
                onClick={() => {
                  createRole(projectId, this.state.newTitleName, () => {
                    this.setState({ newTitleName: "" });
                    reload();
                  });
                }}
              >
                Add Role
              </button>
            </div>
          )}
          {openRoles.length > 0 ? (
            openRoles.map((role) => (
              <ApplyCard userId={userId} role={role} reload={reload} />
            ))
          ) : (
            <h3>All roles are filled.</h3>
          )}
        </div>
        {editable && (
          <>
            <h2>Applications:</h2>
            {openRoles.map((role) => (
              <div className="project-application-view-container">
                <h3>{role.title}:</h3>
                {role.applicants.length === 0 ? (
                  <h4>No applicant yet.</h4>
                ) : (
                  role.applicants.map((uid) => (
                    <WarppedApplyViewCard
                      userId={uid}
                      role={role}
                      reload={reload}
                    />
                  ))
                )}
              </div>
            ))}
          </>
        )}
      </>
    );
  }
}
export default ProjectApplication;
