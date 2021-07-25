import React from "react";
import "./styles.css";

import FetchWrapper from "../../fetchWrapper";
import { getCurrentUserInfo } from "../../../api/login-api";
import { updateCurrentUser } from "../../../api/user-api";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.data;
    this.state = {
      picture: data.picture,
      username: data.username,
      email: data.email,
      bio: data.bio,
      interests: data.interests,
      facebook: data.facebook,
      linkedIn: data.linkedIn,
      twitter: data.twitter,
      pictureData: new FormData(),
    };
  }

  handleTextFieldChange(field, event) {
    this.setState({ [field]: event.target.value });
  }

  handlePicChange(event) {
    this.state.pictureData.set("image", event.target.files[0]);
    this.setState({ picture: URL.createObjectURL(event.target.files[0]) });
  }

  sendUpdate() {
    updateCurrentUser(this.state, (result, auth) => {
      if (!result) window.location.reload();
      else window.alert(result);
    });
  }

  render() {
    return (
      <div className="user-profile-pane">
        <div>
          <img
            src={
              this.state.picture
                ? this.state.picture
                : require("../../../static/user-default.png")
            }
            className="user-profile-pic"
            alt={this.state.username}
          />
          <div>
            <label
              for="user-profile-pic-input"
              className="user-profile-pic-button link-button"
            >
              change picture
            </label>
            <input
              type="file"
              id="user-profile-pic-input"
              onChange={(e) => this.handlePicChange(e)}
              accept="image/*"
            />
          </div>
        </div>
        <div className="user-profile-input-div">
          <span>email:</span>
          <input
            className="user-profile-text-input"
            value={this.state.email}
            disabled={true}
          />
        </div>
        <div className="user-profile-input-div">
          <span>username:</span>
          <input
            className="user-profile-text-input"
            value={this.state.username}
            disabled={true}
          />
        </div>
        <div className="user-profile-input-div">
          <span>password:</span>
          <input
            className="user-profile-text-input"
            placeholder="**********"
            type="password"
            onChange={(e) => this.handleTextFieldChange("password", e)}
          />
        </div>
        <div className="user-profile-input-div">
          <span>facebook:</span>
          <input
            className="user-profile-text-input"
            value={this.state.facebook}
            onChange={(e) => this.handleTextFieldChange("facebook", e)}
          />
        </div>
        <div className="user-profile-input-div">
          <span>linkedIn:</span>
          <input
            className="user-profile-text-input"
            value={this.state.linkedIn}
            onChange={(e) => this.handleTextFieldChange("linkedIn", e)}
          />
        </div>
        <div className="user-profile-input-div">
          <span>twitter:</span>
          <input
            className="user-profile-text-input"
            value={this.state.twitter}
            onChange={(e) => this.handleTextFieldChange("twitter", e)}
          />
        </div>
        <div className="user-profile-input-div">
          <span>about me:</span>
          <textarea
            className="user-profile-text-area"
            value={this.state.bio}
            onChange={(e) => this.handleTextFieldChange("bio", e)}
          />
        </div>
        <div>
          <button
            className="button-common user-profile-send-button"
            onClick={() => this.sendUpdate()}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

function wrappedUserProfile({}) {
  return (
    <FetchWrapper fetchData={getCurrentUserInfo} private={true}>
      <UserProfile />
    </FetchWrapper>
  );
}

export default wrappedUserProfile;
