import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import StarInput from "~/components/Form/StarInput";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { RHUser, UnifiedDocument } from "~/config/types/root_types";
import Link from "next/link";
import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";
import { truncateText } from "~/config/utils/string";

const PeerReviewSidebarItem = ({
  createdBy,
  score,
  unifiedDocument,
}: {
  createdBy: RHUser;
  score: number;
  unifiedDocument: UnifiedDocument;
}) => {
  const docTitle = truncateText(unifiedDocument?.document?.title, 180);
  const url = getUrlToUniDoc(unifiedDocument) + "/reviews";

  return (
    <div className={css(styles.reviewSidebarItemContainer)}>
      <Link style={{ textDecoration: "none" }} href={url}>
        <div className={css(styles.reviewSidebarItem)}>
          <div className={css(styles.reviewSidebarItemHeader)}>
            <UserTooltip
              createdBy={createdBy}
              positions={["left"]}
              targetContent={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <AuthorFacePile
                    authorProfiles={[createdBy.authorProfile]}
                    withAuthorName
                    horizontal
                    margin={3}
                    border={"none"}
                    fontSize={14}
                    imgSize={17}
                  />
                </div>
              }
            />
            {createdBy.authorProfile.isVerified && (
              <div style={{ marginLeft: 0, marginTop: 4 }}>
                <VerifiedBadge height={18} width={18} />
              </div>
            )}
            <span className={css(styles.reviewSidebarTitle)}>
              <span>{"peer reviewed "}</span>
            </span>
          </div>
          <div>
            <StarInput value={score} readOnly size="small" />
          </div>
          <div className={css(styles.reviewSidebarItemContent)}>{docTitle}</div>
        </div>
      </Link>
    </div>
  );
};

const styles = StyleSheet.create({
  reviewSidebarItemContainer: {
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
  reviewSidebarItem: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 296,
    paddingLeft: 18,
    width: "100%",
  },
  reviewSidebarTitle: {
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
  reviewSidebarItemHeader: {
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
  reviewSidebarItemContent: {
    marginTop: 5,
    color: colors.BLACK(1),
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    overflowWrap: "anywhere",
    textOverflow: "ellipsis",
  },
  reviewAmount: {
    color: colors.ORANGE_DARK2(1),
    fontWeight: 600,
    marginLeft: 4,
  },
});

export default PeerReviewSidebarItem;
