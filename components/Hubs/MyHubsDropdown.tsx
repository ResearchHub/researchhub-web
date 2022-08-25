import DropdownButton from "~/components/Form/DropdownButton";
import colors from "~/config/themes/colors";
import { useMemo } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";
import icons from "~/config/themes/icons";

const HubSelector = ({ hubState, isOpen = false }) => {
  const renderDropdownOpt = (hub) => {
    return (
      <Link href={`/hubs/${hub.slug}`}>
        <a className={css(styles.hubOpt)}>
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
      <div className={css(styles.hubsList)}>
        {hubOpts}
      </div>
      <div className={css(styles.configure)}>
        <span className={css(styles.configureBtn)}>
          <span className={css(styles.configureBtnIcon)}>{icons.plusThick}</span>
          <span className={css(styles.configureBtnLabel)}>Hub</span>
        </span>
        <span className={css(styles.configureBtn)}>
          <span className={css(styles.configureBtnIcon)}>{icons.pen}</span>
          <span className={css(styles.configureBtnLabel)}>Edit</span>
        </span>        

      </div>
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
  },
  configure: {
    display: "flex",
    paddingTop: 15,
    borderTop: `1px solid`
  },
  hubsList: {
    height: 200,
    overflowY: "scroll",
  },
  configureBtn: {
    display: "flex",
    padding: "5px 5px",
    marginBottom: 10,
    // background: colors.GREY(0.4),
    borderRadius: 4,
    paddingLeft: 10,
    paddingRight: 10,
    width: "50%",
    marginLeft: 5,
    marginRight: 5,
    border: `1px solid ${colors.NEW_BLUE()}`,
    ":last-child": {
      marginLeft: "auto"
    },
  },
  configureBtnIcon: {
    marginLeft: 10,
  },
  configureBtnLabel: {
    marginLeft: 18,
    fontWeight: 500,
  },  
  hubDetails: {

  },
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
    border: "1px solid #ededed",
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
    }
  },
});

const mapStateToProps = (state) => ({
  hubState: state.hubs,
});

export default connect(mapStateToProps, null)(HubSelector);
