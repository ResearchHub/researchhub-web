import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/pro-duotone-svg-icons";
import { faPencil } from "@fortawesome/pro-solid-svg-icons";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { AuthActions } from "~/redux/auth";
import {
  buildSubscriptionPatch,
  digestSubscriptionPatch,
  emailPreferencePatch,
} from "~/config/shims";
import { capitalize } from "~/config/utils/string";
import { connect } from "react-redux";
import { createRef, Component } from "react";
import { css, StyleSheet } from "aphrodite";
import { defaultStyles, hubStyles, selectStyles } from "~/config/themes/styles";
import { DIGEST_FREQUENCY } from "~/config/constants";
import {
  doesNotExist,
  emptyFncWithMsg,
  isEmpty,
} from "~/config/utils/nullchecks";
import {
  fetchEmailPreference,
  subscribeToHub,
  unsubscribeFromHub,
  updateEmailPreference,
} from "~/config/fetch";
import { HubActions } from "~/redux/hub";
import { MessageActions } from "~/redux/message";
import { postShouldDisplayRscBalanceHome } from "~/components/Home/api/postShouldDisplayRscBalanceHome";
import { withAlert } from "react-alert";
import ComponentWrapper from "~/components/ComponentWrapper";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import Head from "~/components/Head";
import Ripples from "react-ripples";
import Toggle from "react-toggle";
import colors from "~/config/themes/colors";

import UserApiTokenInputField from "~/components/shared/UserApiTokenInputField";
import API, { generateApiUrl } from "~/config/api";
import Button from "~/components/Form/Button";
import { Helpers } from "@quantfive/js-web-config";
import api from "~/config/api";

const frequencyOptions = Object.keys(DIGEST_FREQUENCY).map((key) => {
  return {
    value: DIGEST_FREQUENCY[key],
    label: key,
  };
});

const contentSubscriptionOptions = [
  {
    id: "paperSubscription",
    label: "Threads on my authored papers",
  },
  {
    id: "threadSubscription",
    label: "Comments on my post",
  },
  {
    id: "commentSubscription",
    label: "Replies to my comments",
  },
  {
    id: "replySubscription",
    label: "Responses to my replies",
  },
  {
    id: "weeklyBountyDigestSubscription",
    label: "Bounty Digest",
  },
];

