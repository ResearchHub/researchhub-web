import DropdownButton from "~/components/Form/DropdownButton";
import colors, { pillNavColors } from "~/config/themes/colors";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";
import icons, { RHLogo } from "~/config/themes/icons";

const HubSelector = ({ hubState }) => {
  const [isHubSelectOpen, setIsHubSelectOpen] = useState(false);

  const htmlAfter = (
    <div className={css(styles.htmlAfter)}>
      <div className={css(styles.links)}>
        <Link href={`/`}>
          <a className={css(styles.primaryButton)}>
            <span className={css(styles.squaresIcon)}>{icons.squares}</span>
            All
          </a>
        </Link>
        <Link href={`/my-hubs`}>
          <a className={css(styles.primaryButton)}>
            <RHLogo withText={false} iconStyle={styles.rhIcon} />
            My Hubs
          </a>
        </Link>
      </div>
    </div>
  );

  const hubOpts = hubState.topHubs.map((h) => ({
    html: (
      <Link href={`/hubs/${h.slug}`}>
        <a className={css(styles.hubLink)}>
          <img
            className={css(styles.hubImage)}
            src={
              h.hub_image
                ? h.hub_image
                : "/static/background/hub-placeholder.svg"
            }
            alt={h.name}
          />
          <div className={css(styles.hubDetails)}>
            <div className={css(styles.hubName)}>{h.name}</div>
            <div className={css(styles.hubDescription)}>{h.description}</div>
          </div>
        </a>
      </Link>
    ),
    value: h,
  }));

  return (
    <DropdownButton
      opts={hubOpts}
      htmlAfter={htmlAfter}
      label={`Hub`}
      isOpen={isHubSelectOpen}
      onClick={() => setIsHubSelectOpen(true)}
      dropdownClassName="hubSelect"
      overridePopoverStyle={styles.hubPopover}
      positions={["bottom", "right"]}
      customButtonClassName={styles.hubSelectorButton}
      overrideOptionsStyle={styles.hubPopoverOptions}
      onSelect={() => {
        return null;
      }}
      onClose={() => setIsHubSelectOpen(false)}
    />
  );
};

const styles = StyleSheet.create({
  squaresIcon: {
    marginRight: 10,
    color: colors.NEW_BLUE(),
  },
  rhIcon: {
    height: "20px",
    verticalAlign: "-4px",
    marginRight: "10px",
  },
  htmlAfter: {
    display: "block",
    padding: "10px 14px",
    boxSizing: "border-box",
    position: "fixed",
    bottom: 0,
    width: "100vw",
    zIndex: 2,
    background: "white",
  },
  hubPopoverOptions: {
    // height = options list container - fixed position htmlAfter container
    // Reason: We want to display both within the viewport's height
    height: "calc(100% - 118px)",
    overflowY: "scroll",
    paddingTop: 10,
  },
  primaryButton: {
    color: colors.NEW_BLUE(),
    border: `1px solid ${colors.GREY()}`,
    width: "100%",
    padding: "9px 10px",
    fontWeight: 400,
    fontSize: 16,
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    marginTop: 10,
    boxSizing: "border-box",
  },
  hubDetails: {},
  hubName: {
    textTransform: "capitalize",
  },
  hubDescription: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "20px",
    color: colors.BLACK(0.6),
  },
  hubPopover: {
    width: "100vw",
    boxSizing: "border-box",
    height: "90vh",
  },
  hubSelectorButton: {
    background: pillNavColors.primary.filledBackgroundColor,
    color: pillNavColors.primary.filledTextColor,
    borderRadius: 40,
    marginLeft: 8,
    ":hover": {
      background: pillNavColors.primary.filledBackgroundColor,
      color: pillNavColors.primary.filledTextColor,
      borderRadius: 40,
    },
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
    alignItems: "start",
    fontWeight: 500,
  },
});

const mapStateToProps = (state) => ({
  hubState: state.hubs,
});

export default connect(mapStateToProps, null)(HubSelector);
