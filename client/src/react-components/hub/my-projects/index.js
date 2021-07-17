import React from "react";
import "./styles.css";
import FetchWrapper from "../../fetchWrapper"
import { getCurrentUserProjectInfo, exitProject, deleteProject } from "../../../api/user-project-api"
import { createPaneComponent} from "../popup-factory";

class MyProjects extends React.Component {
  handleClick(e, data, refresh) {
    if (e === "exit") {
      exitProject(data._id, refresh);
    }
    if (e === "delete") {
      deleteProject(data._id, refresh);
    }
    if (e === "title") {
      this.props.history.push("/project-detail/" + data._id);
    }
  }

  render() {
    const { data, loadData } = this.props;
    return (
      <div className="my-projects-pane">
        <div className="my-projects-pane-container">
          {data.length ? data.map(p => {
            return createPaneComponent("ProjectBrief", p, (e)=>this.handleClick(e, p, loadData)); 
          }): <span><h1 className="my-projects-no-project my-projects-oops">Oops..</h1> <h2 className="my-projects-no-project">&emsp;&emsp;&emsp;You are not in any project</h2></span>}
        </div>
      </div>
    );
  }
}

function  wrappedMyProjects() {
  return <FetchWrapper fetchData={getCurrentUserProjectInfo} private={true} ><MyProjects/></FetchWrapper>;
}

export default wrappedMyProjects;
