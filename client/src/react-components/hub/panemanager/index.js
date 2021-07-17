import React from "react";
import "./styles.css";
import { createPaneComponent, createPopup } from "../popup-factory";
import { loadMataData } from "../../../api/hub-api";

class PaneManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Projects",
      paneData: [],
      showPopUp: false,
      clickDetail: null,
      currentPageNum: 0,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    const wrappedElement = document.getElementById("pane-s");
    const bottom =
      wrappedElement.getBoundingClientRect().bottom <= window.innerHeight + 200;
    if (bottom) {
      loadMataData(
        this.state.selected,
        this.state.currentPageNum + 1,
        null,
        (data) =>
          this.setState({
            paneData: this.state.paneData.concat(data),
            currentPageNum: this.state.currentPageNum + 1,
          })
      );
    }
  }

  componentDidMount() {
    loadMataData("Projects", this.state.currentPageNum, null, (data) =>
      this.setState({ paneData: data })
    );
    document.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleScroll);
  }

  openPopup(detail) {
    this.setState({ showPopUp: true, clickDetail: detail });
  }

  closePopup() {
    this.setState({ showPopUp: false });
  }

  toggleSelectedPane(event) {
    const page = event.target.textContent;
    this.setState({ selected: page, paneData: [] });
    loadMataData(page, 0, null, (data) => this.setState({ paneData: data }));
  }

  handleSearch(event) {
    const search = event.target.value;
    if (event.key === "Enter" && search.length !== 0) {
      loadMataData(this.state.selected, 0, search, (data) =>
        this.setState({ paneData: data })
      );
    }
  }

  render() {
    return (
      <div className="windows">
        <div>
          <ul>
            <li>
              <a
                className={
                  this.state.selected === "Projects" ? "link-selected" : "link"
                }
                onClick={this.toggleSelectedPane.bind(this)}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                className={
                  this.state.selected === "People" ? "link-selected" : "link"
                }
                onClick={this.toggleSelectedPane.bind(this)}
              >
                People
              </a>
            </li>
            <li>
              <a
                className={
                  this.state.selected === "Skills" ? "link-selected" : "link"
                }
                onClick={this.toggleSelectedPane.bind(this)}
              >
                Skills
              </a>
            </li>
          </ul>
          <input
            type="text"
            placeholder="Search.."
            className="search"
            onKeyDown={this.handleSearch.bind(this)}
          />
        </div>
        <div className={"pane-" + this.state.selected} id="pane-s">
          {this.state.paneData.map((data) =>
            createPaneComponent(
              this.state.selected,
              data,
              this.openPopup.bind(this)
            )
          )}
        </div>
        {this.state.showPopUp
          ? createPopup(this.state.selected, this.state.clickDetail, () =>
              this.closePopup()
            )
          : null}
      </div>
    );
  }
}

export default PaneManager;
