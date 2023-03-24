import colors from "~/config/themes/colors";
import { useMemo } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

import { breakpoints } from "~/config/themes/screen";

type Args = {
  hubState?: any;
  isOpen?: boolean;
};

const MyHubsDropdown = ({ hubState, isOpen = false }: Args) => {
  const renderDropdownOpt = (hub) => {
    return (
      <Link
        href={`/hubs/${hub.slug}`}
        key={hub.id}
        className={css(styles.hubOpt)}
      >
        <img
          className={css(styles.hubImage)}
          src={
            hub.hub_image
              ? hub.hub_image
              : "/static/background/hub-placeholder.svg"
          }
          alt={hub.name}
        />
        <div className={css(styles.hubDetails)}>
          <div className={css(styles.hubName)}>{hub.name}</div>
        </div>
      </Link>
    );
  };

  const hubOpts = useMemo(() => {
    const myHubsOpts = (hubState.subscribedHubs ?? []).map((h) =>
      renderDropdownOpt(h)
    );
    return myHubsOpts;
  }, [hubState.subscribedHubs]);

  return (
    <div className={`${css(styles.myHubsDropdown)} myHubsDropdown`}>
      <div className={css(styles.hubsList)}>{hubOpts}</div>
      <Link href="/settings" className={css(styles.configure)}>
        <span className={css(styles.configureBtn)}>Edit Hubs</span>
      </Link>
    </div>
  );
};

const styles = StyleSheet.create({
  myHubsDropdown: {
    position: "absolute",
    background: "white",
    top: 30,
    left: 0,
    width: 270,
    zIndex: 5,
    paddingTop: 10,
    paddingBottom: 10,
    boxShadow: "rgb(0 0 0 / 15%) 0px 0px 10px 0px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: 220,
    },
  },
  configure: {
    display: "flex",
    paddingTop: 15,
    borderTop: `1px solid ${colors.GREY_LINE(1.0)}`,
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
  },
  hubsList: {
    maxHeight: 200,
    overflowY: "scroll",
  },
  configureBtn: {
    color: colors.NEW_BLUE(1.0),
    marginLeft: 18,
    fontWeight: 500,
  },
  hubDetails: {},
  hubName: {
    textTransform: "capitalize",
    fontWeight: 400,
  },
  hubImage: {
    height: 25,
    width: 25,
    minWidth: 25,
    maxWidth: 25,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: colors.LIGHT_GREY(),
  },
  hubOpt: {
    textDecoration: "none",
    color: colors.BLACK(),
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 400,
    padding: "5px 10px",
    boxSizing: "border-box",
    fontSize: 15,
    ":hover": {
      backgroundColor: colors.GREY(0.1),
    },
  },
});

export default MyHubsDropdown;
