import { useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Router from "next/router";

import OnboardForm from "~/components/Onboard/OnboardForm";
import Head from "~/components/Head";

import { HubActions } from "~/redux/hub";

// Config

import colors from "~/config/themes/colors";
import ComponentWrapper from "../../../../components/ComponentWrapper";
import { MessageActions } from "../../../../redux/message";
import Button from "~/components/Form/Button";
import { setCompletedOnboardingApi } from "~/components/Onboard/api/setCompletedOnboardingApi";
import { breakpoints } from "~/config/themes/screen";

const Index = (props) => {
  // onboard flow
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.scrollTo({
      behavior: "auto",
      top: 0,
    });
  }, [page]);

  useEffect(() => {
    // Cleanup function to be called when component unmounts
    return () => {
      // If user leaves the page without completing onboarding,
      // we assume they're "skipping"
      handleSetCompletedOnboarding();
    };
  }, []);

  let formRef = useRef();

  const formatStep = () => {
    switch (page) {
      case 1:
        return "Complete your profile";
      default:
        return;
    }
  };

  const saveUserInformation = () => {
    setSaving(true);
    const saveButton = formRef.current;
    saveButton.click();
    handleSetCompletedOnboarding();
  };

  const handleSetCompletedOnboarding = () => {
    setCompletedOnboardingApi()
      .then((res) => {
        Router.push("/", "/").then(() => {
          setSaving(false);
        });
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return <OnboardForm submitRef={formRef} />;
      default:
        return;
    }
  };

  return (
    <div className={css(styles.root)}>
      <Head
        title={"Complete your profile"}
        description={"Welcome to ResearchHub!"}
      />
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
        <div className={css(styles.titleContainer)}>
          <h1 className={css(styles.title)}>{formatStep()}</h1>
          <p className={css(styles.subtitle)}>
            ResearchHub is a social platform, setting up your profile ensures
            others can recognize you and your work.
          </p>
        </div>
        <div className={css(styles.pageContainer)}>
          <div className={css(styles.pageContent)}>{renderPage()}</div>
        </div>
        <div className={css(styles.buttonRowContainer)}>
          <Button
            variant="text"
            label="Skip"
            customButtonStyle={styles.skipButtonStyle}
            onClick={handleSetCompletedOnboarding}
          />
          <Button
            label="Save & Finish"
            disabled={saving}
            onClick={saveUserInformation}
          />
        </div>
      </ComponentWrapper>
    </div>
  );
};

Index.getInitialProps = async ({ query }) => {
  const { authorId } = query;

  return { authorId };
};

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  root: {
    backgroundColor: "#FCFCFC",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    scrollBehavior: "smooth",
    position: "relative",
    minHeight: "100vh",
  },
  title: {
    padding: 0,
    margin: 0,
    fontWeight: 500,
    fontSize: 28,
    color: "#232038",
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 400,
    maxWidth: 500,
    color: "#6f6c7d",
    padding: 0,
    margin: 0,
    marginTop: 10,
    "@media only screen and (max-width: 665px)": {
      width: "100%",
      textAlign: "center",
    },
  },
  componentWrapper: {
    margin: "unset",
    "@media only screen and (min-width: 300px)": {
      width: "100%",
      paddingRight: 16,
      paddingLeft: 16,
    },
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 40,
    [`@media (max-width: ${breakpoints.mobile.str}px)`]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  skipButtonStyle: {
    color: colors.NEW_BLUE(1),
    ":hover": {
      color: colors.NEW_BLUE(1),
      background: colors.NEW_BLUE(0.1),
      opacity: 1,
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  pageContainer: {
    position: "relative",
    backgroundColor: "#FFF",
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: "30px 60px",
    maxWidth: 800,
    margin: "0 auto",
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
      width: 600,
      padding: 40,
      marginTop: 16,
    },
    "@media only screen and (max-width: 665px)": {
      width: "calc(100% - 32px)",
      padding: 16,
    },
  },
  pageTitle: {
    padding: 0,
    margin: 0,
    paddingBottom: 10,
    fontWeight: 400,
    marginBottom: 40,
    borderBottom: "1px solid #DDD",
    fontSize: 22,
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 665px)": {
      padding: 20,
      fontSize: 18,
    },
  },
  pageContent: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  // BUTTON
  buttonRowContainer: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    gap: 24,
    marginBottom: 40,
    "@media only screen and (max-width: 935px)": {
      marginBottom: 30,
    },
  },
  searchContainer: {
    width: "100%",
    minWidth: 300,
    display: "flex",
    justifyContent: "center",
    paddingBottom: 30,
    position: "relative",
    marginBottom: 10,
  },
  searchInput: {
    width: "100%",
    padding: 10,
    outline: "none",
    boxSizing: "border-box",
    background: "#FBFBFD",
    border: "#E8E8F2 1px solid",
    borderRadius: 3,
    fontSize: 16,
    ":hover": {
      borderColor: "#B3B3B3",
    },
    ":focus": {
      borderColor: "#3f85f7",
      ":hover": {
        boxShadow: "0px 0px 1px 1px #3f85f7",
        cursor: "text",
      },
    },
  },
  searchIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    cursor: "text",
    opacity: 0.4,
  },
  button: {
    position: "absolute",
    fontSize: 14,
    right: 2,
    bottom: 10,
    color: colors.BLUE(),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  disabled: {
    color: colors.BLACK(0.5),
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs,
  auth: state.auth,
  author: state.auth.user.author_profile,
  user: state.auth.user,
});

const mapDispatchToProps = {
  updateSubscribedHubs: HubActions.updateSubscribedHubs,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
