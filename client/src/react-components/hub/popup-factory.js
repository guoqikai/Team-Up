import React from "react";
import ProjectPopup from "./hubPopup/projects";
import PeoplePopup from "./hubPopup/people";
import SkillsPopup from "./hubPopup/skills";
import ProjectsPaneComponent from "./panecomponent/projects";
import ProjectBrief from "./panecomponent/project-brief";
import PeoplePaneComponent from "./panecomponent/people";
import SkillsPaneComponent from "./panecomponent/skills";

function createPopup(type, detail, onClick) {
  if (type === "Projects") {
    return <ProjectPopup detail={detail} onClick={onClick} />;
  }
  if (type === "People") {
    return <PeoplePopup detail={detail} onClick={onClick} />;
  }
  if (type === "Skills") {
    return <SkillsPopup detail={detail} onClick={onClick} />;
  }
}

function createPaneComponent(type, dataModel, onClick) {
  if (type === "Projects") {
    return (
      <ProjectsPaneComponent
        key={dataModel._id}
        detail={dataModel}
        onClick={onClick}
      />
    );
  }
  if (type === "ProjectBrief") {
    return (
      <ProjectBrief key={dataModel._id} detail={dataModel} onClick={onClick} />
    );
  }
  if (type === "People") {
    return (
      <PeoplePaneComponent
        key={dataModel._id}
        detail={dataModel}
        onClick={onClick}
      />
    );
  }
  if (type === "Skills") {
    return (
      <SkillsPaneComponent
        key={dataModel._id}
        detail={dataModel}
        onClick={onClick}
      />
    );
  }
}

export { createPaneComponent, createPopup };
