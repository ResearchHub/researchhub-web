import { ReferenceItemDrawerContextProvider } from "~/components/ReferenceManager/references/reference_item/context/ReferenceItemDrawerContext";
import HeadComponent from "~/components/Head";
import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";
import killswitch from "~/config/killswitch/killswitch";
import LoginModal from "~/components/Login/LoginModal";

type Props = {
  authChecked: boolean;
  isLoggedIn: boolean;
};

export default function ReferencesRoot({ authChecked, isLoggedIn }: Props) {
  if (!killswitch("reference-manager")) {
    return null;
  } else
    return (
      <ReferenceItemDrawerContextProvider>
        <HeadComponent title={"ResearchHub Reference Manager"}></HeadComponent>
        {isLoggedIn || !authChecked ? (
          <ReferencesContainer />
        ) : (
          <LoginModal
            isOpen={true}
            handleClose={undefined}
            loginCallback={undefined}
          />
        )}
      </ReferenceItemDrawerContextProvider>
    );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});
