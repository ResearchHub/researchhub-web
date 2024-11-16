import { StyleSheet, css } from "aphrodite";
import AuthorList from "../Author/AuthorList";
import ALink, { styles as linkStyles } from "../ALink";
import AuthorClaimModal from "../AuthorClaimModal/AuthorClaimModal";
import { useSelector } from "react-redux";
import { useState } from "react";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowDown,
  faLongArrowUp,
  faCircleCheck,
  faHourglass,
} from "@fortawesome/pro-regular-svg-icons";
import { GenericDocument, Paper, isPaper, isPost } from "./lib/types";
import StarInput from "../Form/StarInput";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatDate } from "~/config/utils/dates";
import AuthorAvatar from "../AuthorAvatar";
import { parsePeerReview, PeerReview } from "../PeerReview/lib/types";



const DocumentLineItems = ({
  document,
}: {
  document: GenericDocument;
}) => {
  const router = useRouter();
  const auth = useSelector((state: any) => state.auth);
  const claimableAuthors = document.authors.filter((a) => !a.isClaimed);
  const [isAuthorClaimModalOpen, setIsAuthorClaimModalOpen] =
    useState<boolean>(false);
  const [isShowingAllMetadata, setIsShowingAllMetadata] =
    useState<boolean>(false);
  const basePath = `/${document.type}/${document.id || router.query.documentId}/${
    document.unifiedDocument.document!.slug || router.query.documentSlug
  }`;

  const lineItems = [
    ...(document.title !== document.title
      ? [{ title: "Title", value: document.title }]
      : []),
    {
      title: "Authors",
      value: (
        <>
          {document.authors.length > 0 ? (
            <AuthorList authors={document.authors} />
          ) : (
            <span>Not available</span>
          )}
          {/* {(isPaper(document) && document.authors.length > 0) && (
            <span
              style={{ marginLeft: 5 }}
              className={css(linkStyles.linkThemeSolidPrimary)}
              onClick={() => setIsAuthorClaimModalOpen(true)}
            >
              Are you the author?
            </span>
          )} */}
        </>
      ),
    },

    ...(isPaper(document) && document.journal
      ? [
          {
            title: "Journal",
            value:
              isPaper(document) && document.externalUrl ? (
                <ALink href={document.externalUrl} target="blank">
                  {document.journal}
                </ALink>
              ) : (
                document.journal
              ),
          },
        ]
      : []),
    ...(document.publishedDate
      ? [
          {
            title: "Published",
            value: document.publishedDate,
          },
        ]
      : []),
    ...((isPaper(document) || isPost(document)) &&
    document.reviewSummary.count > 0
      ? [
          {
            title: "Peer Review",
            value: (
              <Link
                className={
                  router.asPath === basePath + "/reviews" ? "disabled-link" : ""
                }
                href={basePath + "/reviews"}
                style={{ display: "flex", textDecoration: "none" }}
              >
                <StarInput
                  value={document.reviewSummary.averageRating}
                  size="small"
                  readOnly
                />
                <span style={{ color: colors.BLACK_TEXT() }}>
                  ({document.reviewSummary.count})
                </span>
              </Link>
            ),
          },
        ]
      : []),

    ...(document.doi
      ? [
          {
            title: "DOI",
            value: (
              <ALink
                href={
                  isPaper(document) && document.externalUrl
                    ? document.externalUrl
                    : document.doi.startsWith("http")
                    ? document.doi
                    : `https://doi.org/${document.doi}`
                }
                target="blank"
              >
                {document.doi}
              </ALink>
            ),
          },
        ]
      : []),

    ...(isPaper(document) && document.license
      ? [
          {
            title: "License",
            value: document.license,
          },
        ]
      : []),

    ...(isPaper(document) && !document.publishedDate
      ? [
          {
            title: "Uploaded",
            value: document.createdDate,
          },
        ]
      : []),

    ...(isPaper(document) && document?.createdBy?.authorProfile
      ? [
          {
            title: "Posted by",
            value: (
              <ALink
                href={`/author/${document.createdBy.authorProfile?.id}`}
                key={`/author/${document.createdBy.authorProfile?.id}`}
              >
                {document.createdBy.authorProfile.firstName}{" "}
                {document.createdBy.authorProfile.lastName}
              </ALink>
            ),
          },
        ]
      : []),
  ];

  const lineItemsToShow = isShowingAllMetadata
    ? lineItems
    : lineItems.slice(0, 4);
  const hasMoreMetadata = lineItems.length > 4;

  return (
    <div>
      <div className={css(styles.wrapper)}>
        {lineItemsToShow.map((lineItem, index) => {
          return (
            <div className={css(styles.item)} key={`line-item-${index}`}>
              <div className={css(styles.title)}>{lineItem.title}</div>
              <div className={css(styles.value)}>{lineItem.value}</div>
            </div>
          );
        })}
        {hasMoreMetadata && (
          <div className={css(styles.item)}>
            <div className={css(styles.title)} />
            <div className={css(styles.value)}>
              {isShowingAllMetadata ? (
                <div
                  className={css(styles.showMore)}
                  onClick={() => setIsShowingAllMetadata(false)}
                >
                  Show less <FontAwesomeIcon icon={faLongArrowUp} />
                </div>
              ) : (
                <div
                  className={css(styles.showMore)}
                  onClick={() => setIsShowingAllMetadata(true)}
                >
                  Show more <FontAwesomeIcon icon={faLongArrowDown} />
                </div>
              )}
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
  );
};

const styles = StyleSheet.create({
  wrapper: {
    fontSize: 15,
    lineHeight: "1.6em",
  },
  item: {
    display: "flex",
  },
  title: {
    minWidth: "100px",
    color: colors.BLACK(0.6),
  },
  value: { display: "flex", columnGap: "5px", flexWrap: "wrap" },
  showMore: {
    cursor: "pointer",
    color: colors.MEDIUM_GREY(),
    ":hover": {
      textDecoration: "underline",
    },
  },
  reviewersItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  reviewersWrapper: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  reviewerItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
  },
  completedIcon: {
    color: colors.NEW_GREEN(),
  },
  pendingIcon: {
    color: colors.ORANGE_DARK2(),
  },
  reviewDate: {
    fontSize: 13,
    color: colors.BLACK(0.5),
  },
});

export default DocumentLineItems;
