import React from "react";
import "./styles.css";

class ProjectsPaneComponent extends React.Component {
  render() {
    const { detail, onClick } = this.props;
    return (
      <div>
        <div className="project-panecomponent" onClick={() => onClick(detail)}>
          <img
            src={
              detail.image
                ? detail.image
                : require("../../../../static/project-default.jpg")
            }
            alt="Not found."
            className="project-pane-image"
          />
          <div id="project-pane-title">{detail.title}</div>
          <div id="project-pane-like-views">
            {detail.likes} likes &nbsp; | &nbsp; {detail.views} views
          </div>
          <div id="project-pane-opening">
            opening: &nbsp;{" "}
            {detail.roles ? detail.roles.filter((r) => !r.userId).length : 0}
          </div>
          <div id="project-pane-description">{detail.description}</div>
        </div>
      </div>
    );
  }
}

export default ProjectsPaneComponent;
