import React from "react";
import "./styles.css";

import uuid from "uuid";

import facebookIcon from "./static/facebook.png";
import twitterIcon from "./static/twitter.png";
import linkedInIcon from "./static/linkedIn.png";
import ToggleTextArea from "./../../toggle-text-area";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      profilePic: this.props.profilePic,
      interests: this.props.interests,
      skills: this.props.skills
    });
  }

  socialLinks(social) {
    return (
      <div>
        {social.facebook.length > 0 ? (
          <a href={social.facebook} target="blank">
            <img
              src={facebookIcon}
              className="user-profile-info-card-social-links"
            />
          </a>
        ) : (
          ""
        )}
        {social.linkedIn.length > 0 ? (
          <a href={social.linkedIn} target="blank">
            <img
              src={linkedInIcon}
              className="user-profile-info-card-social-links"
            />
          </a>
        ) : (
          ""
        )}
        {social.twitter.length > 0 ? (
          <a href={social.twitter} target="blank">
            <img
              src={twitterIcon}
              className="user-profile-info-card-social-links"
            />
          </a>
        ) : (
          ""
        )}
      </div>
    );
  }

  render() {
    /* WIP */
    const {
      username,
      profilePic,
      social,
      interests,
      skills,
      userUid
    } = this.props;
    const editable = getCurrentUid() === userUid;
    return (
      <div className="user-profile-info-card">
        <img src={profilePic} className="user-profile-info-card-image" />
        <h2>Social Links</h2>
        {this.socialLinks(social)}
        {editable ? Object.entries(social).map(item => (
          <div
            className="user-profile-info-card-social-edit-container"
            key={uuid.v4()}
          >
            {" "}
            {item[0]}:{" "}
            <div className="user-profile-info-card-social-edit-field">
              <ToggleTextArea
                className="user-profile-info-card-social-edit-field-content"
                isEditable={editable}
                onEdit={text => {
                  editUser(userUid, { social: { ...social, [item[0]]: text } });
                }}
                initText={item[1]}
              />
            </div>
          </div>
        )) : ""}
        <h2>Interests</h2>
        <ToggleTextArea
          className="user-profile-info-card-interests"
          initText={interests}
          isEditable={editable}
          onEdit={text => {
            editUser(userUid, { interests: text });
          }}
        />
        <h2>Skills</h2>
        {/* ADD SKILLS HERE */}
      </div>
    );
  }
}

export default UserCard;
