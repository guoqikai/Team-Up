import React from "react";
import "./styles.css";
import "../common-styles.css";
import { getCurrentUserInfoNonBlocking } from "../../../../api/login-api";
import { joinSkill, leaveSkill } from "../../../../api/skill-api";
import { withRouter } from "react-router-dom";

class SkillPopup extends React.Component {
  onJoinClick() {
    const joined = this.props.detail.joined;
    const user = getCurrentUserInfoNonBlocking();
    if (!user) {
      this.props.history.push("/login");
      return;
    }
    const apiCall = joined ? leaveSkill : joinSkill;
    apiCall(this.props.detail._id, (_, auth) => {
      if (!auth) this.props.history.push("/login");
      else this.props.onClick({ type: "updateData", payLoad: {joined: !joined} });
    });
  }

  render() {
    const { detail, onClick } = this.props;
    return (
      <div>
        <div className="background"></div>
        <div className="skills-popup">
          <a className="popup-close" onClick={onClick}>
            x
          </a>
          <img
            className="skills-popup-img"
            src={
              detail.image
                ? detail.image
                : require("../../../../static/project-default.jpg")
            }
            alt="Not found"
          />
          <div className="skills-popup-title">{detail.title}</div>
          <div className="skills-popup-description">{detail.description}</div>
          <button
            className={
              "button-common skills-popup-button " +
              (detail.joined ? "skills-popup-button-joined" : "")
            }
            onClick={() => this.onJoinClick()}
          >
            {detail.joined ? "Leave" : "Join"}
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(SkillPopup);
