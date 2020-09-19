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
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

function HubCard(props) {
  let { hub } = props;
  return (
    <Link
      href="/hubs/[slug]"
      as={`/hubs/${encodeURIComponent(hub.slug)}`}
      key={`hub_${hub.id}`}
    >
      <a className={css(styles.slugLink)}>
        <div className={css(styles.hubCard)}>
          <img
            loading="lazy"
            className={css(styles.roundedImage)}
            src={hub.hub_image}
            alt="Hub Background Image"
          ></img>
          <div key={hub.id} className={css(styles.hubInfo)}>
            <div className={css(styles.hubTitle)}>
              <div className={css(styles.hubName)}>{hub.name}</div>
              <Button
                isWhite={hub.user_is_subscribed}
                label={hub.user_is_subscribed ? "Subscribed" : "Subscribe"}
                customButtonStyle={styles.subscribeButton}
                customLabelStyle={styles.subscribeButtonLabel}
                hideRipples={true}
              />
            </div>
            <div className={css(styles.hubDescription)}>{hub.description}</div>
            <div className={css(styles.hubStats)}>
              <div>
                <span className={css(styles.statIcon)}>{icons.paper}</span>
                {1} Papers
              </div>
              <div>
                <span className={css(styles.statIcon)}>{icons.chat}</span>
                {1} Discussions
              </div>
              <div>
                <span className={css(styles.statIcon)}>{icons.user}</span>
                {hub.subscriber_count} Subscriber
                {hub.subscriber_count != 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
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
  subscribeButtonLabel: {
    fontSize: 12,
  },
  hubDescription: {
    fontSize: 13,
    height: "70px",
    padding: "10px 0 0 0",
    // Might want to use span to apply opacity only to text
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

export default HubCard;
