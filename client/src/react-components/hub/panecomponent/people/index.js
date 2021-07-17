import React from "react";
import "./styles.css";

class PeoplePaneComponent extends React.Component {

  render() {
    const { detail, onClick } = this.props;
    return (
      <div className="people-panecomponent" onClick={() => onClick(detail)}>
        <img
          src={detail.picture ? detail.picture : require('../../../../static/user-default.png')}
          alt="Not Found"
          className="people-pane-image"
        />
        <div id="people-pane-title">{detail.username}</div>
        <div id="people-pane-description">{detail.bio}</div>
      </div>
    );
  }
}

export default PeoplePaneComponent;
