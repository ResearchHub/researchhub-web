import { css, StyleSheet } from "aphrodite";
import { FEDocType } from "~/config/utils/getUnifiedDocType";
import { ID, NullableString, RHUser } from "~/config/types/root_types";
import { ReactElement } from "react";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import colors from "~/config/themes/colors";
import ContentBadge from "~/components/ContentBadge";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";

type Props = {
  bountyAmount: number;
  bountyContentSnippet: string;
  createdByAuthor: any;
  documentType: FEDocType;
  expirationDate: string;
  isCommentBounty: boolean;
  relatedDocID: ID;
  slug: NullableString;
  createdBy: RHUser | null;
  rawBountyAmount: number;
};

export default function BountiesSidebarItem({
  bountyAmount,
  bountyContentSnippet,
  createdByAuthor,
  documentType,
  isCommentBounty,
  relatedDocID,
  slug,
  createdBy,
  rawBountyAmount,
}: Props): ReactElement {
  const roundedOfferAmount = bountyAmount;

  return (
    <div className={css(styles.bountiesSidebarItemContainer)}>
      {/* NOTE: href is subject to change */}
      <a
        style={{ textDecoration: "none" }}
        href={`/${
          documentType === "question" ? "post" : documentType
        }/${relatedDocID}/${slug ?? ""}${isCommentBounty ? "/bounties" : ""}`}
      >
        <div className={css(styles.bountiesSidebarItem)}>
          <div className={css(styles.bountiesSidebarItemHeader)}>
            <UserTooltip
              createdBy={createdBy}
              positions={["left"]}
              targetContent={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <AuthorFacePile
                    authorProfiles={[createdByAuthor]}
                    withAuthorName
                    horizontal
                    margin={3}
                    border={null}
                    fontSize={14}
                    imgSize={17}
                  />
                </div>
              }
            />
            {createdByAuthor.is_verified && (
              <div style={{ marginLeft: 0, marginTop: 4 }}>
                <VerifiedBadge height={18} width={18} />
              </div>
            )}
            <span className={css(styles.bountiesSidebarTitle)}>
              <span>{"is offering "}</span>
            </span>
          </div>
          <div className={css(styles.bountyBadge)}>
            <ContentBadge
              label={`${roundedOfferAmount} RSC`}
              contentType="bounty"
              size="small"
              bountyAmount={rawBountyAmount}
            />
          </div>
          <div className={css(styles.bountiesSidebarItemContent)}>
            {bountyContentSnippet?.length > 180
              ? bountyContentSnippet.slice(0, 180) + " ..."
              : bountyContentSnippet}
          </div>
        </div>
      </a>
    </div>
  );
}

const styles = StyleSheet.create({
  bountiesSidebarItemContainer: {
    borderLeft: "2px solid transparent",
    color: colors.TEXT_GREY(1),
    cursor: "pointer",
    padding: "12px 0",
    textDecoration: "none",
    overflow: "hidden",
    width: "100%",
    ":hover": {
      background: colors.LIGHT_GREY_BACKGROUND,
      borderLeft: `2px solid ${colors.BLUE(1)}`,
    },
  },
  bountiesSidebarItem: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 296,
    paddingLeft: 18,
    width: "100%",
  },
  bountiesSidebarTitle: {
    alignItems: "center",
    columnGap: "5px",
    color: colors.TEXT_GREY(1),
    display: "flex",
    fontSize: 12,
    marginLeft: 3,
    height: "100%",
    textOverflow: "ellipsis",
    marginTop: 1, // arbitrary to match AuthorFacePile
  },
  bountyBadge: {
    display: "flex",
    marginBottom: 8,
  },
  bountiesSidebarItemHeader: {
    alignItems: "center",
    marginBottom: 8,
    display: "flex",
    overflow: "auto",
    fontSize: 14,
    whiteSpace: "nowrap",
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,

    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  bountiesSidebarItemContent: {
    color: colors.BLACK(1),
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    overflowWrap: "anywhere",
    textOverflow: "ellipsis",
  },
  bountiesAmount: {
    color: colors.ORANGE_DARK2(1),
    fontWeight: 600,
    marginLeft: 4,
  },
});
