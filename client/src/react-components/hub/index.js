import React from "react";
import "./styles.css";
import Sidebar from "./sidebar";
import PaneManager from "./panemanager";
import Chat from "./chat";
import MyProjects from "./my-projects";
import UserProfile from "./user-profile";
import CreateProject from "./create-project";

class Hub extends React.Component {
  state = { showMessages:false };

  getComponent(page) {
    switch (page) {
      case "my-projects":
        return <MyProjects />;
      case "my-profile":
        return <UserProfile />;
      case "create-project":
        return <CreateProject />;
      default:
        return <PaneManager />;
    }
  }

  handleSideBarMenuClicked(e) {
    if (e === "messages") {
      this.setState({ showMessages: true });
    }
    else {
      this.props.history.push(e);
    }
  }

  closeMessages() {
    this.setState({ showMessages: false });
  }

  render() {
    const page = this.props.match.params.page;
    return (
      <div className="hub">
        <Sidebar
          onMenuClick={e => this.handleSideBarMenuClicked(e)}
        />
        {this.getComponent(page)}
        {this.state.showMessages ? (
          <Chat onCloseClick={() => this.closeMessages()} />
        ) : null}
      </div>
    );
  }
}

export default Hub;
