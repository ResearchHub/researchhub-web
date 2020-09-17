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
            className={css(styles.roundedImage)}
            src={hub.hub_image}
            alt="Hub Background Image"
          ></img>
          <div key={hub.id} className={css(styles.hubInfo)}>
            <div className={css(styles.hubTitle)}>
              <div className={css(styles.title)}>{hub.name}</div>
              <Button
                isWhite={false}
                label={"Subscribe"}
                customButtonStyle={styles.subscribeButton}
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
                {1} Subscribers
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

const styles = StyleSheet.create({
  // TODO:
  // left for reference in the future
  hubEntry: {
    fontSize: 18,
    borderRadius: "15px",
    color: "#241F3A",
    padding: "0 0 10px 0",
    textTransform: "capitalize",
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(1),
    },
    "@media only screen and (max-width: 775px)": {
      fontSize: 16,
    },
    boxShadow: "0 4px 15px rgba(93, 83, 254, 0.18)",
  },
  slugLink: {
    textDecoration: "none",
    filter: "drop-shadow(0 4px 15px rgba(93, 83, 254, 0.18))",
  },
  title: {
    fontSize: 33,
    fontWeight: 500,
    marginRight: 30,
    color: "#232038",
    cursor: "default",
    userSelect: "none",
  },
  roundedImage: {
    borderRadius: "8px 8px 0 0",
    width: "430px",
    height: "155px",
    objectFit: "cover",
  },
  button: {
    height: 45,
    width: 140,
    border: `${colors.BLUE()} 1px solid`,
  },
  subscribeButton: {
    height: 23,
    width: 95,
    border: `${colors.BLUE()} 1px solid`,
    position: "relative",
    marginTop: "3px",
  },
  title: {
    fontSize: "25px",
    textTransform: "capitalize",
    fontWeight: 500,
  },
  hubInfo: {
    boxSizing: "border-box",
    width: "430px",
    padding: "0 15px",
  },
  hubCard: {
    borderRadius: "8px",
    color: "#241F3A",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(93, 83, 254, 0.18)",
    transition: "transform 0.1s",
    fontSize: "16px",
    ":hover": {
      transition: "transform 0.1s",
      transform: "scale(1.05)",
    },
  },
  hubStats: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "10px 0 10px 0",
    color: "#C1C1CF",
    fontSize: "14px",
  },
  hubTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "10px 0 0 0",
  },
  hubDescription: {
    height: "90px",
    padding: "10px 0 0 0",
    // Might want to use span to apply opacity only to text
    opacity: "0.8",
  },
  statIcon: {
    marginRight: "5px",
  },
});

export default HubCard;
