import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

import OnboardHubList from "~/components/Onboard/OnboardHubList";

const Index = (props) => {
  const [page, setPage] = useState(1);

  const pages = [
    {
      title: "Select Hubs",
    },
    {
      title: "Enter your personal information",
    },
  ];

  const formatStep = () => {
    switch (page) {
      case 1:
        return "Step 1: Select the hubs you want to subscribe";
      case 2:
        return "Step 2: User Information";
      default:
        return;
    }
  };

  const formatTitle = () => {
    switch (page) {
      case 1:
        return "Select Hubs";
      case 2:
        return "Enter your personal information";
      default:
        return;
    }
  };

  const renderPage = () => {
    return (
      <Fragment>
        <div className={css(styles.pageContent)}>
          <OnboardHubList />
        </div>
      </Fragment>
    );
  };

  const renderButton = () => {
    return <div></div>;
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title)}>Onboarding</h1>
        <h3 className={css(styles.subtitle)}>{formatStep()}</h3>
      </div>
      <div className={css(styles.pageContainer)}>
        <h1 className={css(styles.pageTitle)}>{formatTitle()}</h1>
        {renderPage()}
      </div>
      <div className={css(styles.buttonContainer)}>{renderButton()}</div>
    </div>
  );
};

const styles = StyleSheet.create({
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
    color: "#6f6c7d",
    padding: 0,
    margin: 0,
    marginTop: 10,
    "@media only screen and (max-width: 665px)": {
      width: 300,
      textAlign: "center",
    },
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
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
    marginTop: 40,
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
      width: 600,
      padding: 40,
      marginTop: 16,
    },
    "@media only screen and (max-width: 665px)": {
      width: "calc(100% - 16px)",
      padding: 16,
    },
    "@media only screen and (max-width: 415px)": {
      borderTop: "unset",
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
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default Index;
