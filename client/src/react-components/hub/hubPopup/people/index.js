import React from "react";
import "./styles.css";
import "../common-styles.css";
import { addUsertoChat } from "../../../../api/message-api"
import { Link } from "react-router-dom"

class ProjectPopup extends React.Component {
  render() {
    const {detail, onClick} = this.props;
    return (
      <div>
        <div className="background"></div>
        <div className="people-popup"> 
          <a className="popup-close" onClick={onClick}>x</a>
          <img className="people-popup-img" src={detail.picture ? detail.picture : require("../../../../static/user-default.png")} alt="Not found"/>
          <div className="people-popup-name">{detail.username}</div>
          <div className="people-popup-bio">{detail.bio}</div>
          <button className="button-common people-popup-button" onClick={() => {addUsertoChat(detail._id, detail.username); onClick()}}>Add to Chat List</button>
          <Link to={`/user-detail/${detail._id}`}><button className="button-common people-popup-button">View Profile</button></Link>
        </div>
      </div>
    );
  }
}

export default ProjectPopup;
