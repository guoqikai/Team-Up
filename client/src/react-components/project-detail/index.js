import React from "react";
import "./styles.css";
import ProjectHeader from "./project-header";

import { canEdit, getProjectDetail, getRoles } from "./../../api/project-api";
import { getCurrentUserInfo } from "./../../api/login-api";
import ProjectApplication from "./project-application";

class ProjectDetail extends React.Component {
  state = {
    editable: false,
  };

  loadRoles() {
    getRoles(this.props.match.params.pUid, (res) => {
      this.setState({ roles: res });
    });
  }

  componentDidMount() {
    getProjectDetail(this.props.match.params.pUid, (projectDetail) =>
      this.setState({ projectDetail })
    );
    this.loadRoles();

    getCurrentUserInfo((userInfo, isLoggedIn) => {
      if (!isLoggedIn) this.setState({ editable: false });
      else {
        this.setState({ userId: userInfo._id });
        canEdit(this.props.match.params.pUid, (can) => {
          this.setState({ editable: can });
        });
      }
    });
  }

  render() {
    const projectId = this.props.match.params.pUid;
    if (this.state.projectDetail === null) return <h1>404 not found.</h1>;
    if (!this.state.projectDetail || !this.state.roles)
      return <h1>Loading...</h1>;
    return (
      <div className="project-detail-pane">
        <ProjectHeader
          projectDetail={this.state.projectDetail}
          projectId={projectId}
          editable={this.state.editable}
          setProjectDetail={(projectDetail) => this.setState({ projectDetail })}
        />
        <ProjectApplication
          editable={this.state.editable}
          roles={this.state.roles}
          userId={this.state.userId}
          reload={this.loadRoles.bind(this)}
          projectId={projectId}
        />
      </div>
    );
  }
}
export default ProjectDetail;
