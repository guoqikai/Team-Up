import React from "react";

import { Route, Switch, BrowserRouter } from "react-router-dom";

import "./App.css";
import Login from "./react-components/login";
import Hub from "./react-components/hub";
import ProjectDetail from "./react-components/project-detail";
import UserDetail from "./react-components/user-detail";

const TITLE = 'TeamUp'

class App extends React.Component {
  componentDidMount(){
    document.title = TITLE
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route path="/project-detail/:pUid?" component={ProjectDetail}/>
            <Route path="/user-detail/:userUid?" component={UserDetail}/>
            <Route path="/:page?" component={Hub} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
