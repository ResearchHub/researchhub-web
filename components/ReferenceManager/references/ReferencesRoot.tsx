import { Fragment, ReactElement } from "react";
import { ReferenceItemDrawerContextProvider } from "~/components/ReferenceManager/references/reference_item/context/ReferenceItemDrawerContext";
import { ReferenceUploadDrawerContextProvider } from "./reference_uploader/context/ReferenceUploadDrawerContext";
import HeadComponent from "~/components/Head";
import killswitch from "~/config/killswitch/killswitch";
import LoginModal from "~/components/Login/LoginModal";
import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";

type Props = {
  authChecked: boolean;
  isLoggedIn: boolean;
};

export default function ReferencesRoot({
  authChecked,
  isLoggedIn,
}: Props): ReactElement {
  if (!killswitch("reference-manager")) {
    return <Fragment />;
  } else
    return (
      <ReferenceItemDrawerContextProvider>
        <ReferenceUploadDrawerContextProvider>
          <HeadComponent
            title={"ResearchHub Reference Manager"}
          ></HeadComponent>
          {isLoggedIn || !authChecked ? (
            <ReferencesContainer />
          ) : (
            <LoginModal
              isOpen={true}
              handleClose={undefined}
              loginCallback={undefined}
            />
          )}
        </ReferenceUploadDrawerContextProvider>
      </ReferenceItemDrawerContextProvider>
    );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});
