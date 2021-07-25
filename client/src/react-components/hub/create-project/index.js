import React from "react";
import "./../../../App.css";
import "./styles.css";

import { createProject, createRole } from "./../../../api/project-api";
import { getCurrentUserInfo } from "./../../../api/login-api";
import FetchWrapper from "./../../fetchWrapper";

class CreateProject extends React.Component {
  state = {
    projectTitle: "",
    description: "",
    previewSrc: null,
    file: null,
    openPositions: [],
    createGroup: false,
  };

  execProjectCreate() {
    if (this.state.projectTitle === "")
      window.alert("Project name cannot be empty!");
    const imageFormData = new FormData();
    if (this.state.file) {
      imageFormData.append("image", this.state.file);
    }
    createProject(
      this.state.projectTitle,
      this.state.description,
      this.state.createGroup,
      imageFormData,
      (project) => {
        for (let i = 0; i < this.state.openPositions.length; i++) {
          createRole(project._id, this.state.openPositions[i], () => {});
        }
        this.props.history.push("/");
      }
    );
  }

  addNewPosition(event) {
    if (event.keyCode == 13 && event.target.value.length > 0) {
      const textContent = event.target.value;
      this.setState({
        openPositions: this.state.openPositions.concat(textContent),
      });
      event.target.value = "";
    }
  }

  render() {
    return (
      <div>
        <div className="create-project-window">
          <div className="create-project-header">
            <input
              className="create-project-name"
              placeholder="Project Name"
              onChange={(e) => this.setState({ projectTitle: e.target.value })}
            />
          </div>
          <div className="create-project-contents">
            <textarea
              placeholder="Enter you description here"
              className="create-project-description"
              onChange={(e) => this.setState({ description: e.target.value })}
            ></textarea>
          </div>
          <div className="create-project-team-image">
            <div className="create-proejct-image">
              <span>Project Image:</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  this.setState({
                    previewSrc: URL.createObjectURL(e.target.files[0]),
                    file: e.target.files[0],
                  })
                }
              />
              <div>
                <img
                  className="create-project-image-preview"
                  src={
                    this.state.previewSrc
                      ? this.state.previewSrc
                      : require("../../../static/project-default.jpg")
                  }
                />
              </div>
            </div>
            <div className="create-project-create-positions">
              <div>Open Positions:</div>
              <input
                className="create-project-input-positions"
                type="text"
                placeholder="Enter a position then press enter"
                onKeyDown={this.addNewPosition.bind(this)}
              />
              <div className="create-project-positions">
                {this.state.openPositions.map((position, ind) => (
                  <div
                    className="create-project-curr-required-positions-elements"
                    key={ind}
                  >
                    {position}
                    <span className="link-button create-proejct-delete" onClick={() => {
                      this.setState({openPositions: this.state.openPositions.filter((_, i) => i !== ind)});
                    }}>
                      delete
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <input
              type="checkbox"
              id="group"
              onChange={(e) => this.setState({ createGroup: e.target.checked })}
            ></input>
            <label for="group"> create a chat group for this project </label>
          </div>
          <button
            className="create-project-button button-common"
            onClick={this.execProjectCreate.bind(this)}
          >
            Create Project
          </button>
        </div>
      </div>
    );
  }
}

function wrappedCreateProject({}) {
  return (
    <FetchWrapper fetchData={getCurrentUserInfo} private={true}>
      <CreateProject />
    </FetchWrapper>
  );
}

export default wrappedCreateProject;
