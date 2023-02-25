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
import { breakpoints } from "~/config/themes/screen";
import Bounty from "~/config/types/bounty";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { genClientId } from "~/config/utils/id";
import ReactDOMServer from 'react-dom/server';
import icons from "~/config/themes/icons";
import Button from "../Form/Button";

type Args = {
  createdBy: CreatedBy | null;
  hubs: Array<Hub>;
  createdDate: string;
  avatarSize?: number;
  bounties?: Bounty[];
  actionLabel?: string | ReactElement;
};

function SubmissionDetails({
  createdBy,
  hubs,
  createdDate,
  avatarSize = 30,
  bounties = [],
  actionLabel = "posted in",
}: Args): ReactElement<"div"> {
  const cuid = genClientId()
  const showAllHubs =
    process.browser && window.innerWidth > breakpoints.medium.int;

  const [isHubsDropdownOpen, setIsHubsDropdownOpen] = useState(false);

  let sliceIndex = 1;
  if (showAllHubs) {
    sliceIndex = 3;
  }
  const visibleHubs = hubs?.slice(0, sliceIndex) ?? [];
  const hiddenHubs = hubs?.slice(sliceIndex) ?? [];

  const bounty = bounties?.[0];
  const authorProfile = createdBy?.authorProfile;
  authorProfile.profileImage = "https://researchhub-paper-prod.s3.amazonaws.com/uploads/author_profile_images/2022/07/29/blob?AWSAccessKeyId=AKIA3RZN3OVNPLBMN3JX&Signature=OhpUk3T%2FTG0uSLAPnQTZdnqnHWk%3D&Expires=1677892447"
  const _twoDaysInMinutes = 2*24*60;
  return (
    <div className={css(styles.submittedBy)}>

      <ReactTooltip
        anchorSelect={`.some-tooltip-${cuid}`}
        noArrow={true}
        clickable={true}
        delayShow={350}
        style={{
          zIndex: 2, width: 300, fontSize: 14, padding: 15, background: "white", color: "black", opacity: "1", border: "1px solid rgb(232, 232, 239)", boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px", textTransform: "none"
        
        
        }}
      />
      <div 
        style={{
          
          display: "flex",
          columnGap: "3px",
          alignItems: "center",
          fontSize: 14,
          lineHeight: "21px",
        
        }}
        className={`some-tooltip-${cuid}`}
        data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
          <div style={{}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
              <img height={90} width={90} src="https://researchhub-paper-prod.s3.amazonaws.com/uploads/author_profile_images/2022/07/29/blob?AWSAccessKeyId=AKIA3RZN3OVNPLBMN3JX&Signature=OhpUk3T%2FTG0uSLAPnQTZdnqnHWk%3D&Expires=1677892447" />
            </div>
            {/* <div style={{borderBottom: "1px solid rgb(232, 232, 239)", marginBottom: 15,marginTop: 15,}} /> */}
            <div style={{ marginTop: 15, marginBottom: 5, fontSize: 18, fontWeight: 500}}>Cole Delyea</div>
            <div>
              Biotech Industry Scientist and Creator of Investigate Explore Discover
            </div>

            <div style={{lineHeight: "24px"}}>
            <div style={{display: "flex", columnGap: "5px", alignItems: "center", marginTop: 5}}>
              <div style={{display: "flex", columnGap: "5px"}}>
                <img
                  height={20}
                  src="/static/icons/editor-star.png"
                  width={20}
                  className={css(styles.editorImg)}
                />
                Editor of
              </div>
              <div>
                <ALink theme="solidPrimary" href="">Immunology</ALink>
              </div>
            </div>

            <div style={{display: "flex", columnGap: "5px", alignItems: "center"}}>
              <div style={{color: "#BCBAC2"}}>{icons.graduationCap}</div>
              Immunology MS '21, University of Alberta
            </div>

            <div style={{display: "flex", columnGap: "5px", alignItems: "center"}}>
              <img
                src="/static/ResearchHubIcon.png"
                className={css(styles.rhIcon)}
                height={20}
                style={{marginRight: 5}}
                alt="reserachhub-icon"
              />              
              <div>Lifetime reputation: 315</div>
            </div>
            </div>

            <div style={{marginTop: 15}}>
            <Button  hideRipples={true} fullWidth={true}>
                View profile
            </Button>
            </div>
          </div>
        )}>
      
          


      <div className={css(styles.createdByContainer)}>
        <AuthorAvatar author={authorProfile} size={avatarSize} trueSize />
      </div>
      <div className={css(styles.submittedByDetails)}>
        {authorProfile?.firstName || authorProfile?.lastName ? (
          <ALink
            href={`/user/${authorProfile?.id}/overview`}
            key={`/user/${authorProfile?.id}/overview-key`}
            overrideStyle={styles.link}
          >
            {/* {authorProfile?.firstName} {authorProfile?.lastName} */}
            Cole Delyea
          </ALink>
        ) : (
          <span style={{ color: colors.BLACK(1.0) }}>Anonymous</span>
        )}
        </div>

        <div className={css(styles.hubsContainer)}>
          <>
            <span className={css(styles.textSecondary, styles.postedText)}>
              {` `}
              {actionLabel}
            </span>
            {visibleHubs.map((h, index) => (
              <span key={index}>
                <ALink
                  key={`/hubs/${h.slug ?? ""}-index`}
                  theme="blankAndBlue"
                  href={`/hubs/${h.slug}`}
                  overrideStyle={styles.hubLink}
                >
                  {toTitleCase(h.name)}
                </ALink>
                {index < visibleHubs?.length - 1 ? "," : ""}
              </span>
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
          </>
        </div>
        <span className={css(styles.dot, styles.dotWithMargin)}> • </span>
        <span className={css(styles.textSecondary, styles.timestamp)}>
          {timeSince(createdDate)}
          {bounty && bounty.timeRemainingInMinutes <= _twoDaysInMinutes && bounty.timeRemainingInMinutes > 0 && (
            <span className={css(styles.expiringSoon)}>
              <span className={css(styles.dot, styles.dotWithMargin)}> • </span>
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
    display: "inline",
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
