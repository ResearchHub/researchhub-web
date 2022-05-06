import { parseAuthorProfile, parseUnifiedDocument } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";

export default function renderContributionEntry(entry) {
    const {
      item,
      created_by,
      created_date: createdDate,
      content_type: contentType,
    } = entry;

    const uniDoc = parseUnifiedDocument(item.unified_document)
    const authorProfile = parseAuthorProfile(created_by);
    
    switch (entry.content_type) {
      case "thread":
      case "comment":
      case "reply":
        return (
          <div className={css(resultsStyles.entryContent)}>
            <ALink href={`/user/${authorProfile.id}/overview`}>{authorProfile.firstName} {authorProfile.lastName}</ALink>
            <ALink href="link-to-comment">commented</ALink>
            <div className={css(resultsStyles.entryContent)}>{item.plain_text}</div>
            <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
            <span>•</span>
            <span>{timeSince(createdDate)}</span>
          </div>
        )
        case "paper":
          return (
            <div className={css(resultsStyles.entryContent)}>
              <ALink href={`/user/${authorProfile.id}/overview`}>{authorProfile.firstName} {authorProfile.lastName}</ALink>
              uploaded paper
              <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
              <span>•</span>
              <span>{timeSince(createdDate)}</span>
            </div>
          )
        case "hypothesis":
          return (
            <div className={css(resultsStyles.entryContent)}>
              <ALink href={`/user/${authorProfile.id}/overview`}>{authorProfile.firstName} {authorProfile.lastName}</ALink>
              created hypothesis
              <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
              <span>•</span>
              <span>{timeSince(createdDate)}</span>
            </div>
          )
          case "researchhubpost":
            return (
              <div className={css(resultsStyles.entryContent)}>
                <ALink href={`/user/${authorProfile.id}/overview`}>{authorProfile.firstName} {authorProfile.lastName}</ALink>
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
