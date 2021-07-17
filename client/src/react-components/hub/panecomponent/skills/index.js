import React from "react";
import "./styles.css";

class SkillsPaneComponent extends React.Component {
  render() {
    const { detail, onClick } = this.props;
    return (
      <div className="skills-panecomponent" onClick={() => onClick(detail)}>
        <img src={detail.image ? detail.image : require("../../../../static/project-default.jpg")} alt="Not found." className="skills-pane-image" />
        <div id="skills-pane-title">{detail.title}</div>
        <div id="skills-pane-description">{detail.description}</div>
      </div>
    );
  }
}

export default SkillsPaneComponent;
