import { StyleSheet, css } from "aphrodite";
import AuthorList from "../Author/AuthorList";
import ALink, { styles as linkStyles } from "../ALink";
import AuthorClaimModal from "../AuthorClaimModal/AuthorClaimModal";
import { useSelector } from "react-redux";
import { useState } from "react";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown, faLongArrowUp } from "@fortawesome/pro-regular-svg-icons";
import { GenericDocument, Paper, isPaper } from "./lib/types";

const DocumentLineItems = ({ document }: { document: GenericDocument }) => {
  const auth = useSelector((state: any) => state.auth);
  const claimableAuthors = document.authors.filter((a) => !a.isClaimed);
  const [isAuthorClaimModalOpen, setIsAuthorClaimModalOpen] = useState<boolean>(false);
  const [isShowingAllMetadata, setIsShowingAllMetadata] = useState<boolean>(false);


  const lineItems = [
    ...(document.title !== document.title
      ? [{ title: "Title", value: document.title }]
      : []), {
      title: "Authors",
      value: (
        <>
          <AuthorList authors={document.authors} />
          <span style={{ marginLeft: 5, }} className={css(linkStyles.linkThemeSolidPrimary)} onClick={() => setIsAuthorClaimModalOpen(true)}>Are you the author?</span>
        </>
      )
    },
    ...(isPaper(document) && document.journal ? [{
      title: "Journal",
      value: document.journal,
    }] : []),    
  
    ...(isPaper(document) && document.publishedDate ? [{
      title: "Published",
      value: document.publishedDate,
    }] : []),    
    
    
    
    ...(document.doi
      ? [{
        title: "DOI",
        value: (
          <ALink
            href={`https://` + document.doi}
            target="blank"
          >
            {document.doi}
          </ALink>
        )
      }]
      : []), ...(document?.createdBy?.authorProfile
        ? [{
          title: "Posted by",
          value: (
            <ALink
              href={`/user/${document.createdBy.authorProfile?.id}/overview`}
              key={`/user/${document.createdBy.authorProfile?.id}/overview-key`}
            >
              {document.createdBy.authorProfile.firstName} {document.createdBy.authorProfile.lastName}
            </ALink>
          )
        }]
        : [])]

  const lineItemsToShow = isShowingAllMetadata ? lineItems : lineItems.slice(0, 3);
  const hasMoreMetadata = lineItems.length > 3;
  return (
    <div>
      <div className={css(styles.wrapper)}>
        {lineItemsToShow.map((lineItem, index) => {
          return (
            <div className={css(styles.item)} key={`line-item-${index}`}>
              <div className={css(styles.title)}>{lineItem.title}</div>
              <div className={css(styles.value)}>{lineItem.value}</div>
            </div>
          )
        })}
        {hasMoreMetadata && (
          <div className={css(styles.item)}>
            <div className={css(styles.title)} />
            <div className={css(styles.value)} >
              {isShowingAllMetadata ? 
                <div className={css(styles.showMore)} onClick={() => setIsShowingAllMetadata(false)}>Show less <FontAwesomeIcon icon={faLongArrowUp} /></div>
                : <div className={css(styles.showMore)} onClick={() => setIsShowingAllMetadata(true)}>Show more <FontAwesomeIcon icon={faLongArrowDown} /></div>
              }
            </div>
          </div>
        )}
      </div>
      <AuthorClaimModal
        auth={auth}
        authors={claimableAuthors}
        isOpen={isAuthorClaimModalOpen}
        setIsOpen={(isOpen) => setIsAuthorClaimModalOpen(isOpen)}
      />
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    fontSize: 15,
    lineHeight: "1.5em",
  },
  item: {
    display: "flex",
  },
  title: {
    width: "100px",
    color: colors.MEDIUM_GREY(),
  },
  value: {
  },
  showMore: {
    cursor: "pointer",
    color: colors.MEDIUM_GREY(),
    ":hover": {
      textDecoration: "underline",
    }
  }
})

export default DocumentLineItems;