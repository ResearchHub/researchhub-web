import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import {
  BountyContributionItem,
  CommentContributionItem,
  Contribution,
  HypothesisContributionItem,
  PaperContributionItem,
  PostContributionItem,
  RscSupportContributionItem,
} from "~/config/types/contribution";
import { truncateText } from "~/config/utils/string";
import colors from "~/config/themes/colors";
import ContributionHeader from "../Contribution/ContributionHeader";
import { ReactNode } from "react";
import Link from "next/link";
import { isEmpty } from "~/config/utils/nullchecks";
import CommentReadOnly from "~/components/Comment/CommentReadOnly";


type Args = {
  entry: Contribution;
  actions: Array<any>;
  setHubsDropdownOpenForKey?: Function;
  hubsDropdownOpenForKey?: string;
};

const _getPrimaryUrl = (entry: Contribution): string => {
  const { contentType } = entry;
  let { item } = entry;

  switch (contentType.name) {
    case "comment":
      item = item as CommentContributionItem;
      return getUrlToUniDoc(item.unifiedDocument) + "#comments";
    case "rsc_support":
      item = item as RscSupportContributionItem;
      return getUrlToUniDoc(item?.source.unifiedDocument);
    case "bounty":
      item = item as BountyContributionItem;
      return getUrlToUniDoc(entry?.relatedItem?.unifiedDocument);
    case "paper":
      item = item as PaperContributionItem;
      return getUrlToUniDoc(item?.unifiedDocument);
    case "hypothesis":
    case "post":
    case "question":
    default:
      item = item as PostContributionItem;
      return getUrlToUniDoc(item?.unifiedDocument);
  }
};

const ContributionEntry = ({
  entry,
  actions,
  setHubsDropdownOpenForKey,
  hubsDropdownOpenForKey,
}: Args) => {
  const { contentType } = entry;
  let { item } = entry;
  let showActions = false;

  let title: string | ReactNode;
  let body: string | ReactNode;


  switch (contentType.name) {
    case "comment":
      showActions = true;
      
      item = item as CommentContributionItem;
      body = (
        <span className={css(styles.commentBody)}>
          <CommentReadOnly content={item.content} />
        </span>
      );
      break;

    case "rsc_support":
      item = item as RscSupportContributionItem;
      
      if (item.source.contentType.name === "comment") {
        body = (
          <span className={css(styles.commentBody)}>
            {truncateText(item?.source.plainText, 300)}
          </span>
        );
      } else {
        body = truncateText(item?.source.unifiedDocument?.document?.body, 300);
        title = (
          <ALink href={getUrlToUniDoc(item?.source.unifiedDocument)}>
            {item?.source.unifiedDocument?.document?.title}
          </ALink>
        );
      }
      break;

    case "bounty":
      title = (
        <ALink href={getUrlToUniDoc(entry.relatedItem?.unifiedDocument)}>
          {entry.relatedItem?.unifiedDocument?.document?.title}
        </ALink>
      );


      body = truncateText(
        entry.relatedItem?.unifiedDocument?.document?.body,
        300
      );

      console.log('body', body)
      break;

    case "hypothesis":
    case "post":
    case "question":
    case "paper":
    // default:
      showActions = true;
      item =
        contentType.name === "hypothesis"
          ? (item as HypothesisContributionItem)
          : contentType.name === "post"
          ? (item as PostContributionItem)
          : (item as PaperContributionItem);

      // @ts-ignore
      body = truncateText(
        item?.unifiedDocument?.document?.body ||
          item?.abstract ||
          item?.renderable_text,
        300
      );
      if (contentType.name === "hypothesis") {
        /* below is a hack (need to address in the future) */
        item.unifiedDocument.documentType = "hypothesis";
        item.unifiedDocument.document = { id: item.id, slug: item.slug };
        body = item.renderable_text;
      }
      title = (
        <ALink href={getUrlToUniDoc(item?.unifiedDocument)}>
          {item?.unifiedDocument?.document?.title ?? item?.title ?? ""}
        </ALink>
      );
      break;
  }

  const primaryUrl = _getPrimaryUrl(entry);
  return (
    <Link href={primaryUrl} className={css(styles.linkWrapper)}>
      <div className={css(styles.entryContent)}>
        <ContributionHeader entry={entry} />
        <div className={css(styles.highlightedContentContainer)}>
          <div className={css(styles.highlightedContent)}>
            {title && (
              <div className={`${css(styles.title)} highlightedContentTitle`}>
                {title}
              </div>
            )}
            {body && (
              <div className={`${css(styles.body)} highlightedContentBody`}>
                <div className={css(styles.textContainer)}>{body}</div>
              </div>
            )}
          </div>
          {showActions && (
            <div className={css(styles.actions)}>
              {actions.map(
                (action, idx) =>
                  action.isActive && (
                    <span
                      key={`action-${idx}`}
                      onClick={(event) => {
                        event.preventDefault();
                      }}
                    >
                      {action.html}
                    </span>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const styles = StyleSheet.create({
  linkWrapper: {
    textDecoration: "none",
    color: "inherit",
    width: "100%",
  },
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
    padding: "7px 0px 0px 0px",
    marginTop: 0,
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
  },
  highlightedContent: {
    width: "100%",
  },
  textContainer: {
    display: "flex",
  },
  title: {
    fontSize: 18,
    ":nth-child(1n) + .highlightedContentBody": {
      marginTop: 10,
    },
  },
  body: {},
  commentBody: {
    fontStyle: "italic",
    width: "100%",
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
  actions: {
    marginTop: 5,
    display: "flex",
  },
});

export default ContributionEntry;
