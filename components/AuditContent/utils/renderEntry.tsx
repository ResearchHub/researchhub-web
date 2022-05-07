import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";
import { Contribution } from "~/config/types/contribution";
import { truncateText } from "~/config/utils/string";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

export default function renderContributionEntry(entry: Contribution) {
    const {
      item,
      createdBy,
      createdDate,
      contentType,
    } = entry;
    const uniDoc = item.unifiedDocument;

    switch (entry.contentType) {
      case "comment":
        return (
          <div className={css(styles.entryContent)}>
            <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
            {` left a `}
            <ALink href="link-to-comment" theme="solidPrimary">comment</ALink>
            <span className={css(styles.icon)}>{icons.commentsAlt}</span>
            <span className={css(styles.dot)}> • </span>
            <span className={css(styles.timestamp)}>{timeSince(createdDate)}</span>
            <div className={css(styles.comment)}>
              <div className={css(styles.quoteBar)} /> 
              <div className={css(styles.commentBody)}>
                {/*// @ts-ignore*/}
                {truncateText(item.plainText, 450)}
              </div>
            </div>
            {`In ${uniDoc.documentType} `}
            <ALink href={getUrlToUniDoc(uniDoc)} theme="solidPrimary">{truncateText(uniDoc.document?.title, 150)}</ALink>
            
          </div>
        )
        case "paper":
          return (
            <div className={css(styles.entryContent)}>
              <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
              {` uploaded paper`}
              <span className={css(styles.icon)}>{icons.fileUpload}</span>
              <span className={css(styles.dot)}> • </span>
              <span className={css(styles.timestamp)}>{timeSince(createdDate)}</span>
              <div className={css(styles.content)}>
                <ALink href={getUrlToUniDoc(uniDoc)} theme="solidPrimary">{truncateText(uniDoc.document?.title, 150)}</ALink>
              </div>
            </div>
          )
        case "hypothesis":
          return (
            <div className={css(styles.entryContent)}>
              <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
              created hypothesis
              <ALink href={getUrlToUniDoc(uniDoc)}>{truncateText(uniDoc.document?.title)}</ALink>
              <span>•</span>
              <span>{timeSince(createdDate)}</span>
            </div>
          )
          case "post":
            return (
              <div className={css(styles.entryContent)}>
                <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
                created post
                <ALink href={getUrlToUniDoc(uniDoc)}>{truncateText(uniDoc.document?.title)}</ALink>
                <span>•</span>
                <span>{timeSince(createdDate)}</span>
              </div>
            )
    } 
}

const styles = StyleSheet.create({
  "entryContent": {
    fontSize: 14,
    lineHeight: "18px",
  },
  "content": {
    marginTop: 10,
  },
  "icon": {
    marginLeft: 8,
    fontSize: 16,
    color: colors.BLACK(0.75),
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
    marginBottom: 10,
  },
  "commentBody": {
    color: colors.BLACK(0.75)
  },
  "quoteBar": {
    marginRight: 15,
    minWidth: 4,
    background: colors.GREY(),
  }
})
