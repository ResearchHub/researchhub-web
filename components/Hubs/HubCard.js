import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Component
import Loader from "~/components/Loader/Loader";
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
import EditHubModal from "../modal/EditHubModal";

class HubCard extends React.Component {
  constructor(props) {
    super(props);
    this.linkRef = React.createRef();
    this.state = {
      transition: false,
    };
  }

  componentDidMount = () => {
    this.setState({
      subscribed: this.props.hub.user_is_subscribed,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      fetch(API.HUB({ slug: this.props.slug }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          this.setState({
            subscribed: res.results[0].user_is_subscribed,
          });
        });
    }
  };

  subscribeToHub = () => {
    const { hub, showMessage, setMessage, updateHub, hubState } = this.props;
    showMessage({ show: false });
    this.setState({ transition: true }, () => {
      let config = API.POST_CONFIG();
      return fetch(API.HUB_SUBSCRIBE({ hubId: hub.id }), config)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          updateHub(hubState, { ...res });
          setMessage("Subscribed!");
          showMessage({ show: true });
          this.setState({
            transition: false,
            subscribed: true,
          });
        })
        .catch((err) => {
          if (err.response.status === 429) {
            this.props.openRecaptchaPrompt(true);
          }
        });
    });
  };

  renderSubscribe = () => {
    const { hub } = this.props;
    if (!this.props.isLoggedIn) return;
    if (this.state.subscribed) {
      return <div className={css(styles.subscribed)}>Subscribed</div>;
    } else {
      return (
        <Button
          isWhite={false}
          label={"Subscribe"}
          customButtonStyle={styles.subscribeButton}
          customLabelStyle={styles.subscribeButtonLabel}
          hideRipples={true}
          onClick={(e) => {
            e.stopPropagation();
            this.subscribeToHub();
          }}
        />
      );
    }
  };

  openEditHubModal = () => {
    console.log(this.props.hub);
    this.props.openEditHubModal(true, this.props.hub);
  };

  render() {
    const { hub } = this.props;
    return (
      <>
        <EditHubModal />
        <PermissionNotificationWrapper
          modalMessage="Edit the Hub"
          loginRequired={true}
          onClick={this.openEditHubModal}
        >
          <Button isWhite={true} label={"Edit the Hub"} hideRipples={true} />
        </PermissionNotificationWrapper>
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
                  : "/static/background/facebook-og.jpg"
              }
              alt="Hub Background Image"
            ></img>
            <div key={hub.id} className={css(styles.hubInfo)}>
              <div className={css(styles.hubTitle)}>
                <div className={css(styles.hubName)}>{hub.name}</div>
                {this.renderSubscribe()}
              </div>
              <div className={css(styles.hubDescription)}>
                {hub.description}
              </div>
              <div className={css(styles.hubStats)}>
                <div>
                  <span className={css(styles.statIcon)}>{icons.paper}</span>
                  {hub.paper_count} Paper
                  {hub.paper_count != 1 ? "s" : ""}
                </div>
                <div>
                  <span className={css(styles.statIcon)}>{icons.chat}</span>
                  {hub.discussion_count} Discussion
                  {hub.discussion_count != 1 ? "s" : ""}
                </div>
                <div>
                  <span className={css(styles.statIcon)}>{icons.user}</span>
                  {hub.subscriber_count} Subscriber
                  {hub.subscriber_count != 1 ? "s" : ""}
                </div>
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
      </>
    );
  }
}

const styles = StyleSheet.create({
  slugLink: {
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
    cursor: "pointer",
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
  },
  subscribeButton: {
    height: 20,
    width: 75,
    border: `${colors.BLUE()} 1px solid`,
  },
  subscribed: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 61,
    padding: "1px 6px 1px 6px",
    border: `${colors.BLUE()} 1px solid`,
    color: `${colors.BLUE()}`,
    fontSize: 13,
    borderRadius: 5,
  },
  subscribeButtonLabel: {
    fontSize: 12,
  },
  hubDescription: {
    fontSize: 13,
    height: "70px",
    padding: "10px 0 0 0",
    opacity: "0.8",
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
  isLoggedIn: state.auth.isLoggedIn,
  hubState: state.hubs,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateHub: HubActions.updateHub,
  openEditHubModal: ModalActions.openEditHubModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubCard);
