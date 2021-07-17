import React from "react";
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
    const { imageSrc, title, description, views, likes } = projectDetail;
    return (
      <>
        <h1 className="project-detail-header-title">{title}</h1>{" "}
        <div className="project-detail-header-info">
          {views} views, {likes} likes
        </div>
        <div className="project-detail-header-body">
          <div className="project-detail-header-image-container">
            <img
              src={imageSrc || imageDefaultSrc}
              alt="not_found"
              className="project-detail-header-image"
            />{" "}
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
                    className="project-detail-header-button"
                    onClick={() =>
                      editProject(
                        projectId,
                        { description: this.state.newDesc },
                        (newDetail) => {
                          this.setState({ editDesc: false });
                          setProjectDetail(newDetail);
                        }
                      )
                    }
                  >
                    save
                  </span>
                  <span
                    className="project-detail-header-button"
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
                    className="project-detail-header-button"
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
