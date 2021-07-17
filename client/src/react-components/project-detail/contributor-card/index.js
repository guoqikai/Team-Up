import React from "react";
import { createPaneComponent } from "../../hub/popup-factory";
import { getUserMetaData } from "../../../api/user-api";
import FetchWrapper from "../../fetchWrapper"

class ContributorCard extends React.Component {
  render() {
    const { data, roles } = this.props;
    const userDetail = {...data, bio: `My role(s) in this project: ${roles.join("/")}. ${data.bio ? "About me: " + data.bio : ""}`}
    return createPaneComponent("People", userDetail);
  }
}


function wrappedContributionCard({ userId, roles }) {
  return (
    <FetchWrapper fetchData={(cb)=>getUserMetaData(userId, cb)} >
      <ContributorCard roles={roles} />
    </FetchWrapper>
  );
}


export default wrappedContributionCard;
