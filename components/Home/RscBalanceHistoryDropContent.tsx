import { css, StyleSheet } from "aphrodite";
import {
  emptyFncWithMsg,
  isEmpty,
  nullthrows,
} from "~/config/utils/nullchecks";
import { fetchRscBalanceHistory } from "./api/fetchRscBalanceHistory";
import { formatDateStandard } from "~/config/utils/dates";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { ModalActions } from "~/redux/modals";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ALink from "../ALink";
import colors from "~/config/themes/colors";
import PreviewPlaceholder from "../Placeholders/PreviewPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import { toTitleCase } from "~/config/utils/string";
import { formatBountyAmount } from "~/config/types/bounty";

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
    return toTitleCase(title);
  };
  const displayTitle = getTitle();
  const displayCreatedDate = formatDateStandard(withdrawal?.created_date);

  return (
    <div className={css(styles.rscBalanceHistoryDropContentCard)}>
      <div className={css(styles.dropContentContent)}>
        <div>{displayTitle}</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {nullthrows(
            formatBountyAmount({ amount: withdrawal?.amount ?? 0 }),
            "withdrawal amount should not be null"
          ) ?? 0}
          <img
            src="/static/icons/coin-filled.png"
            className={css(styles.rscIcon)}
            alt="researchhub-coin-icon"
          />
        </div>
      </div>
      <div className={css(styles.dropContentDate)}>{displayCreatedDate}</div>
    </div>
  );
}

export default function RscBalanceHistoryDropContent({
  closeDropdown,
}: Props): ReactElement {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const [transactionWidthdrawls, setTransWithdrawals] = useState<any[]>([]);
  const isDataFetched = !isEmpty(transactionWidthdrawls);

  useEffect((): void => {
    if (!isDataFetched) {
      fetchRscBalanceHistory({
        onError: emptyFncWithMsg,
        onSuccess: ({ withdrawals }) => setTransWithdrawals(withdrawals),
      });
    }
  }, [isDataFetched]);

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
        <ALink href={`/user/${currentUser?.author_profile?.id}/rsc`}>
          <span onClick={closeDropdown}>{"View all"}</span>
        </ALink>
      </div>
      <div className={css(styles.transactionCardWrap)}>
        <ReactPlaceholder
          ready={isDataFetched}
          customPlaceholder={[
            <PreviewPlaceholder
              color="#efefef"
              hideAnimation={false}
              key="placeholder-1"
              previewStyles={styles.previewPlaceholder}
            />,
            <PreviewPlaceholder
              color="#efefef"
              hideAnimation={false}
              key="placeholder-2"
              previewStyles={styles.previewPlaceholder}
            />,
            <PreviewPlaceholder
              color="#efefef"
              hideAnimation={false}
              key="placeholder-3"
              previewStyles={styles.previewPlaceholder}
            />,
          ]}
        >
          {transactionCards}
        </ReactPlaceholder>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  rscBalanceHistoryDropContent: {
    background: "#fff",
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    borderRadius: 4,
    minWidth: 320,
    marginTop: 8,
  },
  rscBalanceHistoryDropContentCard: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    paddingBottom: 8,
  },
  rscIcon: { width: 14, margin: "0 0 0 4px" },
  historyHeader: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    fontSize: 14,
    height: 44,
    justifyContent: "space-between",
    padding: "0 12px",
  },
  transactionCardWrap: {
    maxHeight: 320,
    overflowY: "scroll",
  },
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
  dropContentContent: {
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    justifyContent: "space-between",
    padding: "8px 12px",
  },
  dropContentDate: {
    padding: "0 12px",
    fontSize: 12,
    color: colors.LIGHT_GREY_TEXT,
  },
  previewPlaceholder: {
    width: "calc(100% - 16px)",
    height: 28,
    border: "none",
    boxSizing: "border-box",
    margin: 8,
  },
});
