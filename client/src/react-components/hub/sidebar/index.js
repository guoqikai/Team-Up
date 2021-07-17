import React from "react";
import "./styles.css";
import { getCurrentUserInfo, logoutUser } from "../../../api/login-api"
import FetchWrapper from "../../fetchWrapper"


const UNKNOWN_PIC = require("../../../static/user-default.png");

class Sidebar extends React.Component {
  login() {
    this.props.history.push("/login");
  }

  render() {
    const {data, onMenuClick} = this.props;
    const isLogin = !!data;
    const username = data && data.username ? data.username : "Visitor";
    const picture = data && data.picture ? data.picture : UNKNOWN_PIC;
    let menu = null;
    if (isLogin) {
      menu = (
        <div className="sidebar-menu">
          <div
            className="sidebar-option"
            onClick={() => onMenuClick("create-project")}
          >
            Create Project
          </div>
          <div
            className="sidebar-option"
            onClick={() => onMenuClick("my-profile")}
          >
            My Profile
          </div>
          <div
            className="sidebar-option"
            onClick={() => onMenuClick("my-projects")}
          >
            My Projects
          </div>
          <div
            className="sidebar-option"
            onClick={() => onMenuClick("messages")}
          >
            Messages
          </div>
        </div>
      );
    }
    return (
      <div className="sidebar">
        <img
          src={require("../../../logo.svg")}
          className="sidebar-logo"
          alt="Not Found"
          onClick={() => onMenuClick("")}
        />
        <img src={picture} className="sidebar-profile-pic" alt={username} />
        <div className="sidebar-profile-name">{username}</div>
        <div className="sidebar-login">
          {isLogin ? (
            <a onClick={() => logoutUser()}>Log Out</a>
          ) : (
            <a onClick={() => this.login()}>Log In / Sign Up</a>
          )}
        </div>
        {menu}
      </div>
    );
  }
}

function  wrappedSideBar({onMenuClick}) {
  return <FetchWrapper fetchData={getCurrentUserInfo}><Sidebar onMenuClick={onMenuClick}/></FetchWrapper>;
}

export default wrappedSideBar;
