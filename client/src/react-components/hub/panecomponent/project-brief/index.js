import React from "react";
import "./styles.css";

class ProjectBrief extends React.Component {
  render() {
    const {
      detail,
      onClick
    } = this.props;

    let deleteButton = <button className="project-brief-button button-common" onClick={() => {
      if (window.confirm("Are you sure you want to exit the project?")) onClick("exit")
    }}>Exit</button>;
    if (detail.role === "Owner") {
      deleteButton = <button className="project-brief-button button-common" onClick={() => {
        if (window.confirm("Are you sure you want to delete the project?")) onClick("delete")
      }}>Delete</button>
    }
    return (
      <div>
        <div className="project-brief">
          <img src={detail.image ? detail.image : require("../../../../static/project-default.jpg")} alt="Not found." className="project-brief-image" />
          <div className="project-brief-title" onClick = {() => onClick("title")}>{detail.title}</div>
          <div className="project-brief-status">{detail.role}</div>
          {deleteButton}
        </div>
      </div>
    );
  }
}

export default ProjectBrief;
