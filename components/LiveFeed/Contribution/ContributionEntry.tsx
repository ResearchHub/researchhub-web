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
import { localWarn } from "~/config/utils/nullchecks";
import { ReactNode } from "react";
import { truncateText } from "~/config/utils/string";
import colors from "~/config/themes/colors";
import CommentReadOnly from "~/components/Comment/CommentReadOnly";
import { contextConfig } from "~/components/Comment/lib/config";
import ContributionHeader from "../Contribution/ContributionHeader";
import HubTag from "~/components/Hubs/HubTag";
import { parseHub } from "~/config/types/hub";
import DocumentHubs from "~/components/Document/lib/DocumentHubs";

type Args = {
  entry: Contribution;
  actions: Array<any>;
  setHubsDropdownOpenForKey?: Function;
  hubsDropdownOpenForKey?: string;
  context: "live-feed" | "flagging-dashboard";
};

const ContributionEntry = ({
  entry,
  actions,
  context,
  setHubsDropdownOpenForKey,
  hubsDropdownOpenForKey,
}: Args) => {
  const { contentType, hubs } = entry;
  let { item } = entry;
  let showActions = true;

  let title: string | ReactNode;
  let body: string | ReactNode;

  try {
    switch (contentType.name) {
      case "comment":
        showActions = true;

        item = item as CommentContributionItem;
        body = (
          <span className={css(styles.commentBody)}>
            <CommentReadOnly
              content={item.content}
              previewMaxImageLength={contextConfig.feed.previewMaxImages}
              previewMaxCharLength={contextConfig.feed.previewMaxChars}
            />
          </span>
        );
        break;

      case "rsc_support":
        item = item as RscSupportContributionItem;

        if (item.source.contentType.name === "comment") {
          body = (
            <span className={css(styles.commentBody)}>
              <CommentReadOnly
                content={item.source.content}
                previewMaxImageLength={contextConfig.feed.previewMaxImages}
                previewMaxCharLength={contextConfig.feed.previewMaxChars}
              />
            </span>
          );
        } else {
          body = truncateText(
            item?.source.unifiedDocument?.document?.body,
            300
          );
          title = (
            <ALink href={getUrlToUniDoc(item?.source.unifiedDocument)}>
              {item?.source.unifiedDocument?.document?.title}
            </ALink>
          );
        }
        break;

      case "bounty":
        item = item as BountyContributionItem;

        if (item.content) {
          body = (
            <span className={css(styles.commentBody)}>
              <CommentReadOnly
                content={item.content}
                previewMaxImageLength={contextConfig.feed.previewMaxImages}
                previewMaxCharLength={contextConfig.feed.previewMaxChars}
              />
            </span>
          );
        } else {
          title = (
            <ALink href={getUrlToUniDoc(item.unifiedDocument)}>
              {item.unifiedDocument?.document?.title}
            </ALink>
          );
          body = truncateText(
            entry.relatedItem?.unifiedDocument?.document?.body,
            300
          );
        }

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

        body = truncateText(
          item?.unifiedDocument?.document?.body ||
            // @ts-ignore
            item?.abstract ||
            // @ts-ignore
            item?.renderable_text,
          300
        );
        if (contentType.name === "hypothesis") {
          /* below is a hack (need to address in the future) */
          item.unifiedDocument.documentType = "hypothesis";
          item.unifiedDocument.document = { id: item.id, slug: item.slug };
          // @ts-ignore
          body = item.renderable_text;
        }
        title = (
          <ALink
            overrideStyle={styles.documentLink}
            href={getUrlToUniDoc(item?.unifiedDocument)}
          >
            {item?.unifiedDocument?.document?.title ?? item?.title ?? ""}
          </ALink>
        );
        break;
      default:
        localWarn("[Contribution] Could not render contribution item", item);
    }
  } catch (error) {
    localWarn("[Contribution] Could not render", entry);
    return null;
  }

  const parsedHubs = hubs.map((h) => parseHub(h));

  return (
    <>
      <div className={css(styles.entryContent)}>
        <ContributionHeader context={context} entry={entry} />
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

          {context === "live-feed" && (
            <div className={css(styles.hubsContainer)}>
              <DocumentHubs
                hubs={parsedHubs}
                withShowMore={false}
                hideOnSmallerResolution={true}
              />
            </div>
          )}
          {actions.length > 0 && (
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
    </>
  );
};

const styles = StyleSheet.create({
  entryContent: {
    fontSize: 14,
    lineHeight: "20px",
    width: "100%",
  },
  hubsContainer: {
    marginTop: 10,
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
    padding: "15px 0px 0px 0px",
    marginTop: 0,
    position: "relative",
    // display: "flex",
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
    cursor: "pointer",
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
  documentLink: {
    fontWeight: 500,
    lineHeight: "1.25em",
  },
});

export default ContributionEntry;
