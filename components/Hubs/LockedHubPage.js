import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Progress from "react-progressbar";

// Component
import Button from "~/components/Form/Button";
import HubsList from "~/components/Hubs/HubsList";
import Message from "~/components/Loader/Message";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";

// Redux
import { ModalActions } from "~/redux/modals";
import { HubActions } from "~/redux/hub";
import { MessageActions } from "~/redux/message";

// Config
import API from "~/config/api";
import { Helpers } from "~/config/helpers";

class LockedHubPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      subscriberCount: 0,
      joined: false,
      reveal: false,
      transition: false,
      hub: {
        name: "",
      },
    };
  }

  componentDidMount() {
    this.intializePage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hub.id !== this.props.hub.id) {
      this.intializePage();
    }
  }

  intializePage = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    this.props.showMessage({ load: true, show: true });
    this.animateProgress = setInterval(this.incrementProgress, 30);
    const { hub } = this.props;
    this.setState({
      reveal: false,
      subscriberCount: hub.subscriber_count,
      progress: 0,
      hub,
      joined: hub.user_is_subscribed,
    });
    setTimeout(() => {
      this.setState({ reveal: true });
      this.props.showMessage({ show: false });
    }, 400);
  };

  incrementProgress = () => {
    if (this.state.progress < this.state.subscriberCount) {
      this.setState({ progress: this.state.progress + 1 });
    }
  };

  componentWillUnmount() {
    this.setState({ reveal: false });
    clearInterval(this.incrementProgress);
  }

  hubAction = async () => {
    let didPromptLogin = this.promptLogin();

    if (didPromptLogin) {
      return null;
    }

    this.props.showMessage({ load: true, show: true });
    if (this.state.joined) {
      this.leaveHub();
    } else {
      this.joinHub();
    }
  };

  openInviteToHubModal = () => {
    let hubId = this.props.hub.id
      ? this.props.hub.id
      : this.props.hubs.currentHub.id
      ? this.props.hubs.currentHub.id
      : null;

    let didPromptLogin = this.promptLogin();

    if (didPromptLogin) {
      return null;
    }

    this.props.openInviteToHubModal(true, hubId);
  };

  promptLogin = () => {
    let { auth, openLoginModal } = this.props;
    if (!auth.isLoggedIn) {
      openLoginModal(true);
      return true;
    }
    return false;
  };

  leaveHub = () => {
    let hubId = this.props.hub.id
      ? this.props.hub.id
      : this.props.hubs.currentHub.id
      ? this.props.hubs.currentHub.id
      : null;
    return fetch(API.HUB_UNSUBSCRIBE({ hubId }), API.POST_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(async (res) => {
        this.setState({
          progress: this.state.progress - 1,
          subscriberCount: this.state.subscriberCount - 1,
          transition: true,
        });
        setTimeout(() => {
          this.setState({ joined: false, transition: false });
          this.props.showMessage({ show: false });
        }, 500);
      })
      .catch((err) => {
        this.props.setMessage("Something went wrong. Please try again later");
        this.props.showMessage({ error: true, show: true });
        setTimeout(() => {
          this.props.showMessage({ show: false });
        }, 1000);
      });
  };

  joinHub = () => {
    let hubId = this.props.hub.id
      ? this.props.hub.id
      : this.props.hubs.currentHub.id
      ? this.props.hubs.currentHub.id
      : null;
    return fetch(API.HUB_SUBSCRIBE({ hubId }), API.POST_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState(
          {
            progress: this.state.progress + 1,
            subscriberCount: this.state.subscriberCount + 1,
            transition: true,
          },
          () => {
            setTimeout(() => {
              this.setState({ joined: true, transition: false });
              this.props.showMessage({ show: false });
            }, 500);
          }
        );
      })
      .catch((err) => {
        this.props.setMessage("Something went wrong. Please try again later");
        this.props.showMessage({ error: true, show: true });
        setTimeout(() => {
          this.props.showMessage({ show: false });
        }, 1000);
      });
  };

  render() {
    let { progress, joined, transition, reveal } = this.state;
    return (
      <div className={css(styles.backgroundOverlay)}>
        <div className={css(styles.contentContainer)}>
          <div className={css(styles.content, reveal && styles.reveal)}>
            <div className={css(styles.title, styles.text)}>
              {this.props.hub.name} Hub
            </div>
            <div
              className={css(
                styles.subtitle,
                styles.text,
                transition && styles.transition
              )}
            >
              {!joined
                ? "This hub will be activated when at least 15 members have pledged to contribute content. Join this hub to show your support."
                : "Thank you for joining this hub! This hub will be activated when at least 15 members have pledged to contribute content."}
            </div>
            <Message />
            <div className={css(styles.progressContainer)}>
              <div className={css(styles.status, styles.text)}>
                {progress} out of 15 researchers have pledged to launch this
                community
              </div>
              <div className={css(styles.progressBar)}>
                <Progress completed={(progress / 15) * 100} />
              </div>
              <p className={css(styles.footer, styles.text)}>
                {15 - progress} members to go
              </p>
            </div>
            <div className={css(styles.buttonsRow)}>
              <Button
                isWhite={true}
                label={"Invite People"}
                customButtonStyle={styles.button}
                onClick={this.openInviteToHubModal}
              />
              <PermissionNotificationWrapper
                modalMessage="join a hub"
                onClick={this.hubAction}
                styling={styles.button}
                loginRequired={true}
              >
                <Button
                  label={joined ? "Leave Hub" : "Join Hub"}
                  customButtonStyle={styles.button}
                  hideRipples={true}
                />
              </PermissionNotificationWrapper>
            </div>
          </div>
        </div>
        <div className={css(styles.sidebarContainer)}>
          <div className={css(styles.sidebar)}>
            <HubsList overrideStyle={styles.hublist} current={this.props.hub} />
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  backgroundOverlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 80,
    backgroundColor: "#FCFCFC",
    minHeight: "100vh",
    overflow: "auto",
    "@media only screen and (max-width: 815px)": {
      flexDirection: "column",
      justifyContent: "flex-start",
      paddingTop: 0,
    },
  },
  sidebarContainer: {
    width: 297,
    minHeight: 633,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 30,
    "@media only screen and (max-width: 1302px)": {
      width: 200,
    },
    "@media only screen and (max-width: 815px)": {
      width: "100%",
      marginLeft: 0,
      height: "unset",
    },
  },
  sidebar: {
    width: 297,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#FFF",
    border: "1px solid #EDEDED",
    "@media only screen and (max-width: 1302px)": {
      width: 200,
    },
    "@media only screen and (max-width: 815px)": {
      width: "100%",
    },
  },
  contentContainer: {
    height: 633,
    width: 953,
    backgroundColor: "#FFF",
    border: "1px solid #EDEDED",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 650,
    "@media only screen and (max-width: 815px)": {
      width: "100%",
      minWidth: "unset",
    },
    "@media only screen and (max-width: 415px)": {
      height: "unset",
      padding: "30px 0 30px 0",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: 480,
    height: 316,
    opacity: 0,
    "@media only screen and (max-width: 550px)": {
      width: 415,
    },
    "@media only screen and (max-width: 415px)": {
      width: 320,
    },
    "@media only screen and (max-width: 321px)": {
      width: 290,
    },
  },
  reveal: {
    opacity: 1,
    transition: "all ease-in 0.3s",
  },
  text: {
    fontFamily: "Roboto",
    lineHeight: 1.6,
  },
  title: {
    fontSize: 33,
    fontWeight: 400,
    textTransform: "capitalize",
    "@media only screen and (max-width: 415px)": {
      fontSize: 28,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 25,
      marginTop: 20,
      marginBottom: 10,
    },
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 300,
    marginTop: -20,
    color: "#4f4d5f",
    transition: "all ease-in-out 0.3s",
    "@media only screen and (max-width: 550px)": {
      fontSize: 14,
      whiteSpace: "pre-wrap",
      width: 415,
    },
    "@media only screen and (max-width: 415px)": {
      width: 320,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  transition: {
    opacity: 0,
  },
  status: {
    fontSize: 18,
    fontWeight: 400,
    marginBottom: 20,
    "@media only screen and (max-width: 550px)": {
      width: 415,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
      width: 320,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  progressContainer: {
    width: 476,
    whiteSpace: "pre-wrap",
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "relative",
    paddingBottom: 20,
    marginBottom: 20,
    "@media only screen and (max-width: 550px)": {
      width: 415,
    },
    "@media only screen and (max-width: 415px)": {
      width: 320,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  progressBar: {
    backgroundColor: "#EDEDED",
  },
  footer: {
    color: "#9B99A2",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1.2,
    position: "absolute",
    bottom: -10,
    right: 0,
    "@media only screen and (max-width: 415px)": {
      fontSize: 9,
    },
  },
  buttonsRow: {
    display: "flex",
    justifyContent: "space-between",
    width: 379,
    "@media only screen and (max-width: 415px)": {
      // width: 320,
      width: "100%",
    },
    "@media only screen and (max-width: 321px)": {
      width: 290,
      marginBottom: 30,
    },
  },
  button: {
    width: 180,
    height: 55,
    "@media only screen and (max-width: 415px)": {
      width: 150,
    },
    "@media only screen and (max-width: 321px)": {
      width: 140,
      height: 40,
    },
  },
  hublist: {
    padding: "40px 15px",
    width: "calc(100% - 15x)",
    "@media only screen and (max-width: 815px)": {
      alignItems: "flex-start",
      padding: "40px 80px",
      width: "calc(100% - 160px)",
    },
    "@media only screen and (max-width: 415px)": {
      paddingLeft: 40,
    },
  },
});

const mapStateToProps = (state) => ({
  message: state.message,
  hubs: state.hubs,
  auth: state.auth,
});

const mapDispatchToProps = {
  openInviteToHubModal: ModalActions.openInviteToHubModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockedHubPage);
