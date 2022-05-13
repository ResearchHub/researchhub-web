import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";
import { Contribution } from "~/config/types/contribution";
import { truncateText } from "~/config/utils/string";
import colors from "~/config/themes/colors";
import icons, { HypothesisIcon }  from "~/config/themes/icons";
import AuthorAvatar from "~/components/AuthorAvatar";
import { ReactNode } from "react";
import ReactTooltip from "react-tooltip";


export default function renderContributionEntry(entry: Contribution, actions: Array<any>) {

    const renderHeader = (entry: Contribution) => {
      const {
        item,
        createdDate,
        contentType,
      } = entry;

      const {
        createdBy,
        unifiedDocument: uniDoc
      } = item;

  
      return (
        <div className={css(styles.header)}>
          <ReactTooltip />
          <div className={css(styles.avatarContainer)}>
            <AuthorAvatar author={createdBy.authorProfile} size={20} />
          </div>
          <div className={css(styles.details)}>
            <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
            {contentType.name === "comment" ? (
              <>
                {` `}
                <span className={css(styles.icon)}>{icons.commentsAlt}</span>
                {` commented `}
                {` in `}
                <ALink href={getUrlToUniDoc(uniDoc)} theme="solidPrimary">{truncateText(uniDoc.document?.title, 200)}</ALink>
              </>
            ) : contentType.name === "paper" ? (
              <>
                {` `}
                <span className={css(styles.icon)}>{icons.fileUpload}</span>
                {` uploaded paper `}
                {/*// @ts-ignore*/}
                <ALink theme="solidPrimary" href={getUrlToUniDoc(uniDoc)}>{truncateText(item?.title, 200)}</ALink>
              </>              
            ) : contentType.name === "post" ? (
              <>
                {` `}
                <span className={css(styles.icon)}>{icons.penSquare}</span>
                {` created post `}
                <ALink theme="solidPrimary" href={getUrlToUniDoc(uniDoc)}>{truncateText(uniDoc.document?.title, 200)}</ALink>
              </>              
            ) : contentType.name === "hypothesis" ? (
              <>
                {` `}
                <span className={css(styles.icon)}>{icons.lightbulb}</span>
                {` proposed hypothesis `}
                {/*// @ts-ignore*/}
                <ALink theme="solidPrimary" href={getUrlToUniDoc(uniDoc)}>{truncateText(item?.title, 200)}</ALink>
              </>
            ) : null }
            <span className={css(styles.dot)}> • </span>
            <ALink href="link-to-hub" theme="solidPrimary">Sociology</ALink>
            <span className={css(styles.dot)}> • </span>
            <span className={css(styles.timestamp)}>{timeSince(createdDate)}</span>
          </div>
          <div className={`${css(styles.actions)} actions`}>
            {actions.map((action) => (
              <span className={css(action.style)} data-tip={action.label} onClick={action.onClick}>{action.html}</span>
            ))}
          </div>
        </div>
      )
    }

    const {
      item,
      contentType,
    } = entry;

    switch (contentType.name) {
      case "comment":
        return (
          <div className={css(styles.entryContent)}>
            {renderHeader(entry)}
            <div className={css(styles.comment)}>
              <div className={css(styles.quoteBar)} /> 
              <div className={css(styles.commentBody)}>
                {/*// @ts-ignore*/}
                {truncateText(item.plainText, 500)}
              </div>
            </div>
          </div>
        )
        case "paper":
          return (
            <div className={css(styles.entryContent)}>
              {renderHeader(entry)}
            </div>
          )
        case "hypothesis":
          return (
            <div className={css(styles.entryContent)}>
              {renderHeader(entry)}
            </div>
          )
          case "post":
            return (
              <div className={css(styles.entryContent)}>
                {renderHeader(entry)}
              </div>
            )
    } 
}

const styles = StyleSheet.create({
  "entryContent": {
    fontSize: 14,
    lineHeight: "20px",
    width: "100%",
    ":hover .actions": {
      opacity: 1,
      transition: "0.2s",
    }
  },
  "avatarContainer": {
    display: "flex",
    marginRight: "8px",
  },
  "header": {
    display: "flex",
    justifyContent: "flex-start",
  },
  "details": {

  },
  "inDocument": {
    lineHeight: "25px",
  },
  "content": {
    marginTop: 10,
  },
  "icon": {
    fontSize: 16,
    color: colors.BLACK(0.75),
    marginLeft: 3,
    marginRight: 3,
  },
  "timestamp": {
    color: colors.BLACK(0.5),
  },
  "dot": {
    color: colors.BLACK(0.5),
  },  
  "comment": {
    display: "flex",
    marginTop: 10,
  },
  "commentBody": {
    color: colors.BLACK(0.8)
  },
  "quoteBar": {
    marginRight: 15,
    minWidth: 4,
    background: colors.GREY(),
  },
  "actions": {
    marginLeft: "auto",
    opacity: 0,
  },
})
