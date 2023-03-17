import { ReactElement, useEffect, useState } from "react";
import { Hub } from "~/config/types/hub";
import { RHUser } from "~/config/types/root_types";
import AuthorAvatar from "../AuthorAvatar";
import HubDropDown from "../Hubs/HubDropDown";
import { timeSince } from "~/config/utils/dates";
import { toTitleCase } from "~/config/utils/string";
import { StyleSheet, css } from "aphrodite";
import ALink from "../ALink";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Bounty from "~/config/types/bounty";
import UserTooltip from "../Tooltips/User/UserTooltip";

type Args = {
  createdBy: RHUser | null;
  hubs: Array<Hub>;
  createdDate: string;
  avatarSize?: number;
  bounties?: Bounty[];
  actionLabel?: string | ReactElement;
  overrideSubmittedBy?: any;
};

function SubmissionDetails({
  createdBy,
  hubs,
  createdDate,
  avatarSize = 30,
  overrideSubmittedBy,
  bounties = [],
  actionLabel = "posted in",
}: Args): ReactElement<"div"> {
  const [isHubsDropdownOpen, setIsHubsDropdownOpen] = useState(false);
  const [showAllHubs, setShowAlHubs] = useState(false);

  useEffect(() => {
    setShowAlHubs(window.innerWidth > breakpoints.medium.int);
  }, []);

  let sliceIndex = 1;
  if (showAllHubs) {
    sliceIndex = 3;
  }
  const visibleHubs = hubs?.slice(0, sliceIndex) ?? [];
  const hiddenHubs = hubs?.slice(sliceIndex) ?? [];

  const bounty = bounties?.[0];
  const authorProfile = createdBy?.authorProfile;
  const _twoDaysInMinutes = 2 * 24 * 60;

  return (
    <div className={css(styles.submittedBy, overrideSubmittedBy)}>
      <UserTooltip
        createdBy={createdBy}
        targetContent={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: 4,
            }}
          >
            <ALink
              href={`/user/${authorProfile?.id}/overview`}
              key={`/user/${authorProfile?.id}/overview-key`}
              overrideStyle={styles.link}
            >
              <>
                <div className={css(styles.createdByContainer)}>
                  <AuthorAvatar
                    author={authorProfile}
                    size={avatarSize}
                    trueSize
                  />
                </div>
                <div className={css(styles.submittedByDetails)}>
                  {authorProfile?.firstName || authorProfile?.lastName ? (
                    `${authorProfile?.firstName} ${authorProfile?.lastName}`
                  ) : (
                    <span style={{ color: colors.BLACK(1.0) }}>Anonymous</span>
                  )}
                  {` `}
                </div>
              </>
            </ALink>
          </div>
        }
      />

      <div className={css(styles.hubsContainer)}>
        <div className={css(styles.textSecondary, styles.postedText)}>
          {` `}
          {actionLabel}
        </div>
        {visibleHubs.map((h, index) => (
          <div key={index}>
            <ALink
              key={`/hubs/${h.slug ?? ""}-index`}
              theme="blankAndBlue"
              href={`/hubs/${h.slug}`}
              overrideStyle={styles.hubLink}
            >
              {toTitleCase(h.name)}
            </ALink>
            {index < visibleHubs?.length - 1 ? "," : ""}
          </div>
        ))}
        {hiddenHubs.length > 0 && (
          <HubDropDown
            hubs={hiddenHubs}
            labelStyle={styles.hubLink}
            containerStyle={styles.hubDropdownContainer}
            isOpen={isHubsDropdownOpen}
            setIsOpen={(isOpen) => setIsHubsDropdownOpen(isOpen)}
          />
        )}
      </div>
      <div className={css(styles.submittedByDetails)}>
        <span className={css(styles.dot, styles.dotWithMargin)}> • </span>
        <span className={css(styles.textSecondary, styles.timestamp)}>
          {timeSince(createdDate)}
          {bounty &&
            bounty.timeRemainingInMinutes <= _twoDaysInMinutes &&
            bounty.timeRemainingInMinutes > 0 && (
              <span className={css(styles.expiringSoon)}>
                <span className={css(styles.dot, styles.dotWithMargin)}>
                  {" "}
                  •{" "}
                </span>
                bounty ending in {bounty.timeRemaining}
              </span>
            )}
        </span>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  submittedBy: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "21px",
    flexWrap: "wrap",
  },
  submittedByDetails: {
    display: "block",
  },
  postedText: {},
  createdByContainer: {
    marginRight: 7,
  },
  link: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontWeight: 400,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  hubLink: {
    textTransform: "capitalize",
    marginLeft: 5,
    fontWeight: 400,
  },
  timestamp: {
    marginLeft: 2,
  },
  textSecondary: {
    color: colors.MEDIUM_GREY2(),
  },
  hubsContainer: {
    display: "flex",
    // display: "inline",
    // alignItems: "center",
  },
  hubDropdownContainer: {
    display: "inline-block",
  },
  dot: {
    color: colors.MEDIUM_GREY2(),
  },
  dotWithMargin: {
    marginLeft: 5,
    marginRight: 5,
  },
  rscIcon: {
    verticalAlign: "text-top",
    marginLeft: 5,
  },
  rscText: {
    fontWeight: 600,
    color: colors.ORANGE_DARK2(1),
    marginRight: 5,
    marginLeft: 2,
  },
  expiringSoon: {
    color: colors.RED(),
  },
});

export default SubmissionDetails;
