import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Component
import Loader from "~/components/Loader/Loader";
import Button from "../Form/Button";

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
      ...this.props.hub,
    };
  }

  subscribeToHub = () => {
    const { showMessage, setMessage, updateHub, hubState } = this.props;
    showMessage({ show: false });
    this.setState({ transition: true }, () => {
      let config = API.POST_CONFIG();
      return fetch(API.HUB_SUBSCRIBE({ hubId: this.state.id }), config)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          updateHub(hubState, { ...res });
          setMessage("Subscribed!");
          showMessage({ show: true });
          this.setState({
            transition: false,
            user_is_subscribed: true,
          });
        })
        .catch((err) => {
          if (err.response.status === 429) {
            this.props.openRecaptchaPrompt(true);
          }
        });
    });
  };

  render() {
    const {
      description,
      id,
      hub_image,
      user_is_subscribed,
      name,
      paper_count,
      subscriber_count,
      slug,
      discussion_count,
    } = this.state;
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
            src={hub_image}
            alt="Hub Background Image"
          ></img>
          <div key={id} className={css(styles.hubInfo)}>
            <div className={css(styles.hubTitle)}>
              <div className={css(styles.hubName)}>{name}</div>
              {user_is_subscribed ? (
                <div className={css(styles.subscribed)}>Subscribed</div>
              ) : (
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
              )}
            </div>
            <div className={css(styles.hubDescription)}>{description}</div>
            <div className={css(styles.hubStats)}>
              <div>
                <span className={css(styles.statIcon)}>{icons.paper}</span>
                {paper_count} Paper
                {paper_count != 1 ? "s" : ""}
              </div>
              <div>
                <span className={css(styles.statIcon)}>{icons.chat}</span>
                {discussion_count} Discussion
                {discussion_count != 1 ? "s" : ""}
              </div>
              <div>
                <span className={css(styles.statIcon)}>{icons.user}</span>
                {subscriber_count} Subscriber
                {subscriber_count != 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
        <Link
          href="/hubs/[slug]"
          as={`/hubs/${encodeURIComponent(slug)}`}
          key={`hub_${id}`}
        >
          <a ref={this.linkRef}></a>
        </Link>
      </div>
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
  hubState: state.hubs,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateHub: HubActions.updateHub,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubCard);
