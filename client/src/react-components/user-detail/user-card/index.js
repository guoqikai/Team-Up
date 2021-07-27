import React from "react";
import "./styles.css";

import facebookIcon from "./static/facebook.png";
import twitterIcon from "./static/twitter.png";
import linkedInIcon from "./static/linkedIn.png";
import unknown from "./static/unknown.png";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
  }

  socialLinks(social) {
    return (
      <div>
        {social.facebook && social.facebook.length > 0 ? (
          <a href={`//${social.facebook}`} target="blank">
            <img
              src={facebookIcon}
              className="user-profile-info-card-social-links"
            />
          </a>
        ) : (
          ""
        )}
        {social.linkedIn && social.linkedIn.length > 0 ? (
          <a href={`//${social.linkedIn}`} target="blank">
            <img
              src={linkedInIcon}
              className="user-profile-info-card-social-links"
            />
          </a>
        ) : (
          ""
        )}
        {social.twitter && social.twitter.length > 0 ? (
          <a href={`//${social.twitter}`} target="blank">
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
    const {
      username,
      profilePic,
      social,
      interests,
      email
    } = this.props;
    return (
      <div className="user-profile-info-card">
        <img
          src={profilePic ? profilePic : unknown}
          className="user-profile-info-card-image"
        />
        <h2>{username}</h2>
        <div>{email}</div>
        {this.socialLinks(social)}
      </div>
    );
  }
}

export default UserCard;
