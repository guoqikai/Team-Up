import React from "react";
import "./styles.css";
import UserCard from "./user-card";
import { createPaneComponent } from "../hub/popup-factory";
import { Link } from "react-router-dom";

import { getUser } from "./../../api/user-api";

import {
  getProjectsUnderUser,
  getRoles,
} from "./../../api/project-api";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: null,
        username: null,
        facebook: "",
        linkedIn: "",
        twitter: "",
        picture: null,
        bio: ""
      },
      userProjects: [],
      editable: false,
    };
  }

  componentDidMount() {
    this.getDetails();
  }

  getDetails() {
    const userUid = this.props.match.params.userUid;
    getUser(userUid, (user) => {
      getProjectsUnderUser(userUid, (projects) => {
        let userProjects = Object.values(projects);
        if (userProjects.length === 0) {
          this.setState({user, userProjects: []});
          return;
        }
        for (let i = 0; i < userProjects.length; i++) {
          getRoles(userProjects[i]._id, (roles) => {
            this.setState((state, props) => {
              let augmented = userProjects;
              augmented[i]["roles"] = roles;
              return {
                user: { ...state.user, ...user },
                userProjects: augmented
              };
            });
          });
        }
      });
    });
  }

  render() {

    return (
      <div className="user-profile-pane">
        <UserCard
          username={this.state.user.username}
          profilePic={this.state.user.picture}
          email={this.state.user.email}
          social={{
            facebook: this.state.user.facebook,
            linkedIn: this.state.user.linkedIn,
            twitter: this.state.user.twitter,
          }}
        />
        <div className="user-profile-info-bio">
          <h2> About Me </h2>
          <div className="user-profile-bio-text-area">
            {this.state.user.bio}
          </div>
        </div>
        <div className="user-profile-projects">
          <h2>Projects That I've Worked On:</h2>
          {this.state.userProjects.map((project) => (
            <Link to={`/project-detail/${project._id}`}>
              {createPaneComponent("Projects", project, (e) => {})}
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

export default UserDetail;
