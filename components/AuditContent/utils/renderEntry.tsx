import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";
import { Contribution } from "~/config/types/contribution";

export default function renderContributionEntry(entry: Contribution) {
    const {
      item,
      createdBy,
      createdDate,
      contentType,
    } = entry;

    const uniDoc = item.unifiedDocument;
    console.log('uniDoc', uniDoc)
    switch (entry.contentType) {
      case "comment":
        return (
          <div className={css(resultsStyles.entryContent)}>
            <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
            <ALink href="link-to-comment">commented</ALink>
            {/*// @ts-ignore*/}
            <div className={css(resultsStyles.entryContent)}>{item.plainText}</div>
            <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
            <span>•</span>
            <span>{timeSince(createdDate)}</span>
          </div>
        )
        case "paper":
          return (
            <div className={css(resultsStyles.entryContent)}>
              <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
              uploaded paper
              <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
              <span>•</span>
              <span>{timeSince(createdDate)}</span>
            </div>
          )
        case "hypothesis":
          return (
            <div className={css(resultsStyles.entryContent)}>
              <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
              created hypothesis
              <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
              <span>•</span>
              <span>{timeSince(createdDate)}</span>
            </div>
          )
          case "post":
            return (
              <div className={css(resultsStyles.entryContent)}>
                <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
                created post
                <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
                <span>•</span>
                <span>{timeSince(createdDate)}</span>
              </div>
            )
    } 
  }

const resultsStyles = StyleSheet.create({
  "entryContent": {
    
  },
})
