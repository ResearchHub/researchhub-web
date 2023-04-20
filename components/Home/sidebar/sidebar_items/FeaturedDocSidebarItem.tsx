import { css, StyleSheet } from "aphrodite";
import { UnifiedDocument } from "~/config/types/root_types";
import { ReactElement } from "react";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import colors from "~/config/themes/colors";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";

export default function FeaturedDocSidebarItem({
  createdBy,
  document,
  documentType,
  id,
}: UnifiedDocument): ReactElement {
  const { id: relatedDocID, slug, title } = document ?? {};
  return (
    <div className={css(styles.featuredDocSidebarItemContainer)}>
      {/* NOTE: href is subject to change */}
      <a
        style={{ textDecoration: "none" }}
        href={`/${
          documentType === "question" || documentType === "bounty"
            ? "post"
            : documentType
        }/${relatedDocID}/${slug ?? ""}`}
      >
        <div className={css(styles.featuredDocSidebarItem)}>
          <div className={css(styles.featuredDocSidebarItemHeader)}>
            <UserTooltip
              createdBy={createdBy}
              positions={["left"]}
              targetContent={
                <AuthorFacePile
                  authorProfiles={[
                    createdBy?.authorProfile ?? createdBy?.author_profile ?? {},
                  ]}
                  withAuthorName
                  fontSize={14}
                  imgSize={17}
                  key={relatedDocID}
                />
              }
            />
          </div>
          <div className={css(styles.featuredDocSidebarItemContent)}>
            {title}
          </div>
        </div>
      </a>
    </div>
  );
}

const styles = StyleSheet.create({
  featuredDocSidebarItemContainer: {
    borderLeft: "2px solid transparent",
    color: colors.TEXT_GREY(1),
    cursor: "pointer",
    padding: "12px 0",
    textDecoration: "none",
    width: "100%",
    ":hover": {
      background: colors.LIGHT_GREY_BACKGROUND,
      borderLeft: "2px solid blue",
    },
  },
  featuredDocSidebarItem: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 296,
    paddingLeft: 18,
    width: "100%",
  },
  featuredDocSidebarItemHeader: {
    alignItems: "flex-start",
    display: "flex",
    fontSize: 14,
    overflowX: "scroll",
    whiteSpace: "nowrap",
  },
  featuredDocSidebarItemContent: {
    color: colors.BLACK(1),
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    textOverflow: "ellipsis",
  },
  bountiesAmount: {
    color: colors.ORANGE_DARK2(1),
    fontWeight: 600,
    marginLeft: 4,
  },
});
