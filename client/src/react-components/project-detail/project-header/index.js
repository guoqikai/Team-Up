import React from "react";
import { uploadImage } from "./../../../api/image-api";
import { editProject } from "./../../../api/project-api";
import "./styles.css";

const imageDefaultSrc = require("../../../static/project-default.jpg");

class ProjectHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editDesc: false,
      newDesc: props.projectDetail.description,
    };
  }

  render() {
    const { projectDetail, projectId, editable, setProjectDetail } = this.props;
    const { image, title, description, views, likes } = projectDetail;
    return (
      <>
        <h1 className="project-detail-header-title">{title}</h1>
        <div className="project-detail-header-info">
          {views} views, {likes} likes
        </div>
        <div className="project-detail-header-body">
          <div className="project-detail-header-image-container">
            <img
              src={image || imageDefaultSrc}
              alt="not_found"
              className="project-detail-header-image"
            />
            {editable && (
              <div>
                <label
                  for="project-pic-input"
                  className="project-detail-header-button link-button"
                >
                  change image
                </label>
                <input
                  type="file"
                  id="project-pic-input"
                  accept="image/*"
                  onChange={(e) => {
                    const imgData = new FormData();
                    imgData.set("image", e.target.files[0]);
                    uploadImage(imgData, (image) =>
                      editProject(projectId, { image }, () =>
                        setProjectDetail({ ...projectDetail, image })
                      )
                    );
                  }}
                />
              </div>
            )}
          </div>

          <div className="project-detail-header-desc-container">
            {this.state.editDesc ? (
              <>
                <textarea
                  className="project-detail-header-textarea"
                  value={this.state.newDesc}
                  rows={8}
                  onChange={(e) => this.setState({ newDesc: e.target.value })}
                />
                <div>
                  <span
                    className="link-button"
                    onClick={() =>
                      editProject(
                        projectId,
                        { description: this.state.newDesc },
                        () => {
                          setProjectDetail({...projectDetail, description: this.state.newDesc });
                          this.setState({ editDesc: false });
                        }
                      )
                    }
                  >
                    save
                  </span>
                  <span
                    className="project-detail-header-button link-button"
                    onClick={() =>
                      this.setState({ editDesc: false, newDesc: description })
                    }
                  >
                    cancel
                  </span>
                </div>
              </>
            ) : (
              <>
                {description || "This project has no description..."}{" "}
                {editable && (
                  <span
                    className="project-detail-header-button link-button"
                    onClick={() => this.setState({ editDesc: true })}
                  >
                    edit
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default ProjectHeader;
