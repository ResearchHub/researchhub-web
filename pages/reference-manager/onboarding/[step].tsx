import { connect } from "react-redux";
import { useRouter } from "next/router";

import killswitch from "~/config/killswitch/killswitch";
import Welcome from "~/components/ReferenceManager/onboarding/Welcome";
import { StyleSheet, css } from "aphrodite";
import LoginModal from "~/components/Login/LoginModal";
import Organization from "~/components/ReferenceManager/onboarding/Organization";
import Teammates from "~/components/ReferenceManager/onboarding/Teammates";
import { useState } from "react";
import ImportReferences from "~/components/ReferenceManager/onboarding/ImportReferences";

function Index(props) {
  const { isLoggedIn, authChecked, user } = props;
  const [createdOrg, setCreatedOrg] = useState({});
  const router = useRouter();

  const screen = () => {
    switch (router.query.step) {
      case "welcome":
        return <Welcome />;
      case "lab":
        return <Organization setCreatedOrg={setCreatedOrg} />;
      case "teammates":
        return <Teammates createdOrg={createdOrg} />;
      case "import":
        return <ImportReferences />;
      case "scholar":
        return null;
      default:
        return null;
    }
  };

  const goToNextStep = () => {
    let stepUrl = "";
    switch (router.query.step) {
      case "welcome":
        stepUrl = "/reference-manager/onboarding/lab";
        break;
      case "lab":
        stepUrl = "/reference-manager/onboarding/teammates";
        break;
      case "teammates":
        stepUrl = "/reference-manager/onboarding/import";
        break;
      case "import":
        stepUrl = "/reference-manager";
        break;
      case "scholar":
        return null;
      default:
        return null;
    }

    router.push(stepUrl);
  };

  if (!killswitch("reference-manager")) {
    return null;
  } else
    return (
      <>
        {isLoggedIn || !authChecked ? (
          <div className={css(styles.onboardingContainer)}>
            <div className={css(styles.innerContainer)}>
              {screen()}
              <div className={css(styles.skip)} onClick={goToNextStep}>
                Skip
              </div>
            </div>
          </div>
        ) : (
          <LoginModal
            isOpen={true}
            handleClose={undefined}
            loginCallback={undefined}
          />
        )}
      </>
    );
}

const styles = StyleSheet.create({
  onboardingContainer: {
    position: "absolute",
    top: 0,
    zIndex: 5,
    background: colors.WHITE(),
    width: "calc(100% - 80px)",
    minHeight: "100%",
    textAlign: "center",
    padding: 45,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    overflow: "auto",

    "@media only screen and (max-width: 577px)": {
      width: "100%",
    },
  },
  innerContainer: {
    maxWidth: 700,
    margin: "0 auto",
  },
  skip: {
    width: "100%",
    padding: 16,
    boxSizing: "border-box",
    marginTop: 16,
    cursor: "pointer",
    color: "#7C7989",
    fontWeight: 500,
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Index);
