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
  
  switch (contentType.name) {
    case "comment":
      item = item as CommentContributionItem;

      return (
        <div className={css(styles.entryContent)}>
          <ContributionHeader entry={entry} />
          <div className={css(styles.highlightedContent)}>
            <div className={css(styles.body, styles.commentBody)}>
              <div className={css(styles.textContainer)}>
                <div className={css(styles.quoteBar)} />
                {truncateText(item.plainText, 300)}
              </div>
              <div className={css(styles.actions)}>
                {actions.map(a => a.isActive && a.html)}
              </div>              
            </div>
          </div>
        </div>
      );     
    case "rsc_support":
      item = item as RscSupportContributionItem 
      return (
        <div className={css(styles.entryContent)}>
          <ContributionHeader entry={entry} />
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
          <ContributionHeader entry={entry} />
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
      const body = truncateText(item?.unifiedDocument?.document?.body || item?.abstract);
      return (
        <div className={css(styles.entryContent)}>
          <ContributionHeader entry={entry} />
          <div className={css(styles.highlightedContent)}>
            <div className={css(styles.title)}>
              <ALink href={getUrlToUniDoc(item?.unifiedDocument)}>
                {item?.unifiedDocument?.document?.title}
              </ALink>
            </div>
            {item?.unifiedDocument?.document?.body &&
              <div className={css(styles.body)}>
                {body}
              </div>
            }
          </div>
        </div>
      ); 
  }
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
  highlightedContent: {
    borderRadius: 4,
    border: `1px solid ${colors.GREY(0.5)}`,
    background: `rgba(249, 249, 249)`,
    padding: "15px 15px 14px 15px",
    marginTop: 10,
    position: "relative",
  },
  textContainer: {
    display: "flex",
  },
  title: {
    fontSize: 18,
  },
  body: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between"
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