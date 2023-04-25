import { connect } from "react-redux";
import { useRouter } from "next/router";

import killswitch from "~/config/killswitch/killswitch";
import Welcome from "~/components/ReferenceManager/onboarding/Welcome";
import { StyleSheet, css } from "aphrodite";
import LoginModal from "~/components/Login/LoginModal";
import Organization from "~/components/ReferenceManager/onboarding/Organization";
import Teammates from "~/components/ReferenceManager/onboarding/Teammates";

function Index(props) {
  const { isLoggedIn, authChecked, user } = props;
  const router = useRouter();

  const screen = () => {
    switch (router.query.step) {
      case "welcome":
        return <Welcome />;
      case "lab":
        return <Organization />;
      case "teammates":
        return <Teammates />;
      case "import":
        return null;
      case "scholar":
        return null;
      default:
        return null;
    }
  };

  if (!killswitch("reference-manager")) {
    return null;
  } else
    return (
      <>
        {isLoggedIn || !authChecked ? (
          <div className={css(styles.onboardingContainer)}>{screen()}</div>
        ) : (
          <LoginModal isOpen={true} />
        )}
      </>
    );
}

const styles = StyleSheet.create({
  onboardingContainer: {
    position: "absolute",
    top: 0,
    zIndex: 5,
    background: "#fff",
    width: "calc(100% - 80px)",
    height: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Index);
