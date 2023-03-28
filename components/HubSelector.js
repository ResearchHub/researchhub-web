import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrid2 } from "@fortawesome/pro-solid-svg-icons";
import DropdownButton from "~/components/Form/DropdownButton";
import colors, { pillNavColors } from "~/config/themes/colors";
import { useState, useMemo } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";

import RHLogo from "~/components/Home/RHLogo";

const HubSelector = ({ hubState }) => {
  const [isHubSelectOpen, setIsHubSelectOpen] = useState(false);

  const renderDropdownOpt = (hub) => {
    return {
      html: (
        <Link href={`/hubs/${hub.slug}`} className={css(styles.hubLink)}>
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
      ),
      value: hub,
    };
  };

  const hubOpts = useMemo(() => {
    const myHubsHeaderOpt = {
      html: (
        <Link href={`/my-hubs`} className={css(styles.primaryButton)}>
          <RHLogo withText={false} iconStyle={styles.rhIcon} />
          My Hubs
        </Link>
      ),
      value: "my-hubs",
    };

    const allHubsHeaderOpt = {
      html: (
        <Link href={`/hubs`} className={css(styles.primaryButton)}>
          <span className={css(styles.squaresIcon)}>
            {<FontAwesomeIcon icon={faGrid2}></FontAwesomeIcon>}
          </span>
          All Hubs
        </Link>
      ),
      value: "all-hubs",
    };

    const withHeaders =
      (hubState.subscribedHubs || []).length > 0 ? true : false;

    const myHubsOpts = withHeaders
      ? [
          myHubsHeaderOpt,
          ...(hubState.subscribedHubs || []).map((h) => renderDropdownOpt(h)),
        ]
      : (hubState.subscribedHubs || []).map((h) => renderDropdownOpt(h));

    const allHubsOpts = withHeaders
      ? [
          allHubsHeaderOpt,
          ...(hubState.topHubs || []).map((h) => renderDropdownOpt(h)),
        ]
      : (hubState.topHubs || []).map((h) => renderDropdownOpt(h));

    const hubOpts = [...myHubsOpts, ...allHubsOpts];
    return hubOpts;
  }, [hubState.subscribedHubs, hubState.topHubs]);

  return (
    <DropdownButton
      opts={hubOpts}
      label={`All Hubs`}
      isOpen={isHubSelectOpen}
      onClick={() => setIsHubSelectOpen(true)}
      dropdownClassName="hubSelect"
      overridePopoverStyle={styles.hubPopover}
      positions={["bottom", "right"]}
      customButtonClassName={styles.hubSelectorButton}
      overrideOptionsStyle={styles.hubPopoverOptions}
      overrideDownIconStyle={styles.downIcon}
      overrideTargetStyle={styles.overrideTargetStyle}
      onSelect={() => {
        setIsHubSelectOpen(false);
      }}
      onClose={() => setIsHubSelectOpen(false)}
    />
  );
};

const styles = StyleSheet.create({
  downIcon: {
    [`@media only screen and (max-width: 410px)`]: {
      marginLeft: 2,
    },
  },
  overrideTargetStyle: {
    [`@media only screen and (max-width: 410px)`]: {
      fontSize: 12,
      whiteSpace: "pre",
      lineHeight: "20px",
    },
  },
  squaresIcon: {
    marginRight: 10,
    color: colors.NEW_BLUE(),
  },
  rhIcon: {
    height: "20px",
    verticalAlign: "-4px",
    marginRight: "10px",
  },
  hubPopoverOptions: {
    paddingTop: 5,
  },
  primaryButton: {
    color: colors.NEW_BLUE(),
    fontWeight: 500,
    width: "100%",
    padding: "9px 10px 9px 2px",
    fontSize: 16,
    display: "block",
    textAlign: "left",
    textDecoration: "none",
    marginTop: 10,
    boxSizing: "border-box",
    borderBottom: `1px solid ${colors.NEW_BLUE()}`,
  },
  hubDetails: {},
  hubName: {
    textTransform: "capitalize",
    fontWeight: 400,
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
    fontWeight: 500,
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
