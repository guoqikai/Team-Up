import React from "react";
import "./styles.css";

class TeamMember extends React.Component {
  render() {
    let { name, icon, role, rid, applied, onApply } = this.props;
    let content = (
      <h4 className="teammember-name">
        {name}&nbsp;:&nbsp;{role}
      </h4>
    );
    if (!icon) {
      icon = require("../../../../static/user-default.png");
    }
    if (!name) {
      const onClick = applied ? null : () => onApply("apply", rid);
      content = (
        <h4 className="teammember-name-gray">
          {role}{" "}
          <button
            className={
              "teammember-apply " +
              (applied ? "button-common-disabled" : "button-common")
            }
            onClick={onClick}
          >
            {applied ? "Applied" : "Apply"}
          </button>
        </h4>
      );
    }
    return (
      <div>
        <img src={icon} alt="Not Found" className="teammember-profile-image" />
        {content}
      </div>
    );
  }
}

export default TeamMember;
