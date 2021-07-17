import React from "react";
import "./styles.css";

class TeamMember extends React.Component {
  render() {
    let { name, icon, role, rid, applied, onApply} = this.props;
    let content = <h4 className="teammember-name">{name}&nbsp;:&nbsp;{role}</h4>;
    if (!icon) {
      icon = require("../../../../static/user-default.png");
    }
    if (!name) {
      const buttonText = applied ? "Applied" : "Apply";
      const className = applied ? "teammember-applied" : "teammember-apply";
      const onClick = applied ? null : () => onApply("apply", rid)
    content = <h4 className="teammember-name-gray">{role} <button className={"button-common " + className} onClick={onClick}>{buttonText}</button></h4>
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
