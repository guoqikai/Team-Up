import React from "react";
import "./../../../App.css";
import "./styles.css";
import uuid from "uuid";

import { createProject, createRole } from "./../../../api/project-api";
import { getCurrentUserInfo } from "./../../../api/login-api";
import FetchWrapper from "./../../fetchWrapper"

class CreateProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectTitle: "",
      description: "",
      previewSrc: null,
      file: null,
      openPositions: [],
      createGroup: false
    };
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
  }

  execProjectCreate() {
    if (this.state.projectTitle === "") window.alert("Project name cannot be empty!")
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
          createRole(project._id, this.state.openPositions[i], () => { });
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

  handleNameChange(e) {
    e.preventDefault();
    this.setState({ projectTitle: e.target.value });
  }

  handleDescChange(e) {
    e.preventDefault();
    this.setState({ description: e.target.value });
  }

  handleCreateGroup(e) {
    this.setState({ createGroup: e.target.checked});
  }

  handleImgChange(e) {
    e.preventDefault();
    this.setState({
      previewSrc: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
  }

  render() {

    return (
      <div>
        <div className="create-project-window">
          <div className="create-project-header">
            <input
              className="create-project-name"
              placeholder="Project Name"
              onChange={this.handleNameChange}
            />
          </div>
          <div className="create-project-contents">
            <textarea
              placeholder="Enter you description here"
              className="create-project-description"
              onChange={this.handleDescChange}
            ></textarea>
          </div>
          <div className="create-project-team-image">
            <div className="create-proejct-image">
            <span>project image:</span>
            <input type="file" accept="image/*" onChange={this.handleImgChange} />
              <div>
                <img
                  className="create-project-image-preview"
                  src={this.state.previewSrc ? this.state.previewSrc : require("../../../static/project-default.jpg")}
                />
              </div>
            </div>
            <div className="create-project-create-positions">
              <div>Open Positions</div>
              <input
                className="create-project-input-positions"
                type="text"
                placeholder="Enter a required position then press enter"
                onKeyDown={this.addNewPosition.bind(this)}
              />
              <div className="create-project-positions">
              {this.state.openPositions.map((position) => (
                <div className="create-project-curr-required-positions-elements"
                key={uuid.v4()}>
                  {position}
                </div>
              ))}
              </div>
            </div>
          </div>
          <div>
            <input type="checkbox" id="group" onChange={this.handleCreateGroup.bind(this)}></input>
            <label for="group"> create chat group for this project </label>
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

function  wrappedCreateProject({}) {
  return <FetchWrapper fetchData={getCurrentUserInfo} private={true}><CreateProject/></FetchWrapper>;
}


export default wrappedCreateProject;
