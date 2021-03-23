import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder/lib";
import Router from "next/router";

import OnboardPlaceholder from "~/components/Placeholders/OnboardPlaceholder";
import OnboardForm from "~/components/Onboard/OnboardForm";
import OnboardHubList from "~/components/Onboard/OnboardHubList";
import ButtonsRow from "~/components/Form/ButtonsRow";
import Head from "~/components/Head";

import { ModalActions } from "~/redux/modals";
import { HubActions } from "~/redux/hub";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { subscribeToHub, unsubscribeFromHub } from "~/config/fetch";
import VerificationForm from "../../../../components/Form/VerificationForm";
import ComponentWrapper from "../../../../components/ComponentWrapper";
import { MessageActions } from "../../../../redux/message";

const SEARCH_TIMEOUT = 400;

const mapArrayToObject = (arr = []) => {
  const result = {};
  arr.forEach((el) => {
    result[el.id] = el;
  });
  return result;
};

const Index = (props) => {
  // hub select flow
  const [onlyHubSelection, setOnlyHubSelection] = useState(props.selectHubs);

  // onboard flow
  const [page, setPage] = useState(1);
  const [saving, toggleSaving] = useState(false);

  // search feature
  const [searchValue, setSearchValue] = useState("");
  const [timeout, addTimeout] = useState(null);
  const [searching, setSearching] = useState(false);
  const [hubs, setHubs] = useState(props.hubs.topHubs || []);

  const [userHubIds, setUserHubIds] = useState(
    mapArrayToObject(props.hubs.subscribedHubs)
  );
  const { showMessage } = props;

  useEffect(() => {
    setHubs(props.hubs.topHubs || []);
    setUserHubIds(mapArrayToObject(props.hubs.subscribedHubs));
  }, [props.hubs]);

  useEffect(() => {
    window.scrollTo({
      behavior: "auto",
      top: 0,
    });
  }, [page]);

  let formRef = useRef();
  let verificationFormRef = useRef();

  const formatStep = () => {
    if (onlyHubSelection) {
      return "Subscribe to hubs You're Interested In";
    }

    switch (page) {
      case 1:
        return "Subscribe to hubs you're interested in";
      case 2:
        return "Enter your profile information";
      default:
        return;
    }
  };

  const formatTitle = () => {
    switch (page) {
      case 1:
        return "Subscribe to hubs you're interested in";
      case 2:
        return "Enter your profile information";
      default:
        return;
    }
  };

  const saveVerification = () => {
    // Saves verification step
    verificationFormRef.current.uploadVerification().then(() => {
      navigateHome();
    });
  };

  const formatButtons = () => {
    if (onlyHubSelection) {
      return {
        left: {
          label: "Cancel",
          onClick: () => Router.back(),
        },
        right: {
          label: "Save",
          onClick: saveHubPreferences,
          disabled: saving,
        },
      };
    }
    switch (page) {
      case 1:
        return {
          left: {
            label: "Skip",
            onClick: () => setPage(page + 1),
          },
          right: {
            label: "Save & Continue",
            onClick: saveHubPreferences,
            disabled: saving,
          },
        };
      case 2:
        return {
          left: {
            label: "Previous Step",
            onClick: () => setPage(page - 1),
          },
          right: {
            label: "Save & Finish",
            onClick: saveUserInformation,
            disabled: saving,
          },
        };
    }
  };

  /**
   * Handle user's click of hub on onboarding screen
   * @param {Object} hub metadata of hub being clicked.
   * @param {Boolean} state whether the hub is being add or removed.
   */
  const handleHubClick = (hub, state) => {
    const updatedUserHubs = { ...userHubIds };

    if (state) {
      updatedUserHubs[hub.id] = hub;
    } else {
      updatedUserHubs[hub.id] = null;
    }

    return setUserHubIds(updatedUserHubs);
  };

  /**
   * Saves user's hub selections and updates client's state
   */
  const saveHubPreferences = async () => {
    toggleSaving(true);

    const newState = [];
    const subscribedHubIds = [];
    const unsubscribedHubIds = [];

    const seen = mapArrayToObject(props.hubs.subscribedHubs);

    for (const [id, value] of Object.entries(userHubIds)) {
      if (value === null) {
        unsubscribedHubIds.push(id);
      } else {
        if (!seen[id]) {
          subscribedHubIds.push(id);
        }
        newState.push(value);
      }
    }

    await Promise.all([
      ...subscribedHubIds.map((hubId) => {
        return subscribeToHub({ hubId });
      }),
      ...unsubscribedHubIds.map((hubId) => {
        return unsubscribeFromHub({ hubId });
      }),
    ]);

    props.updateSubscribedHubs(newState); // update client
    toggleSaving(false);

    if (onlyHubSelection) {
      return Router.push("/", "/");
    } else {
      showMessage({ show: false });
      setPage(page + 1);
    }
  };

  const saveUserInformation = () => {
    const saveButton = formRef.current.buttonRef.current;
    saveButton.click();
    navigateHome();
  };

  const connectOrcidAccount = () => {
    props.openOrcidConnectModal(true);
  };

  const navigateHome = () => {
    Router.push("/", `/`).then(() => {
      connectOrcidAccount();
    });
  };

  const searchHubs = (e) => {
    setSearching(true);
    const search = e.target.value;
    const ignoreTimeout = search.length >= 7 && search.length % 7 === 0; // call search at 7th keystroke and every multiple of 7 thereafter

    if (!ignoreTimeout) {
      timeout && clearTimeout(timeout);
    }

    setSearchValue(search);
    addTimeout(
      setTimeout(() => {
        fetch(API.HUB({ search }), API.GET_CONFIG())
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            setHubs(res.results);
            setSearching(false);
          });
      }, SEARCH_TIMEOUT)
    );
  };

  const resetSearch = (e) => {
    e && e.stopPropagation();
    timeout && clearTimeout(timeout);
    setSearchValue("");
    setHubs(props.hubs.topHubs || []);
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return (
          <div className={css(styles.column)}>
            <div className={css(styles.searchContainer)}>
              <input
                className={css(styles.searchInput)}
                type={"text"}
                onChange={searchHubs}
                value={searchValue}
                placeholder={"Search Hubs"}
              />
              <span className={css(styles.searchIcon)}>{icons.search}</span>
              <div
                onClick={resetSearch}
                className={css(
                  styles.button,
                  searchValue.trim() === "" && styles.disabled
                )}
              >
                Clear
              </div>
            </div>

            <ReactPlaceholder
              ready={props.hubs.topHubs.length}
              showLoadingAnimation
              customPlaceholder={<OnboardPlaceholder color="#efefef" />}
            >
              <OnboardHubList
                hubs={hubs}
                onClick={handleHubClick}
                searching={searching}
                userHubIds={userHubIds}
              />
            </ReactPlaceholder>
          </div>
        );
      case 2:
        return <OnboardForm forwardedRef={formRef} />;
      case 3:
        return (
          <VerificationForm
            ref={verificationFormRef}
            showMessage={showMessage}
          />
        );
    }
  };

  return (
    <div className={css(styles.root)}>
      <Head
        title={"Onboard onto Researchhub"}
        description={"Welcome to Researchhub!"}
      />
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title)}>{formatStep()}</h1>
      </div>
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
        <div className={css(styles.pageContainer)}>
          <div className={css(styles.pageContent)}>{renderPage()}</div>
        </div>
      </ComponentWrapper>
      <div className={css(styles.buttonRowContainer)}>
        <ButtonsRow {...formatButtons()} />
      </div>
    </div>
  );
};

Index.getInitialProps = async ({ query, res }) => {
  const { authorId, selectHubs } = query;

  return { authorId, selectHubs };
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
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 40,
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
  openOrcidConnectModal: ModalActions.openOrcidConnectModal,
  updateSubscribedHubs: HubActions.updateSubscribedHubs,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
