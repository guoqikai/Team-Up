import React from "react";
import "./styles.css";
import "../common-styles.css";
import { getCurrentUserInfoNonBlocking } from "../../../../api/login-api"
import { joinSkill } from "../../../../api/skill-api"
import { withRouter } from "react-router-dom";

class ProjectPopup extends React.Component {
  onJoinClick() {
    const user = getCurrentUserInfoNonBlocking();
    if (!user)  {
      this.history.push("/login");
      return;
    }
    if (!this.props.detail.relevantUsers.includes(user._id)) joinSkill(this.props.detail._id, (noop, auth) => {
      if (!auth) this.history.push("/login");
      else window.location.reload();
    })
  }

  render() {
    const {detail, onClick} = this.props;
    const user = getCurrentUserInfoNonBlocking();
    const joined = user ? detail.relevantUsers.includes(getCurrentUserInfoNonBlocking()._id) : false;
    const joinClass = joined ? "skills-popup-button-joined" : "skills-popup-button";
    return (
      <div>
        <div className="background"></div>
        <div className="skills-popup"> 
          <a className="popup-close" onClick={onClick}>x</a>
          <img className="skills-popup-img" src={detail.image ? detail.image : require("../../../../static/project-default.jpg")} alt="Not found"/>
          <div className="skills-popup-title">{detail.title}</div>
          <div className="skills-popup-description">{detail.description}</div>
         <button className={"button-common " + joinClass} onClick={joined ? null : this.onJoinClick.bind(this)}>{joined ? "Joined" : "Join"}</button>
        </div>
      </div>
    );
  }
}

export default withRouter(ProjectPopup);
