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
      popUpInd: 0,
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
          {this.state.paneData.map((data, ind) =>
            createPaneComponent(this.state.selected, data, () =>
              this.setState({ showPopUp: true, popUpInd: ind })
            )
          )}
        </div>
        {this.state.showPopUp
          ? createPopup(
              this.state.selected,
              this.state.paneData[this.state.popUpInd],
              (action) => {
                if (!action) this.setState({ showPopUp: false });
                else if (action.type === "updateData") {
                  this.setState({
                    paneData: this.state.paneData.map((data, ind) => {
                      if (ind === this.state.popUpInd) 
                        return {...data, ...action.payLoad};
                      return data;
                    }),
                  });
                } else this.setState({ showPopUp: false });
              }
            )
          : null}
      </div>
    );
  }
}

export default PaneManager;
