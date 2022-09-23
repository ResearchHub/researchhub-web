import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import {
  CommentContributionItem,
  Contribution,
  HypothesisContributionItem,
  PaperContributionItem,
  PostContributionItem,
  RscSupportContributionItem
} from "~/config/types/contribution";
import { truncateText } from "~/config/utils/string";
import colors from "~/config/themes/colors";
import ContributionHeader from "../Contribution/ContributionHeader";
import { ReactNode } from "react";

type Args = {
  entry: Contribution,
  actions: Array<any>,
  setHubsDropdownOpenForKey?: Function,
  hubsDropdownOpenForKey?: string  
}

const ContributionEntry = ({
  entry,
  actions,
  setHubsDropdownOpenForKey,
  hubsDropdownOpenForKey
}: Args) => {
  const { contentType } = entry;
  let { item } = entry;

  let title:string|ReactNode;
  let body:string|ReactNode;
  switch (contentType.name) {
    case "comment":
      item = item as CommentContributionItem;
      body = 
        <>
          <div className={css(styles.quoteBar)} />
          {truncateText(item.plainText, 300)}
        </>
      break;

    case "rsc_support":
      item = item as RscSupportContributionItem;

      console.log('item', item)
      console.log('entry', entry)
      if (item.source.contentType.name === "comment") {
        body = truncateText(item?.source.plainText, 300);
      }
      else {
        body = truncateText(item?.source.unifiedDocument?.document?.body, 300);
        title =
          <ALink href={getUrlToUniDoc(item?.source.unifiedDocument)}>
            {item?.source.unifiedDocument?.document?.title}
          </ALink>
      }
      break;

    case "bounty":
      title = 
        <ALink href={getUrlToUniDoc(entry.relatedItem?.unifiedDocument)}>
          {entry.relatedItem?.unifiedDocument?.document?.title}
        </ALink>

      body = truncateText(entry.relatedItem?.unifiedDocument?.document?.body, 300);
      break;

    case "hypothesis":  
    case "post":
    case "question":
    case "paper":
    default:
      item = entry.contentType.name === "hypothesis"
        ? item as HypothesisContributionItem :
          entry.contentType.name === "post"
        ? item as PostContributionItem :
          item as PaperContributionItem;
      
      // @ts-ignore
      body = truncateText(item?.unifiedDocument?.document?.body || item?.abstract);
      title =
        <ALink href={getUrlToUniDoc(item?.unifiedDocument)}>
          {item?.unifiedDocument?.document?.title}
        </ALink>
      break;
  }

  return (
    <div className={css(styles.entryContent)}>
      <ContributionHeader entry={entry} />
      <div className={css(styles.highlightedContentContainer)}>
        <div className={css(styles.highlightedContent)}>
          {title && 
            <div className={`${css(styles.title)} highlightedContentTitle`}>
              {title}
            </div>
          }
          {body &&
            <div className={`${css(styles.body)} highlightedContentBody`}>
              <div className={css(styles.textContainer)}>
                {body}
              </div>
            </div>
          }
        </div>
        <div className={css(styles.actions)}>
          {actions.map((a,idx) => a.isActive && <span key={`action-${idx}`}>{a.html}</span>)}
        </div> 
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  entryContent: {
    fontSize: 14,
    lineHeight: "20px",
    width: "100%",
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
  details: {},
  highlightedContentContainer: {
    borderRadius: 4,
    border: `1px solid ${colors.GREY(0.5)}`,
    background: `rgba(249, 249, 249)`,
    padding: "15px 15px 14px 15px",
    marginTop: 10,
    position: "relative",
    display: "flex",
    justifyContent: "space-between"
  },
  highlightedContent: {
  },
  textContainer: {
    display: "flex",
  },
  title: {
    fontSize: 18,
    ":nth-child(1n) + .highlightedContentBody": {
      marginTop: 10,
    }
  },
  body: {
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
    
  }
});

export default ContributionEntry;