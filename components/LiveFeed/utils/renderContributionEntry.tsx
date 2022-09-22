import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";
import { BountyContributionItem, Contribution, RscSupportContributionItem } from "~/config/types/contribution";
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
      contentBadgeLabel = item.amount + " Support";      
      console.log('|||', item.amount + " Support")
      // @ts-ignore
      if (item.source.contentType.name === "comment") {
        actionLabel = 
          <>
            supported {renderAuthor(item.recipient?.authorProfile)}
            <ResearchCoinIcon version={4} width={16} height={16} /> {item.amount} RSC for their comment
          </>
        {/* @ts-ignore */}
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

    return (
      <div className={css(styles.header)}>
        <ReactTooltip />
        <div className={css(styles.avatarContainer)}>
          <AuthorAvatar author={createdBy?.authorProfile} size={25} />
        </div>
        <div className={css(styles.details)}>
          {createdBy?.authorProfile ? (
            <ALink href={`/user/${createdBy?.authorProfile.id}/overview`}>
              {createdBy?.authorProfile?.firstName}{" "}
              {createdBy?.authorProfile?.lastName}
            </ALink>
          ) : (
            <span>User N/A</span>
          )}

          {contentType.name === "comment" ? (
            <>
              {` `}
              <span className={css(styles.icon)}>{icons.commentsAlt}</span>
              {`commented in `}
              <ALink href={getUrlToUniDoc(uniDoc)} theme="solidPrimary">
                {truncateText(uniDoc.document?.title, 200)}
              </ALink>
            </>
          ) : contentType.name === "paper" ? (
            <>
              {` `}
              <span className={css(styles.icon)}>{icons.fileUpload}</span>
              {`uploaded paper `}
              {/*// @ts-ignore*/}
              <ALink theme="solidPrimary" href={getUrlToUniDoc(uniDoc)}>
                {truncateText(item?.title, 100)}
              </ALink>
            </>
          ) : contentType.name === "post" || contentType.name === "question" ? (
            <>
              {` `}
              {/* {`posted ${uniDoc?.documentType} `} */}
              <ALink theme="solidPrimary" href={getUrlToUniDoc(uniDoc)}>
                {truncateText(uniDoc.document?.title, 200)}
              </ALink>
            </>
          ) : contentType.name === "hypothesis" ? (
            <>
              {` `}
              <span className={css(styles.icon)}>{icons.lightbulb}</span>
              {`proposed hypothesis `}
              {/*// @ts-ignore*/}
              <ALink theme="solidPrimary" href={getUrlToUniDoc(uniDoc)}>
                {truncateText(item?.title, 200)}
              </ALink>
            </>
          ) : null}

          {hubs?.length > 0 && (
            <>
              <span className={css(styles.dot)}> • </span>
              {hubs?.slice(0, 2).map((h, index) => (
                <>
                  <ALink
                    theme="solidPrimary"
                    href={`/hubs/${h.slug}`}
                    overrideStyle={styles.hubLink}
                  >
                    {h.name}
                  </ALink>
                  {index < hubs?.slice(0, 2).length - 1 ? ", " : ""}
                </>
              ))}
              &nbsp;
              {hubs?.slice(2).length > 0 && (
                <HubDropDown
                  hubs={hubs?.slice(1)}
                  labelStyle={styles.hubLink}
                  containerStyle={styles.hubDropdownContainer}
                  isOpen={hubsDropdownOpenForKey === key}
                  setIsOpen={(isOpen) => {
                    setHubsDropdownOpenForKey(isOpen ? key : false);
                  }}
                />
              )}
            </>
          )}

          <span className={css(styles.dot)}> • </span>
          <span className={css(styles.timestamp)}>
            {timeSince(createdDate)}
          </span>
        </div>
        <div className={`${css(styles.actions)} actions`}>
          <ContentBadge contentType={entry.contentType.name} />
          {/* {actions
            .filter((action) => action.isActive)
            .map((action) => (
              <span
                className={css(styles.action, action.style)}
                data-tip={action.label}
                onClick={action.onClick}
              >
                {action.html}
              </span>
            ))} */}
        </div>
      </div>
    );
  };

  const { contentType } = entry;
  let { item } = entry;

  switch (contentType.name) {
    case "comment":
      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.highlightedContent)}>
            <div className={css(styles.quoteBar)} />
            <div className={css(styles.commentBody)}>
              {/*// @ts-ignore*/}
              {truncateText(item.plainText, 500)}
            </div>
          </div>
        </div>
      );
    case "paper":
      console.log('paper', entry)
      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.highlightedContent)}>Empty</div>
        </div>
      );
    case "hypothesis":
      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.highlightedContent)}>Empty</div>
        </div>
      );
    case "post":
      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.comment, styles.body)}>Empty</div>
        </div>
      );
    case "question":
      console.log('question', entry)
      return (
        <div className={css(styles.entryContent)}>
          {renderHeader(entry)}
          <div className={css(styles.highlightedContent)}>
            <div className={css(styles.title)}>
              <ALink href={getUrlToUniDoc(entry.item?.unifiedDocument)}>
                {entry.item?.unifiedDocument?.document?.title}
              </ALink>
            </div>
            <div className={css(styles.body)}>
              {truncateText(entry.item?.unifiedDocument?.document?.body, 300)}
            </div>
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
  commentBody: {
    color: colors.BLACK(0.8),
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
