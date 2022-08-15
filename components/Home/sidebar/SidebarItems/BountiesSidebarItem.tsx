import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { ReactElement, useEffect, useState } from "react";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

type Props = {
  createdByAuthor: any;
  bountyAmount: number;
  expirationDate: string;
  bountyContentSnippet: string;
};
export default function BountiesSidebarItem({
  createdByAuthor,
  bountyAmount,
  expirationDate,
  bountyContentSnippet,
}: Props): ReactElement {
  const roundedOfferAmount = bountyAmount.toFixed(2);

  return (
    <div className={css(styles.bountiesSidebarItemContainer)}>
      <div className={css(styles.bountiesSidebarItemHeader)}>
        <AuthorFacePile
          authorProfiles={[createdByAuthor]}
          withAuthorName
          imgSize={14}
          fontColor={colors.TEXT_GREY(1)}
        />
        <span className={css(styles.bountiesSidebarTitle)}>
          {"is offering "}
          <span
            style={{
              color: colors.TEXT_GREY(1),
              fontSize: 14,
              fontWeight: 500,
              marginLeft: 4,
            }}
          >
            {roundedOfferAmount}
            {" RSC"}
          </span>
          <img
            style={{ width: 14, marginLeft: 8 }}
            src={"/static/icons/coin-filled.png"}
            draggable={false}
            alt="RSC Coin"
          />
        </span>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  bountiesSidebarItemContainer: {
    display: "flex",
    flexDirection: "column",
    // height: 120,
    justifyContent: "center",
    width: "100%",
    paddingLeft: 20,
  },
  bountiesSidebarTitle: {
    marginLeft: -6,
    display: "flex",
    alignItems: "flex-start",
  },
  bountiesSidebarItemHeader: {
    display: "flex",
    fontSize: 14,
  },
});
