import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Progress from "react-progressbar";

// Component
import Button from "~/components/Form/Button";
import HubsList from "~/components/Hubs/HubsList";
import Message from "~/components/Loader/Message";

// Redux
import { ModalActions } from "~/redux/modals";
import { HubActions } from "~/redux/hub";
import { MessageActions } from "~/redux/message";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

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
    this.props.showMessage({ load: true, show: true });
    this.animateProgress = setInterval(this.incrementProgress, 30);
    const { hub } = this.props;
    this.setState({
      subscriberCount: hub.subscriber_count,
      progress: 0,
      hub,
      joined: hub.user_is_subscribed,
    });
    setTimeout(() => {
      this.setState({ reveal: true });
      this.props.showMessage({ show: false });
    }, 400);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hub.id !== this.props.hub.id) {
      this.animateProgress = setInterval(this.incrementProgress, 30);
      const { hub } = this.props;
      this.setState(
        {
          reveal: false,
          subscriberCount: hub.subscriber_count,
          progress: 0,
          hub,
          joined: hub.user_is_subscribed,
        },
        () => {
          setTimeout(() => {
            this.setState({ reveal: true });
          }, 400);
        }
      );
    }
  }

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
    this.props.showMessage({ load: true, show: true });
    if (this.state.joined) {
      this.leaveHub();
    } else {
      this.joinHub();
    }
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
      .then(async (res) => {
        await this.setState({
          progress: this.state.progress + 1,
          subscriberCount: this.state.subscriberCount + 1,
          transition: true,
        });
        setTimeout(() => {
          this.setState({ joined: true, transition: false });
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
                ? "This hub will be activated when at least 100 members have pledge to contribute content. Join this hub to show your support."
                : "Thank you for joining this hub! This hub will be activated when at least 100 members have pledge to contribute content."}
            </div>
            <Message />
            <div className={css(styles.progressContainer)}>
              <div className={css(styles.status, styles.text)}>
                {progress} out of 100 researchers have pledged to launch this
                community
              </div>
              <div className={css(styles.progressBar)}>
                <Progress completed={progress} />
              </div>
              <p className={css(styles.footer, styles.text)}>
                {100 - progress} members to go
              </p>
            </div>
            <div className={css(styles.buttonsRow)}>
              <Button
                isWhite={true}
                label={"Invite People"}
                customButtonStyle={styles.button}
                onClick={() => this.props.openInviteToHubModal(true)}
              />
              <Button
                label={joined ? "Leave Hub" : "Join Hub"}
                customButtonStyle={styles.button}
                onClick={this.hubAction}
              />
            </div>
          </div>
        </div>
        <div className={css(styles.sidebarContainer)}>
          <div className={css(styles.sidebar)}>
            <HubsList
              overrideStyle={styles.hublist}
              label={"Related Hubs"}
              exclude={this.props.hubName}
            />
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
    alignItems: "center",
    backgroundColor: "#FCFCFC",
    minHeight: 800,
  },
  sidebarContainer: {
    width: 297,
    height: 633,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 30,
  },
  sidebar: {
    width: 297,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#FFF",
    border: "1px solid #EDEDED",
  },
  contentContainer: {
    height: 633,
    width: 953,
    // marginTop: 60,
    backgroundColor: "#FFF",
    border: "1px solid #EDEDED",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: 480,
    height: 316,
    opacity: 0,
  },
  reveal: {
    opacity: 1,
    transition: "all ease-in 0.3s",
  },
  text: {
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 33,
    fontWeight: 400,
    textTransform: "capitalize",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 300,
    marginTop: -20,
    color: "#4f4d5f",
    transition: "all ease-in-out 0.3s",
  },
  transition: {
    opacity: 0,
  },
  status: {
    fontSize: 18,
    fontWeight: 400,
    marginBottom: 20,
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
    bottom: 0,
    right: 0,
  },
  buttonsRow: {
    display: "flex",
    justifyContent: "space-between",
    width: 379,
  },
  button: {
    width: 180,
    height: 55,
  },
  hublist: {
    padding: "40px 15px 40px 15px",
  },
});

const mapStateToProps = (state) => ({
  message: state.message,
  hubs: state.hubs,
});

const mapDispatchToProps = {
  openInviteToHubModal: ModalActions.openInviteToHubModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockedHubPage);
