import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import * as Sentry from "@sentry/browser";
import { withAlert } from "react-alert";

// Component
import Button from "../Form/Button";
import PermissionNotificationWrapper from "../../components/PermissionNotificationWrapper";

// Redux
import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { HubActions } from "~/redux/hub";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

class HubCard extends React.Component {
  constructor(props) {
    super(props);
    this.linkRef = React.createRef();
    this.state = {
      transition: false,
    };
  }

  componentDidMount = () => {
    const { hub, hubState } = this.props;
    let subscribed = hubState.subscribedHubs ? hubState.subscribedHubs : [];
    let subscribedHubs = {};
    subscribed.forEach((hub) => {
      subscribedHubs[hub.id] = true;
    });
    this.setState({
      subscribed: subscribedHubs[hub.id],
      subCount: this.props.hub.subscriber_count,
    });
  };

  componentDidUpdate(prevProps) {
    const { user, hub, hubState } = this.props;
    if (prevProps.auth.user !== user) {
      let subscribed = hubState.subscribedHubs ? hubState.subscribedHubs : [];
      let subscribedHubs = {};
      subscribed.forEach((hub) => {
        subscribedHubs[hub.id] = true;
      });
      this.setState({
        subscribed: subscribedHubs[hub.id],
      });
    }
  }

  updateSubscription = (subscribing) => {
    const { hub, hubState, updateSubscribedHubs } = this.props;
    let subscribedHubs = [];
    if (subscribing) {
      subscribedHubs = JSON.parse(JSON.stringify(hubState.subscribedHubs));
      subscribedHubs.push(hub);
    } else {
      subscribedHubs = hubState.subscribedHubs.filter(
        (item) => item.id !== hub.id
      );
    }
    updateSubscribedHubs(subscribedHubs);
  };

