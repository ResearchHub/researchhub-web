import { css, StyleSheet } from "aphrodite";
import { ID, NullableString } from "~/config/types/root_types";
import { ReactElement } from "react";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import colors from "~/config/themes/colors";

type Props = {
  bountyAmount: number;
  bountyContentSnippet: string;
  createdByAuthor: any;
  expirationDate: string;
  relatedDocID: ID;
  slug: NullableString;
};
export default function BountiesSidebarItem({
  bountyAmount,
  bountyContentSnippet,
  createdByAuthor,
  relatedDocID,
  slug,
}: Props): ReactElement {
  const roundedOfferAmount = bountyAmount.toFixed(0);

  return (
    <div className={css(styles.bountiesSidebarItemContainer)}>
      {/* NOTE: href is subject to change */}
      <a
        style={{ textDecoration: "none" }}
        href={`/post/${relatedDocID}/${slug ?? ""}`}
      >
        <div className={css(styles.bountiesSidebarItem)}>
          <div className={css(styles.bountiesSidebarItemHeader)}>
            <AuthorFacePile
              authorProfiles={[createdByAuthor]}
              withAuthorName
              imgSize={12.3}
              fontColor={colors.TEXT_GREY(1)}
            />
            <span className={css(styles.bountiesSidebarTitle)}>
              <span>{"is offering "}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  marginLeft: 4,
                }}
              >
                {roundedOfferAmount}
                {" RSC"}
              </span>
              <img
                style={{ width: 12, marginLeft: 8 }}
                src={"/static/icons/coin-filled.png"}
                draggable={false}
                alt="RSC Coin"
              />
            </span>
          </div>
          <div className={css(styles.bountiesSidebarItemContent)}>
            {bountyContentSnippet}
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
    width: "100%",
    ":hover": {
      background: colors.LIGHT_GREY_BACKGROUND,
      borderLeft: "2px solid blue",
    },
  },
  bountiesSidebarItem: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 260,
    paddingLeft: 18,
    width: "100%",
  },
  bountiesSidebarTitle: {
    alignItems: "flex-start",
    color: colors.TEXT_GREY(1),
    display: "flex",
    fontSize: 12,
    marginLeft: -8,
    textOverflow: "ellipsis",
  },
  bountiesSidebarItemHeader: {
    alignItems: "flex-start",
    display: "flex",
    fontSize: 14,
    overflowX: "scroll",
    whiteSpace: "nowrap",
  },
  bountiesSidebarItemContent: {
    color: colors.BLACK(1),
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    textOverflow: "ellipsis",
  },
});
