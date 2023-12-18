import { connect } from "react-redux";
import { Fragment, ReactElement } from "react";
import { ID } from "~/config/types/root_types";
import { ReferenceItemDrawerContextProvider } from "~/components/ReferenceManager/references/reference_item/context/ReferenceItemDrawerContext";
import { ReferenceProjectsUpsertContextProvider } from "./reference_organizer/context/ReferenceProjectsUpsertContext";
import { ReferencesTableContextProvider } from "./reference_table/context/ReferencesTableContext";
import { ReferenceUploadDrawerContextProvider } from "./reference_uploader/context/ReferenceUploadDrawerContext";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import HeadComponent from "~/components/Head";
import killswitch from "~/config/killswitch/killswitch";
import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";
import { ReferenceActiveProjectContextProvider } from "./reference_organizer/context/ReferenceActiveProjectContext";
import { useRouter } from "next/router";
import ReferenceManagerIntroModal from "../lib/ReferenceManagerIntroModal";

type Props = {
  authChecked?: boolean;
  currentUserID?: ID;
  isLoggedIn: boolean;
  calloutOpen?: boolean;
};

function ReferencesRoot({
  authChecked,
  currentUserID,
  isLoggedIn,
  calloutOpen,
}: Props): ReactElement {
  const router = useRouter();
  const wsUrl = currentUserID ? WS_ROUTES.CITATION_ENTRY(currentUserID) : "";

  if (!isLoggedIn && authChecked) {
    // /login?redirect=/reference-manager
    router.push("/login?redirect=/reference-manager");
  }

  if (!killswitch("reference-manager")) {
    return <Fragment />;
  } else
    return (
      <ReferenceItemDrawerContextProvider>
        <ReferenceUploadDrawerContextProvider>
          <ReferenceActiveProjectContextProvider>
            <ReferenceProjectsUpsertContextProvider>
              <ReferencesTableContextProvider>
                <HeadComponent
                  title={"ResearchHub Reference Manager"}
                ></HeadComponent>
                {isLoggedIn || !authChecked ? (
                  // @ts-ignore - faulty legacy connect hook
                  <>
                    <ReferenceManagerIntroModal />
                    <ReferencesContainer
                      wsUrl={wsUrl}
                      wsAuth
                      calloutOpen={calloutOpen}
                    />
                  </>
                ) : null}
              </ReferencesTableContextProvider>
            </ReferenceProjectsUpsertContextProvider>
          </ReferenceActiveProjectContextProvider>
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
