import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import Link from "next/link";

import colors from "~/config/themes/colors";

const HubCard = (props) => {
  const { last, index, hub } = props;
  const { name, slug, hub_image, id } = hub;

  return (
    <Ripples
      className={css(styles.hubEntry, last && styles.last)}
      key={`${id}-${index}`}
    >
      <Link
        href={{
          pathname: "/hubs/[slug]",
          query: {
            name: `${hub.name}`,

            slug: `${encodeURIComponent(hub.slug)}`,
          },
        }}
        as={`/hubs/${encodeURIComponent(hub.slug)}`}
      >
        <a className={css(styles.hubLink)}>
          <img
            className={css(styles.hubImage)}
            src={
              hub_image ? hub_image : "/static/background/hub-placeholder.svg"
            }
            alt={hub.name}
          />
          <span className={"clamp1"}>{name}</span>
        </a>
      </Link>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  hubEntry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    height: 60,
    borderLeft: "3px solid #FFF",
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
    },
    ":active": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
    ":focus": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  last: {
    opacity: 1,
    borderBottom: "none",
  },
  hubImage: {
    height: 35,
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: "#EAEAEA",
    border: "1px solid #ededed",
  },
  hubLink: {
    textDecoration: "none",
    color: "#111",
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    padding: "10px 20px 10px 17px",
  },
});

export default HubCard;
