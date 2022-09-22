import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";
import { BountyContributionItem, CommentContributionItem, Contribution, HypothesisContributionItem, PaperContributionItem, PostContributionItem, RscSupportContributionItem } from "~/config/types/contribution";
import { truncateText } from "~/config/utils/string";
import colors from "~/config/themes/colors";
import icons, { ResearchCoinIcon } from "~/config/themes/icons";
import AuthorAvatar from "~/components/AuthorAvatar";
import ReactTooltip from "react-tooltip";
import HubDropDown from "~/components/Hubs/HubDropDown";
import ContentBadge from "~/components/ContentBadge";
import SubmissionDetails from "~/components/Document/SubmissionDetails";
import { AuthorProfile } from "~/config/types/root_types";
import { POST_TYPES } from "~/components/TextEditor/config/postTypes";


export default function renderContributionEntry(
  entry: Contribution,
  actions: Array<any>,
  setHubsDropdownOpenForKey: Function,
  hubsDropdownOpenForKey: string
) {

  const renderAuthor = (authorProfile: AuthorProfile | undefined) => {

    return (
      <span className={css(styles.author)}>
        {/* <AuthorAvatar author={authorProfile} trueSize size={25} /> */}
        <ALink
          href={`/user/${authorProfile?.id}/overview`}
          overrideStyle={styles.link}
        >
          {authorProfile?.firstName || "N/A"}{" "}
          {authorProfile?.lastName || "User"}
        </ALink>
      </span>
    )
  } 

  const renderHeader = (entry: Contribution) => {
    const { contentType, hubs, id } = entry;
    let { item }  = entry 
    const { createdBy, unifiedDocument: uniDoc, createdDate } = item;
    const key = `${id}-${item.id}`;

    let contentBadgeLabel;
    let actionLabel = <>posted in</>;
    if (contentType.name === "bounty") {
      item = item as BountyContributionItem;
      actionLabel = 
        <>
          created <ResearchCoinIcon version={4} width={16} height={16} /> {item.amount} RSC bounty in
        </>
      contentBadgeLabel = item.amount + " Bounty"
    }
    else if (contentType.name === "rsc_support") {
      item = item as RscSupportContributionItem;
      contentBadgeLabel = item.amount + " Supported";      
      if (item.source.contentType.name === "comment") {
        actionLabel = 
          <>
            supported {renderAuthor(item.recipient?.authorProfile)}
            <ResearchCoinIcon version={4} width={16} height={16} /> {item.amount} RSC for their comment
          </>
      }
      else {
        actionLabel = 
          <>
            supported authors
            <ResearchCoinIcon version={4} width={16} height={16} /> {item.amount} RSC for their {item.source?.contentType.name}
          </>
      }
    }

    // @ts-ignore
    const contentTypeForBadge = entry.contentType.name === "comment" ? entry.item.postType || POST_TYPES.DISCUSSION : entry.contentType.name;

    return (
      <div className={css(styles.header)}>
        <SubmissionDetails
          createdBy={createdBy}
          hubs={hubs}
          createdDate={createdDate}
          avatarSize={25}
          actionLabel={actionLabel}
        />
        <div className={`${css(styles.actions)} actions`}>
          <ContentBadge label={contentBadgeLabel} contentType={contentTypeForBadge} />
        </div>
      </div>
    )
  };

  const { contentType } = entry;
  let { item } = entry;

  switch (contentType.name) {
    case "comment":
      item = item as CommentContributionItem;
      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.highlightedContent)}>
            <div className={css(styles.body, styles.commentBody)}>
              <div className={css(styles.quoteBar)} />
              {truncateText(item.plainText, 300)}
            </div>
          </div>
        </div>
      );
    case "hypothesis":  
    case "post":
    case "question":
    case "paper":
      item = entry.contentType.name === "hypothesis"
        ? item as HypothesisContributionItem :
          entry.contentType.name === "post"
        ? item as PostContributionItem :
          item as PaperContributionItem;

      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.highlightedContent)}>
            <div className={css(styles.title)}>
              <ALink href={getUrlToUniDoc(item?.unifiedDocument)}>
                {item?.unifiedDocument?.document?.title}
              </ALink>
            </div>
            {item?.unifiedDocument?.document?.body &&
              <div className={css(styles.body)}>
                {truncateText(item?.unifiedDocument?.document?.body, 300)}
              </div>
            }
          </div>
        </div>
      );      
    case "rsc_support":
      item = item as RscSupportContributionItem 
      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.highlightedContent)}>
            {item.source.contentType.name === "comment"
              ? (
                <div className={css(styles.body)}>
                  {truncateText(item?.source.plainText, 300)}
                </div>
              ) : (
                <>
                  <div className={css(styles.title)}>
                    <ALink href={getUrlToUniDoc(item?.source.unifiedDocument)}>
                      {item?.source.unifiedDocument?.document?.title}
                    </ALink>
                  </div>
                  <div className={css(styles.body)}>
                    {truncateText(item?.source.unifiedDocument?.document?.body, 300)}
                  </div>
                </>        
                
              )
            }
          </div>
        </div>
      );
    case "bounty":
      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.highlightedContent)}>
            <div className={css(styles.title)}>
              <ALink href={getUrlToUniDoc(entry.relatedItem?.unifiedDocument)}>
                {entry.relatedItem?.unifiedDocument?.document?.title}
              </ALink>
            </div>
            <div className={css(styles.body)}>
              {truncateText(entry.relatedItem?.unifiedDocument?.document?.body, 300)}
            </div>
          </div>
        </div>
      );
  }
}

const styles = StyleSheet.create({
  link: {
    cursor: "pointer",
    fontWeight: 400,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  }, 
  author: {
    display: "inline-flex", 
  },
  entryContent: {
    fontSize: 14,
    lineHeight: "20px",
    width: "100%",
    ":hover .actions": {
      opacity: 1,
      transition: "0.2s",
    },
  },
  hubLink: {
    color: colors.DARKER_GREY(),
    textTransform: "capitalize",
    fontSize: 14,
    ":hover": {
      color: colors.DARKER_GREY(),
      textDecoration: "underline",
    },
  },
  avatarContainer: {
    display: "flex",
    marginRight: "8px",
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  details: {},
  highlightedContent: {
    borderRadius: 4,
    border: `1px solid ${colors.GREY(0.5)}`,
    background: `rgba(249, 249, 249)`,
    padding: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
  },
  body: {
    marginTop: 10,
  },
  commentBody: {
    marginTop: 0,
    display: "flex",
  },
  hubDropdownContainer: {
    display: "inline-block",
  },
  inDocument: {
    lineHeight: "25px",
  },
  content: {
    marginTop: 10,
  },
  icon: {
    fontSize: 16,
    color: colors.BLACK(0.75),
    marginLeft: 7,
    marginRight: 7,
  },
  timestamp: {
    color: colors.BLACK(0.5),
  },
  dot: {
    color: colors.BLACK(0.5),
  },
  comment: {
    display: "flex",
  },
  quoteBar: {
    marginRight: 10,
    minWidth: 4,
    background: colors.GREY(),
    borderRadius: "2px",
  },
  actions: {
    marginLeft: "auto",
    opacity: 1,
    display: "flex",
  },
  action: {
    // marginLeft: 5,
  },
});
