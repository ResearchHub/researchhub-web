import { ReferenceItemDrawerContextProvider } from "~/components/ReferenceManager/references/reference_item/context/ReferenceItemDrawerContext";
import HeadComponent from "~/components/Head";
import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";
import killswitch from "~/config/killswitch/killswitch";
import { connect } from "react-redux";
import LoginModal from "~/components/Login/LoginModal";
import { captureEvent } from "~/config/utils/events";

function Index(props) {
  const { isLoggedIn, authChecked } = props;
  if (!killswitch("reference-manager")) {
    return null;
  } else
    return (
      <ReferenceItemDrawerContextProvider>
        <HeadComponent title={"ResearchHub Reference Manager"}></HeadComponent>
        {isLoggedIn || !authChecked ? (
          <ReferencesContainer {...props} />
        ) : (
          <LoginModal isOpen={true} />
        )}
      </ReferenceItemDrawerContextProvider>
    );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

export default connect(mapStateToProps)(Index);
