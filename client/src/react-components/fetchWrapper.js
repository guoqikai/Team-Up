import React from "react";
import { withRouter } from "react-router-dom";

class FetchWrapper extends React.Component {

    state = {
        data: null,
        fetchComplete: false,
        authorized: false
    };

    componentDidMount() {
        this.loadData();
    }

    onDataReady(data, authorized) {    
        this.setState({
            data: data,
            fetchComplete: true,
            authorized: authorized
        });
    }

    loadData() {
        this.props.fetchData((data, authorized) => this.onDataReady(data, authorized));
    }

    render() {
        if (this.state.fetchComplete) {
            if (!this.props.private || this.state.authorized) {
                return React.cloneElement(this.props.children, {data: this.state.data, history:this.props.history,  loadData: () => this.loadData()});
            }
            this.props.history.replace("login");
        }
        return null;
    }
}

export default withRouter(FetchWrapper);