  subscribeToHub = () => {
    const { hub, showMessage, setMessage, hubState } = this.props;
    const subscribed = this.state.subscribed;
    showMessage({ show: false });
    this.setState({ transition: true }, () => {
      let config = API.POST_CONFIG();
      if (subscribed) {
        return fetch(API.HUB_UNSUBSCRIBE({ hubId: hub.id }), config)
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            this.updateSubscription(false);
            setMessage("Unsubscribed!");
            showMessage({ show: true });
            this.setState((state, props) => {
              return {
                transition: false,
                subscribed: false,
                subCount: state.subCount - 1,
              };
            });
          })
          .catch((error) => {
            if (error.response.status === 429) {
              this.props.openRecaptchaPrompt(true);
            } else {
              Sentry.captureException(error);
            }
          });
      } else {
        return fetch(API.HUB_SUBSCRIBE({ hubId: hub.id }), config)
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            this.updateSubscription(true);
            setMessage("Subscribed!");
            showMessage({ show: true });
            this.setState((state, props) => {
              return {
                transition: false,
                subscribed: true,
                subCount: state.subCount + 1,
              };
            });
          })
          .catch((error) => {
            if (error.response.status === 429) {
              this.props.openRecaptchaPrompt(true);
            } else {
              Sentry.captureException(error);
            }
          });
      }
    });
  };

  removeHubConfirmation = () => {
    this.props.alert.show({
      text: `Remove this hub and all of its papers?`,
      buttonText: "Yes",
      onClick: () => {
        this.removeHub();
      },
    });
  };

  removeHub = () => {
    fetch(API.CENSOR_HUB({ hubId: this.props.hub.id }), API.DELETE_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        // remove
      });
  };

  onMouseEnterSubscribe = () => {
    this.setState({
      subscribeHover: true,
    });
  };

  onMouseExitSubscribe = () => {
    this.setState({
      subscribeHover: false,
    });
  };

  renderSubscribe = () => {
    const hub = this.props.hub;
    const subscribed = this.state.subscribed;
    if (!this.props.auth.isLoggedIn) return;
    let buttonStyle, buttonLabel;
    if (subscribed) {
      buttonStyle = this.state.subscribeHover
        ? styles.unsubscribeButton
        : styles.subscribed;
      buttonLabel = this.state.subscribeHover ? "Unsubscribe" : "Subscribed";
    } else {
      buttonStyle = styles.subscribeButton;
      buttonLabel = "Subscribe";
    }
    return (
      <button
        className={css(buttonStyle)}
        onMouseEnter={this.onMouseEnterSubscribe}
        onMouseLeave={this.onMouseExitSubscribe}
        onClick={(e) => {
          e.stopPropagation();
          this.subscribeToHub();
        }}
      >
        {buttonLabel}
      </button>
    );
  };

  renderEdit = () => {
    if (this.props.auth.isLoggedIn) {
      return (
        <button
          className={css(styles.editButton)}
          onClick={(e) => {
            e.stopPropagation();
            this.openEditHubModal();
          }}
        >
          <span className={css(styles.editIcon)}>{icons.editHub}</span>
        </button>
      );
    }
  };

  renderDelete = () => {
    if (this.props.auth.isLoggedIn && this.props.user) {
      if (this.props.user.moderator) {
        return (
          <button
            className={css(styles.deleteButton)}
            onClick={(e) => {
              e.stopPropagation();
              this.removeHubConfirmation();
            }}
          >
            <span className={css(styles.deleteIcon)}>{icons.trash}</span>
          </button>
        );
      }
    }
  };

  openEditHubModal = () => {
    this.props.openEditHubModal(true, this.props.hub);
  };

  render() {
    const { hub } = this.props;
    return (
      <div
        className={css(styles.slugLink)}
        onClick={() => {
          this.linkRef.current.click();
        }}
      >
        <div className={css(styles.hubCard)}>
          <img
            loading="lazy"
            className={css(styles.roundedImage)}
            src={
              hub.hub_image
                ? hub.hub_image
                : "/static/background/twitter-banner.jpg"
            }
            alt="Hub Background Image"
          ></img>
          {this.renderEdit()}
          {this.renderDelete()}
          <div key={hub.id} className={css(styles.hubInfo)}>
            <div className={css(styles.hubTitle)}>
              <div className={css(styles.hubName)}>{hub.name}</div>
              {this.renderSubscribe()}
            </div>
            <div className={css(styles.hubDescription)}>{hub.description}</div>
            <div className={css(styles.hubStats)}>
              <div>
                <span className={css(styles.statIcon)}>{icons.paper}</span>
                {hub.paper_count} Paper
                {hub.paper_count != 1 ? "s" : ""}
              </div>
              <div>
                <span className={css(styles.statIcon)}>{icons.chat}</span>
                {hub.discussion_count} Comment
                {hub.discussion_count != 1 ? "s" : ""}
              </div>
              <div>
                <span className={css(styles.statIcon)}>
                  {icons.subscribers}
                </span>
                {this.state.subCount} Subscriber
                {this.state.subCount != 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <Link
            href="/hubs/[slug]"
            as={`/hubs/${encodeURIComponent(hub.slug)}`}
            key={`hub_${hub.id}`}
          >
            <a ref={this.linkRef}></a>
          </Link>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  slugLink: {
    zIndex: 1,
    cursor: "pointer",
    textDecoration: "none",
    width: "364px",
    height: "264px",
    marginTop: 25,
    marginBottom: 25,
    marginLeft: 21,
    marginRight: 21,
    transition: "transform 0.1s",
    ":hover": {
      transition: "transform 0.1s",
      transform: "scale(1.05)",
    },
    "@media only screen and (max-width: 415px)": {
      zoom: 0.9,
    },
    "@media only screen and (max-width: 376px)": {
      zoom: 0.8,
    },
    "@media only screen and (max-width: 321px)": {
      zoom: 0.7,
    },
  },
  hubCard: {
    fontSize: "16px",
    color: "#241F3A",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(93, 83, 254, 0.18)",
    marginBottom: 50,
  },
  roundedImage: {
    borderRadius: "8px 8px 0 0",
    width: "364px",
    height: "128px",
    objectFit: "cover",
    pointerEvents: "none",
  },
  hubInfo: {
    boxSizing: "border-box",
    padding: "0 15px",
  },
  hubTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "10px 0 0 0",
  },
  hubName: {
    fontSize: 18,
    textTransform: "capitalize",
    fontWeight: 500,
    width: "240px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "pre",
  },
  subscribeButton: {
    height: 20,
    width: 80,
    border: `${colors.BLUE()} 1px solid`,
    backgroundColor: colors.BLUE(),
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    borderRadius: 5,
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    userSelect: "none",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  unsubscribeButton: {
    height: 20,
    width: 80,
    color: "#fff",
    backgroundColor: colors.RED(1),
    border: `${colors.RED(1)} 1px solid`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    borderRadius: 5,
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    userSelect: "none",
  },
  subscribed: {
    height: 20,
    width: 80,
    border: `${colors.BLUE()} 1px solid`,
    color: colors.BLUE(),
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    borderRadius: 5,
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    userSelect: "none",
  },
  permissionWrapper: {
    position: "none",
  },
  editButton: {
    height: 30,
    width: 30,
    borderRadius: "50%",
    border: "#fff 1px solid",
    background: "#fff",
    color: "#241F3A",
    opacity: 0.5,
    fontWeight: 400,
    fontSize: 16,
    cursor: "pointer",
    position: "absolute",
    right: 10,
    top: 10,
    ":hover": {
      opacity: 1,
    },
  },
  editIcon: {
    marginLeft: 1,
  },
  deleteButton: {
    height: 30,
    width: 30,
    borderRadius: "50%",
    border: "#fff 1px solid",
    background: "#fff",
    color: colors.RED(),
    opacity: 0.5,
    fontWeight: 400,
    fontSize: 16,
    cursor: "pointer",
    position: "absolute",
    right: 45,
    top: 10,
    ":hover": {
      opacity: 1,
    },
  },
  hubDescription: {
    fontSize: 13,
    padding: "10px 0 0 0",
    marginBottom: "10px",
    opacity: "0.8",
    overflow: "hidden",
    position: "relative",
    width: 334,
    height: "60px",
    overflowWrap: "break-word",
  },
  fade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    margin: 0,
    padding: "15px 0",
    backgroundImage: "linear-gradient(to bottom, transparent, white)",
  },
  hubStats: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "0 0 15px 0",
    color: "#C1C1CF",
    fontSize: "12px",
  },
  statIcon: {
    marginRight: "5px",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
  hubState: state.hubs,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateSubscribedHubs: HubActions.updateSubscribedHubs,
  openEditHubModal: ModalActions.openEditHubModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(HubCard));
