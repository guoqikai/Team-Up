import React from "react";
import "./styles.css";
import "../common-styles.css"
import TeamMember from "./../teammember";
import { withRouter, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { getCurrentUserInfoNonBlocking } from "../../../../api/login-api"
import { applyToRole , likeProject} from "../../../../api/project-api"

class ProjectPopup extends React.Component {
  state = {liked: false};

  onButtonClick(from, id) {
    if (from === "like") {
      likeProject(this.props.detail._id,  (code) => {
        if (code === 403) window.alert("You liked this project recently, please try later");
        else if (code === 401) this.props.history.push("/login");
        else {
          this.setState({liked: true});
          window.alert("Thank you for supporting this project!")
        }
      });
    }
    if (from === "apply") {
      applyToRole(id, (_, auth) => {
        if (!auth) this.props.history.push("/login");
        else window.location.reload();
      })
    }
  }


  render() {
    const {detail, onClick} = this.props;
    const likeClass = this.state.liked ? "project-popup-liked" : "project-popup-like"
    const likeFunc = this.state.liked ? null : () => this.onButtonClick("like")
    const likeText = this.state.liked ? "Liked" : "Like"
    return (
      <div>
        <div className="background"></div>
        <div className="project-popup"> 
          <a className="popup-close" onClick={onClick}>x</a>
          <div className="project-popup-title">
            {detail.title}
          </div>
          <div className="project-popup-likes-views">
            {detail.likes} likes &nbsp; | &nbsp; {detail.views} views &nbsp; | &nbsp; {Array.from(detail.roles).filter((contributor)=> !!contributor.userId).length} people are working on it
          </div>
          <div className="project-popup-team-view">
              {Array.from(detail.roles).map(role => 
                <TeamMember
                  name={role.user ? role.user.username : null}
                  icon={role.user ? role.user.picture : null}
                  key={uuid()}
                  rid = {role._id}
                  role={role.title}
                  applied = {getCurrentUserInfoNonBlocking() ? role.applicants.includes(getCurrentUserInfoNonBlocking()._id) : false}
                  onApply = {this.onButtonClick.bind(this)}
                />
              )}
            </div>
          <img
            src={detail.image ? detail.image : require("../../../../static/project-default.jpg")}
            alt="Not Found"
            className="project-popup-image"
          />
          <div className="project-popup-description">
            <p>{detail.description}</p>
          </div>
          <div className="project-popup-bottom">
              <button className={"button-common " + likeClass} onClick={likeFunc}>{likeText}</button>
            <Link to={`/project-detail/${detail._id}`}><button className="project-popup-detail button-common">View Detail {">>"}</button></Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProjectPopup);