class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frequency: null,
      isPasswordInputVisible: false,
      password1: "",
      password2: "",
      emailRecipientId: null,
      isOptedOut: null,
      // Email Input
      email: this.props.user.email && this.props.user.email,
      activeEmailInput: false,
      transition: false,
      shouldDisplayRscBalanceHome:
        this.props.user?.should_display_rsc_balance_home,
    };
    this.emailInputRef = createRef();
    contentSubscriptionOptions.forEach((option) => {
      this.state[option.id] = true;
    });
  }

  componentDidMount = async () => {
    this.props.dispatch(MessageActions.showMessage({ load: true, show: true }));
    if (!this.props.hubs.length) {
      this.props.dispatch(HubActions.getHubs({}));
    }
    if (doesNotExist(this.props.user.email)) {
      await this.props.dispatch(AuthActions.getUser());
    }

    if (
      this.prevProps?.user?.should_display_rsc_balance_home !==
      this.props?.user?.should_display_rsc_balance_home
    ) {
      this.setState({
        shouldDisplayRscBalanceHome:
          this.props.user?.should_display_rsc_balance_home ?? true,
      });
    }

    fetchEmailPreference().then((preference) => {
      const frequency = this.getInitialFrequencyOption(preference);
      const contentSubscriptions =
        this.getInitialContentSubscriptionOptions(preference);
      const isOptedOut = this.getInitialIsOptedOut(preference);
      this.setState(
        {
          emailRecipientId: preference.id,
          frequency,
          ...contentSubscriptions,
          isOptedOut,
          email: this.props.user.email,
        },
        () => {
          this.props.dispatch(MessageActions.showMessage({ show: false }));
        }
      );
    });
  };

  getInitialFrequencyOption = (emailPreference) => {
    const initial = frequencyOptions.filter((option) => {
      return (
        emailPreference.digestSubscription &&
        option.value ===
          emailPreference.digestSubscription.notificationFrequency
      );
    });
    return initial[0];
  };

  getInitialContentSubscriptionOptions = (emailPreference) => {
    const initial = {};
    const subscriptionKeys = Object.keys(emailPreference).filter((key) => {
      return key.includes("Subscription");
    });
    subscriptionKeys.forEach((key) => {
      initial[key] = !emailPreference[key].none;
    });
    return initial;
  };

  getInitialIsOptedOut = (emailPreference) => {
    return emailPreference.isOptedOut;
  };

  saveEmail = () => {
    this.props.dispatch(MessageActions.showMessage({ show: true, load: true }));
    const currentEmail = this.props.user.email;
    const nextEmail = this.state.email;
    const data = emailPreferencePatch({
      email: nextEmail,
    });
    const updateSubscriptions = false;
    updateEmailPreference(
      this.state.emailRecipientId,
      data,
      updateSubscriptions
    )
      .then(() => {
        this.props.dispatch(MessageActions.showMessage({ show: false }));
        this.props.dispatch(MessageActions.setMessage("Saved!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
        this.setState({});
        this.toggleEmailInput();
      })
      .catch((err) => {
        this.displayError(err);
        this.setState({
          email: currentEmail,
        });
      });
  };

  toggleEmailInput = () => {
    this.setState({ transition: true }, () => {
      setTimeout(() => {
        this.setState(
          {
            activeEmailInput: !this.state.activeEmailInput,
            transition: false,
          },
          () => {
            this.state.activeEmailInput && this.emailInputRef.current.focus();
          }
        );
      }, 50);
    });
  };

  handleEmailChange = (id, value) => {
    this.setState({ email: value });
  };

  savePassword = () => {
    if (this.state.password1.length < 9) {
      this.props.dispatch(
        MessageActions.setMessage("Password must be at least 9 characters long")
      );
      this.props.dispatch(
        MessageActions.showMessage({ show: true, error: true })
      );
      return;
    } else if (this.state.password1 !== this.state.password2) {
      this.props.dispatch(MessageActions.setMessage("Passwords do not match"));
      this.props.dispatch(
        MessageActions.showMessage({ show: true, error: true })
      );
      return;
    }

    return fetch(
      API.CHANGE_PASSWORD(),
      API.POST_CONFIG({
        new_password1: this.state.password1,
        new_password2: this.state.password2,
      })
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        this.props.dispatch(
          MessageActions.setMessage("Successfully change password")
        );
        this.props.dispatch(
          MessageActions.showMessage({ show: true, error: false })
        );
        this.setState({
          password1: "",
          password2: "",
        });
        this.togglePasswordVisibility();
      })
      .catch((error) => {
        let errorMsg;
        try {
          // @ts-ignore
          errorMsg = Object.values(error?.message)[0][0];
        } catch (error) {
          errorMsg = "Unexpected error.";
        }
        this.props.dispatch(MessageActions.setMessage(errorMsg));
        this.props.dispatch(
          // @ts-ignore
          MessageActions.showMessage({ show: true, error: true })
        );
      });
  };

  renderChangePassword = () => {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.labelContainer)}>
          <div className={css(styles.listLabel)} id={"passwordTitle"}>
            {"Password"}
          </div>
          <Ripples
            className={css(styles.editIcon)}
            onClick={this.togglePasswordVisibility}
          >
            {this.state.isPasswordInputVisible ? (
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
            )}
          </Ripples>
        </div>
        <div
          className={css(
            styles.primaryEmail
            // transition && styles.blurTransition
          )}
        >
          {this.state.isPasswordInputVisible ? (
            <div>
              <form
                className={css(styles.passwordContainer)}
                onSubmit={(e) => {
                  e.preventDefault();
                  this.savePassword();
                }}
              >
                <FormInput
                  placeholder={"Enter new password"}
                  containerStyle={styles.emailInputStyles}
                  inputStyle={styles.emailInput}
                  value={this.state.password1}
                  type="password"
                  onChange={(id, value) => {
                    this.setState({ password1: value });
                  }}
                />
                <FormInput
                  placeholder={"Verify new password"}
                  containerStyle={styles.emailInputStyles}
                  inputStyle={styles.emailInput}
                  value={this.state.password2}
                  type="password"
                  onChange={(id, value) => {
                    this.setState({ password2: value });
                  }}
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    this.savePassword();
                  }}
                >
                  Save
                </Button>
              </form>
            </div>
          ) : (
            <div>•••••••••••••••</div>
          )}
        </div>
      </div>
    );
  };

  togglePasswordVisibility = () => {
    this.setState({
      isPasswordInputVisible: !this.state.isPasswordInputVisible,
    });
  };

  renderPrimaryEmail = () => {
    const { email, activeEmailInput, transition } = this.state;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.labelContainer)}>
          <div className={css(styles.listLabel)} id={"hubListTitle"}>
            {"Primary Email"}
          </div>
          <Ripples
            className={css(styles.editIcon)}
            onClick={this.toggleEmailInput}
          >
            {activeEmailInput ? (
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
            )}
          </Ripples>
        </div>
        <div
          className={css(
            styles.primaryEmail,
            transition && styles.blurTransition
          )}
        >
          {activeEmailInput ? (
            <form
              className={css(styles.emailInputContainer)}
              onSubmit={(e) => {
                e.preventDefault();
                this.saveEmail();
              }}
            >
              <FormInput
                getRef={this.emailInputRef}
                placeholder={"Enter an email"}
                containerStyle={styles.emailInputStyles}
                inputStyle={styles.emailInput}
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
              <Ripples
                className={css(styles.saveIcon)}
                onClick={(e) => {
                  e.preventDefault();
                  this.saveEmail();
                }}
              >
                {<FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>}
              </Ripples>
            </form>
          ) : (
            <div className={css(styles.paddedText)}>{email}</div>
          )}
        </div>
      </div>
    );
  };

  renderFrequencySelect() {
    return (
      <div className={css(styles.container)}>
        <Head title={"User's Settings"} />
        <div className={css(styles.listLabel)} id={"hubListTitle"}>
          {"Hub Digest Frequency"}
        </div>
        <div className={css(styles.formContainer)}>
          <FormSelect
            id={"frequencySelect"}
            options={frequencyOptions}
            value={this.state.frequency}
            containerStyle={
              (selectStyles.container, styles.formSelectContainer)
            }
            inputStyle={(selectStyles.input, styles.formSelectInput)}
            onChange={this.handleFrequencyChange}
            isSearchable={false}
          />
        </div>
      </div>
    );
  }

  handleFrequencyChange = (id, option) => {
    const currentFrequency = this.state.frequency;
    this.setState({
      frequency: option,
    });
    const data = digestSubscriptionPatch({
      notificationFrequency: option.value,
    });
    updateEmailPreference(this.state.emailRecipientId, data)
      .then(() => {
        this.props.dispatch(MessageActions.setMessage("Saved!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        this.displayError(err);
        this.setState({
          frequency: currentFrequency,
        });
      });
  };

  renderSubscribedHubs = () => {
    const subscribedHubIds = {};

    this.props.subscribedHubs.forEach((hub) => {
      subscribedHubIds[hub.id] = true;
    });

    const availableHubs = this.props.hubs.filter((hub) => {
      return !subscribedHubIds[hub.id];
    });

    return (
      <div className={css(styles.container)}>
        <div className={css(hubStyles.list, styles.hubsList)}>
          <FormSelect
            id={"hubSelect"}
            options={this.buildHubOptions(availableHubs)}
            containerStyle={
              (selectStyles.container, styles.formSelectContainer)
            }
            inputStyle={(selectStyles.input, styles.formSelectInput)}
            onChange={this.handleHubOnChange}
            isSearchable={true}
            placeholder={"Search Hubs"}
            value={this.buildHubOptions(this.props.subscribedHubs)}
            isMulti={true}
            multiTagStyle={styles.multiTagStyle}
            multiTagLabelStyle={styles.multiTagLabelStyle}
            isClearable={false}
          />
        </div>
        <div
          className={css(
            styles.buttonContainer,
            !this.props.subscribedHubs.length && styles.hide
          )}
        >
          <div
            className={css(styles.unsubscribeButton)}
            onClick={this.confirmUnsubscribeAll}
          >
            Leave All
          </div>
        </div>
      </div>
    );
  };

  renderHub = (hub) => {
    return (
      <Ripples
        onClick={() => this.confirmUnsubscribe(hub)}
        key={hub.id}
        className={css(hubStyles.entry, styles.hubEntry)}
      >
        {hub.name}
        <div className={css(styles.closeIcon)}>
          {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
        </div>
      </Ripples>
    );
  };

  confirmUnsubscribe = (hub, newState) => {
    this.props.alert.show({
      text: (
        <span>
          Leave from
          <span className={css(styles.hubName)}>{` ${hub.name} `}</span>?
        </span>
      ),
      buttonText: "Yes",
      onClick: () => {
        return this.handleHubUnsubscribe(hub, newState);
      },
    });
  };

  handleHubUnsubscribe = (hub, newState) => {
    const hubId = hub.id;
    const hubName = capitalize(hub.name);
    unsubscribeFromHub({ hubId })
      .then((res) => {
        this.props.dispatch(HubActions.updateSubscribedHubs(newState));
        this.props.dispatch(MessageActions.setMessage(`Left ${hubName}!`));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch(this.displayError);
  };

  confirmUnsubscribeAll = () => {
    this.props.alert.show({
      text: <span>Leave from all your hub communities?</span>,
      buttonText: "Yes",
      onClick: () => {
        return this.unsubscribeFromAll();
      },
    });
  };

  unsubscribeFromAll = async () => {
    this.props.dispatch(MessageActions.showMessage({ show: true, load: true }));
    await Promise.all(
      this.props.subscribedHubs.map((hub) => {
        return unsubscribeFromHub({ hubId: hub.id });
      })
    )
      .then((_) => {
        this.props.dispatch(HubActions.updateSubscribedHubs([]));
        this.props.dispatch(MessageActions.showMessage({ show: false }));
        // this.props.dispatch(
        //   MessageActions.setMessage("Successfully left all hubs!")
        // );
        // this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch(this.displayError);
  };
  buildHubOptions = (hubs) => {
    return (
      hubs &&
      hubs.map((hub) => {
        let hubName =
          !isEmpty(hub.name) &&
          hub.name
            .split(" ")
            .map((el) => {
              if (!el[0]) {
                return "";
              }
              return el[0].toUpperCase() + el.slice(1);
            })
            .join(" ");
        let obj = { ...hub };
        obj.value = hub.id;
        obj.label = hubName;
        return obj;
      })
    );
  };

  handleHubOnChange = (id, newHubList) => {
    const prevState = this.props.subscribedHubs;

    if (doesNotExist(newHubList)) {
      newHubList = [];
    }

    if (newHubList.length > prevState.length) {
      const newHub = newHubList[newHubList.length - 1];
      this.handleHubSubscribe(newHub, newHubList);
    } else {
      const removedHub = this.detectRemovedHub(prevState, newHubList);
      this.confirmUnsubscribe(removedHub, newHubList);
    }
  };

  handleHubSubscribe = (hub, newState) => {
    const hubName = capitalize(hub.name);

    subscribeToHub({ hubId: hub.id })
      .then((_) => {
        // this.props.dispatch(HubActions.updateHub(hubState, { ...res }));
        this.props.dispatch(HubActions.updateSubscribedHubs(newState));
        this.props.dispatch(MessageActions.setMessage(`Joined ${hubName}`));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch(this.displayError);
  };

  detectRemovedHub = (prevState, newState) => {
    const cache = {};
    prevState.forEach((hub) => {
      cache[hub.id] = hub;
    });

    for (var i = 0; i < newState.length; i++) {
      var id = newState[i].value;
      if (cache[id]) {
        delete cache[id];
      }
    }

    return Object.values(cache)[0];
  };

  renderContentSubscriptions = () => {
    return contentSubscriptionOptions.map((option) => {
      return (
        <div className={css(styles.checkboxEntry)}>
          <div className={css(styles.checkboxLabel)} id={"checkbox-label"}>
            {option.label}
          </div>
          <Toggle
            key={option.id}
            className={"react-toggle"}
            defaultChecked={this.state[option.id]}
            checked={this.state[option.id]}
            disabled={this.state.isOptedOut}
            id={option.id}
            onChange={this.handleContentSubscribe}
          />
        </div>
      );
    });
  };

  handleContentSubscribe = (e) => {
    e && e.preventDefault();
    let id = e.target.id;
    let nextActiveState = e.target.checked;
    const startingActiveState = this.state[id];

    this.setState({
      [id]: nextActiveState,
    });

    const data = buildSubscriptionPatch(id, nextActiveState);
    updateEmailPreference(this.state.emailRecipientId, data)
      .then(() => {
        this.props.dispatch(MessageActions.setMessage("Saved!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        this.displayError(err);
        this.setState({
          [id]: startingActiveState,
        });
      });
  };

  deleteAccount = async () => {
    const deleteOrNot = confirm(
      "Are you sure you want to delete your account?"
    );

    if (deleteOrNot) {
      const url = generateApiUrl(`user/${this.props.user.id}`);
      const res = await fetch(url, api.DELETE_CONFIG());
      window.location.href = "/";
    }
  };

  renderOptOut = () => {
    return (
      <div className={css(styles.checkboxEntry)}>
        <div className={css(styles.checkboxLabel, styles.optOut)}>
          {"Opt out of all email updates"}
        </div>
        <Toggle
          key={"optOut"}
          defaultChecked={this.state.isOptedOut}
          checked={this.state.isOptedOut}
          className={"react-toggle"}
          active={this.state.isOptedOut}
          id={"optOut"}
          onChange={this.handleOptOut}
        />
      </div>
    );
  };

  handleOptOut = (e) => {
    let nextActiveState = e.target.checked;
    const startingActiveState = this.state.isOptedOut;
    this.setState({
      isOptedOut: nextActiveState,
    });

    const data = emailPreferencePatch({ isOptedOut: nextActiveState });
    updateEmailPreference(this.state.emailRecipientId, data)
      .then(() => {
        this.props.dispatch(MessageActions.setMessage("Saved!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        this.displayError(err);
        this.setState({
          isOptedOut: startingActiveState,
        });
      });
  };

  displayError = (err) => {
    this.props.dispatch(
      MessageActions.setMessage("Oops! Something went wrong.")
    );
    this.props.dispatch(
      MessageActions.showMessage({ show: true, error: true })
    );
  };

  render() {
    return (
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
        <div className={css(styles.settingsPage)}>
          <div className={css(defaultStyles.title, styles.title)}>Settings</div>
          {this.renderPrimaryEmail()}
          {this.props.user.auth_provider === "email" &&
            this.renderChangePassword()}
          <UserApiTokenInputField />
          {this.renderFrequencySelect()}
          {/* {this.renderSubscribedHubs()} */}
          <div className={css(styles.container)}>
            <div className={css(styles.listLabel)} id={"hubListTitle"}>
              {"Notifications"}
            </div>
            {this.renderContentSubscriptions()}
            <div className={css(styles.checkboxEntry)}>
              <div className={css(styles.checkboxLabel)}>
                {"Display RSC Balance in home page"}
              </div>
              <Toggle
                id={"shouldDisplayRscBalanceHome"}
                className={"react-toggle"}
                checked={this.state.shouldDisplayRscBalanceHome}
                onChange={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  postShouldDisplayRscBalanceHome({
                    onError: emptyFncWithMsg,
                    onSuccess: (flag) => {
                      this.setState({ shouldDisplayRscBalanceHome: flag });
                      this.props.dispatch(
                        AuthActions.updateUser({
                          should_display_rsc_balance_home: flag,
                        })
                      );
                    },
                    shouldDisplayRscBalanceHome:
                      !this.state.shouldDisplayRscBalanceHome,
                    targetUserID: this.props.user?.id,
                  });
                }}
              />
            </div>
            {this.renderOptOut()}
          </div>
          <div>
            <Button
              label="Delete Account"
              onClick={this.deleteAccount}
              customButtonStyle={styles.deleteButton}
            ></Button>
          </div>
        </div>
      </ComponentWrapper>
    );
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    width: "100%",
    background: "red",
    border: "none",
  },
  componentWrapper: {
    "@media only screen and (min-width: 1280px)": {
      width: 800,
    },
    "@media only screen and (min-width: 1440px)": {
      width: 800,
    },
  },
  settingsPage: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "#fff",
    border: "1.5px solid #F0F0F0",
    borderRadius: 4,
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    padding: "25px 50px",
    margin: "40px 0 50px",
    "@media only screen and (max-width: 767px)": {
      padding: 20,
    },
  },
  title: {
    paddingBottom: 10,
    letterSpacing: 1.1,
    fontWeight: 500,
  },
  subtitle: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    fontSize: 22,
    paddingBottom: 10,
    "@media only screen and (max-width: 1343px)": {
      fontWeight: 500,
      fontSize: 22,
    },
  },
  labelContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listLabel: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 15,
    letterSpacing: 1.2,
    marginBottom: 15,
    textAlign: "left",
    color: colors.BLACK(),
    boxSizing: "border-box",
  },
  container: {
    padding: "30px 10px",
    borderTop: "1px solid #EDEDED",
  },
  formSelectContainer: {
    padding: 0,
    margin: 0,
    width: "100%",
    minHeight: "unset",
  },
  formSelectInput: {
    width: "100%",
  },
  multiTagStyle: {
    margin: "5px 0",
    marginRight: 5,
    border: "1px solid #fff",
    padding: "5px 8px",
    ":hover": {
      border: `1px solid ${colors.BLUE()}`,
    },
  },
  multiTagLabelStyle: {
    color: colors.PURPLE(1),
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  formContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  primaryEmail: {
    width: "100%",
    fontSize: 16,
    fontWeight: 300,
  },
  blurTransition: {
    filter: "blur(4px)",
  },
  emailIcon: {
    marginRight: 10,
    color: "#707378",
  },
  saveIcon: {
    height: 32,
    width: 32,
    fontSize: 12,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: colors.BLUE(),
    color: "#FFF",
    position: "absolute",
    right: 5,
  },
  editIcon: {
    cursor: "pointer",
    borderRadius: "50%",
    color: "#afb5bc",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: 32,
    ":hover": {
      color: colors.BLACK(),
      backgroundColor: "#EDEDED",
    },
  },
  emailInputContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    marginTop: 5,
  },
  passwordContainer: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    position: "relative",
    rowGap: 15,
    marginTop: 5,
  },
  emailInputStyles: {
    padding: 0,
    margin: 0,
    minHeight: "unset",
    width: "calc(100% - 32px)",
  },
  emailInput: {
    width: "100%",
  },
  hubsList: {
    width: "100%",
    boxSizing: "border-box",
    padding: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    "@media only screen and (max-width: 1303px)": {
      padding: 0,
    },
  },
  hubEntry: {
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "border-box",
    marginBottom: 5,
    backgroundColor: "rgb(237, 238, 254)",
    color: colors.PURPLE(1),
    fontWeight: 500,
    textTransform: "uppercase",
    padding: "8px 12px",
    border: "1px solid #fff",
    letterSpacing: 1,
    fontSize: 12,
    marginRight: 5,
    width: "unset",
    ":hover": {
      backgroundColor: "rgb(237, 238, 254)",
      borderColor: colors.BLUE(),
    },
  },
  hubName: {
    color: colors.BLUE(),
    textTransform: "capitalize",
  },
  closeIcon: {
    cursor: "pointer",
    color: colors.BLACK(),
    borderRadius: "50%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
    ":hover": {
      color: "#3f85f7",
    },
  },
  checkboxEntry: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderTop: "1px solid #EDEDED",
    fontWeight: 300,
    ":hover": {
      fontWeight: 500,
    },
  },
  checkboxLabel: {
    fontSize: 16,
  },
  optOut: {
    fontWeight: 400,
  },
  addIcon: {
    fontSize: 18,
    marginRight: 3,
    ":hover": {
      backgroundColor: "#fff",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 15,
  },
  unsubscribeButton: {
    fontSize: 14,
    cursor: "pointer",
    color: colors.BLUE(),
    ":hover": {
      textDecoration: "underline",
    },
  },
  hide: {
    height: 0,
    padding: 0,
    visibility: "hidden",
  },
});

const mapStateToProps = (state) => ({
  ...state.hubs,
  hubState: state.hubs,
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(withAlert()(UserSettings));
