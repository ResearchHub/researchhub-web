import DropdownButton from "~/components/Form/DropdownButton";
import colors from "~/config/themes/colors";
import { useMemo } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";

const HubSelector = ({ hubState, isOpen = false }) => {
  const renderDropdownOpt = (hub) => {
    return (
      <Link href={`/hubs/${hub.slug}`}>
        <a className={css(styles.hubLink)}>
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
        </a>
      </Link>
    )
  };

  const hubOpts = useMemo(() => {
    const myHubsOpts = (hubState.subscribedHubs || []).map((h) => renderDropdownOpt(h))
    return myHubsOpts;
  }, [hubState.subscribedHubs]);

  return (
    <div className={css(styles.myHubsDropdown)}>
      {hubOpts}
    </div>
  );
};

const styles = StyleSheet.create({
  myHubsDropdown: {
    position: "absolute",
    background: "white",
    top: 30,
    left: 0,
    width: 150,
    zIndex: 5,
    padding: 5,
    boxShadow: "rgb(0 0 0 / 15%) 0px 0px 10px 0px",    
  },
  hubDetails: {

  },
  hubName: {
    textTransform: "capitalize",
    fontWeight: 400,
  },
  hubImage: {
    height: 35,
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: colors.LIGHT_GREY(),
    border: "1px solid #ededed",
  },
  hubLink: {
    textDecoration: "none",
    color: colors.BLACK(),
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
  },
});

const mapStateToProps = (state) => ({
  hubState: state.hubs,
});

export default connect(mapStateToProps, null)(HubSelector);
