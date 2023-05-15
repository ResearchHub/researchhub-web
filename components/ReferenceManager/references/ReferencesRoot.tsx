import { connect } from "react-redux";
import { Fragment, ReactElement } from "react";
import { ID } from "~/config/types/root_types";
import { ReferenceItemDrawerContextProvider } from "~/components/ReferenceManager/references/reference_item/context/ReferenceItemDrawerContext";
import { ReferenceProjectsUpsertContextProvider } from "./reference_organizer/context/ReferenceProjectsUpsertContext";
import { ReferenceUploadDrawerContextProvider } from "./reference_uploader/context/ReferenceUploadDrawerContext";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import HeadComponent from "~/components/Head";
import killswitch from "~/config/killswitch/killswitch";
import LoginModal from "~/components/Login/LoginModal";
import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";

type Props = {
  authChecked: boolean;
  isLoggedIn: boolean;
  currentUserID?: ID;
};

function ReferencesRoot({
  authChecked,
  isLoggedIn,
  currentUserID,
}: Props): ReactElement {
  const wsUrl = currentUserID ? WS_ROUTES.CITATION_ENTRY(currentUserID) : "";

  if (!killswitch("reference-manager")) {
    return <Fragment />;
  } else
    return (
      <ReferenceItemDrawerContextProvider>
        <ReferenceUploadDrawerContextProvider>
          <ReferenceProjectsUpsertContextProvider>
            <HeadComponent
              title={"ResearchHub Reference Manager"}
            ></HeadComponent>
            {isLoggedIn || !authChecked ? (
              <ReferencesContainer wsUrl={wsUrl} wsAuth />
            ) : (
              <LoginModal
                isOpen={true}
                handleClose={undefined}
                loginCallback={undefined}
                persistent={undefined}
              />
            )}
          </ReferenceProjectsUpsertContextProvider>
        </ReferenceUploadDrawerContextProvider>
      </ReferenceItemDrawerContextProvider>
    );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
  currentUserID: state.auth.user.id,
});

export default connect(mapStateToProps)(ReferencesRoot);
