import { css, StyleSheet } from "aphrodite";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { ModalActions } from "~/redux/modals";
import { ReactElement, SyntheticEvent, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import ALink from "../ALink";
import colors from "~/config/themes/colors";
import { nullthrows } from "~/config/utils/nullchecks";

type Props = { closeDropdown: () => void };

function RscBalanceHistoryDropContentCard({
  withdrawal,
}: {
  withdrawal: any;
}): ReactElement {
  const getTitle = () => {
    let title =
      withdrawal.source?.purchase_type === "DOI"
        ? `DOI`
        : withdrawal.source?.purchase_type === "BOOST"
        ? "Supported Content"
        : withdrawal.source?.distribution_type === "PURCHASE"
        ? "Received Support"
        : withdrawal.source?.distribution_type
        ? withdrawal.source?.distribution_type
            .replaceAll("_", " ")
            .toLocaleLowerCase()
        : withdrawal.source?.to_address
        ? "Withdrawal"
        : "";
    if (withdrawal.readable_content_type === "bounty") {
      title = `Bounty #${withdrawal.source.id}: ${withdrawal.source.status}`;
    } else if (withdrawal.readable_content_type === "bountyfee") {
      title = "ResearchHub Platform Fee";
    }
    return title;
  };
  const displayTitle = getTitle();
  const displayCreatedDate = withdrawal?.created_date;

  return (
    <div className={css(styles.rscBalanceHistoryDropContentCard)}>
      <div>
        <div>{displayTitle}</div>
        <div>
          {nullthrows(
            withdrawal?.amount,
            "withdrawal amount should not be null"
          ) ?? 0}
        </div>
      </div>
      <div>{displayCreatedDate}</div>
    </div>
  );
}

export default function RscBalanceHistoryDropContent({
  closeDropdown,
}: Props): ReactElement {
  const dispatch = useDispatch();
  const reduxState = useStore()?.getState() ?? {};
  const transactionWidthdrawls = reduxState.transactions?.withdrawals ?? [];
  const currentUser = getCurrentUser();

  const transactionCards = transactionWidthdrawls.map(
    (
      transWithdrawal,
      index: number
    ): ReactElement<typeof RscBalanceHistoryDropContentCard> => (
      <RscBalanceHistoryDropContentCard
        withdrawal={transWithdrawal}
        key={`rscBalanceHistory-${transWithdrawal.id}-${index} `}
      />
    )
  );

  return (
    <div className={css(styles.rscBalanceHistoryDropContent)}>
      <div className={css(styles.historyHeader)}>
        <div
          className={css(styles.withdrawButton)}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            closeDropdown();
            dispatch(ModalActions.openWithdrawalModal(true));
          }}
        >
          {"Withdraw RSC"}
        </div>
        <ALink href={`/user/${currentUser?.id}/rsc`}>{"View all"}</ALink>
      </div>
      <div className={css(styles.historyContent)}>{transactionCards}</div>
    </div>
  );
}

const styles = StyleSheet.create({
  rscBalanceHistoryDropContent: {
    background: "#fff",
    border: `2px solid ${colors.LIGHT_GREY_BORDER}`,
    borderRadius: 4,
    minWidth: 320,
  },
  rscBalanceHistoryDropContentCard: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  historyHeader: {
    alignItems: "center",
    borderBottom: `2px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    fontSize: 14,
    height: 44,
    justifyContent: "space-between",
    padding: "0 16px",
  },
  historyContent: {},
  withdrawButton: {
    alignItems: "center",
    background: colors.NEW_BLUE(),
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    fontSize: 12,
    height: 20,
    justifyContent: "center",
    padding: "4px 8px",
  },
});
