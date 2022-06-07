import { ReactElement, useState } from "react";
import { Hub } from "~/config/types/hub";
import { CreatedBy } from "~/config/types/root_types";
import AuthorAvatar from "../AuthorAvatar";
import HubDropDown from "../Hubs/HubDropDown";
import { timeSince } from "~/config/utils/dates";
import { toTitleCase } from "~/config/utils/string";
import { StyleSheet, css } from "aphrodite";
import ALink from "../ALink";
import colors from "~/config/themes/colors";

type Args = {
  createdBy: CreatedBy|null,
  hubs: Array<Hub>,
  createdDate: string,
  avatarSize: number,
};

function SubmissionDetails({
  createdBy,
  hubs,
  createdDate,
  avatarSize = 30,
}: Args): ReactElement<"div"> {
  const [isHubsDropdownOpen, setIsHubsDropdownOpen] = useState(false);
  const visibleHubs = hubs.slice(0,3);
  const hiddenHubs = hubs.slice(3);

  return (
    <div className={css(styles.submittedBy)}>
      <div className={css(styles.createdByContainer)}>
        <AuthorAvatar author={createdBy?.authorProfile} size={avatarSize} trueSize />
      </div>
      <div className={css(styles.submittedByDetails)}>
        <ALink href={`/user/${createdBy?.authorProfile?.id}/overview`} overrideStyle={styles.link}>
          {createdBy?.authorProfile?.firstName || "Deleted"}{" "}
          {createdBy?.authorProfile?.lastName || "User"}
        </ALink>
        <div className={css(styles.hubsContainer)}>
            <>
              <span
                className={css(styles.textSecondary, styles.postedText)}
              >{` posted`}{visibleHubs.length > 0 ? ` in` : ""}</span>
              {visibleHubs.map((h, index) => (
                <>
                  <ALink
                    theme="blankAndBlue"
                    href={`/hubs/${h.slug}`}
                    overrideStyle={styles.hubLink}
                  >
                    {toTitleCase(h.name)}
                  </ALink>
                  {index < visibleHubs?.length - 1 ? ", " : ""}
                </>
              ))}
              &nbsp;
              {hiddenHubs.length > 0 && (
                <HubDropDown
                  hubs={hiddenHubs}
                  labelStyle={styles.hubLink}
                  containerStyle={styles.hubDropdownContainer}
                  isOpen={isHubsDropdownOpen}
                  setIsOpen={() => setIsHubsDropdownOpen(!isHubsDropdownOpen)}
                />
              )}
            </>
        </div>
        <span className={css(styles.dot)}> • </span>
        <span className={css(styles.textSecondary, styles.timestamp)}>
          {timeSince(createdDate)}
        </span>
      </div>
    </div>      
  )
}

const styles = StyleSheet.create({
  submittedBy: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "21px",
  },
  submittedByDetails: {
    display: "block",
  },
  postedText: {
  },
  createdByContainer: {
    marginRight: 7,
  },
  link: {
    cursor: "pointer",
    fontWeight: 400,
    ":hover": {
      color: colors.NEW_BLUE(),
    }    
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
    color: colors.MEDIUM_GREY(),
  },  
  hubsContainer: {
    display: "inline",
  },  
  hubDropdownContainer: {
    display: "inline-block",
  },  
  dot: {
    color: colors.MEDIUM_GREY(),
  },  
});

export default SubmissionDetails;