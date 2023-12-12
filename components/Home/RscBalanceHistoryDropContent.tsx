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
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import ReputationTooltip from "~/components/ReputationTooltip";
import ReactTooltip from "react-tooltip";
import { useExchangeRate } from "../contexts/ExchangeRateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/pro-solid-svg-icons";

type Props = { closeDropdown: () => void };

function RscBalanceHistoryDropContentCard({
  withdrawal,
}: {
  withdrawal: any;
}): ReactElement {
  const { rscToUSDDisplay } = useExchangeRate();

  const getTitle = () => {
    let title =
      withdrawal.source?.distribution_type === "RhCOMMENT_UPVOTED"
        ? "Comment Upvoted"
        : withdrawal.source?.purchase_type === "DOI"
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
    } else if (withdrawal.readable_content_type === "purchase") {
      title = withdrawal.source?.purchase_type
        ?.replaceAll("_", " ")
        .toLocaleLowerCase();
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
          ) ?? 0}{" "}
          <img
            src="/static/icons/coin-filled.png"
            className={css(styles.rscIcon)}
            alt="researchhub-coin-icon"
          />
        </div>
      </div>
      <div className={css(styles.dropContentDate)}>
        {displayCreatedDate}
        <div>≈ {rscToUSDDisplay(withdrawal?.amount)}</div>
      </div>
    </div>
  );
}

export default function RscBalanceHistoryDropContent({
  closeDropdown,
}: Props): ReactElement {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const [transactionWidthdrawls, setTransWithdrawals] = useState<any[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(
    !isEmpty(transactionWidthdrawls)
  );

  const { rscToUSDDisplay } = useExchangeRate();

  const { balance } = currentUser;

  useEffect((): void => {
    const fetchRSCBalance = async () => {
      if (!isDataFetched) {
        const dataFetched = await fetchRscBalanceHistory({
          onError: emptyFncWithMsg,
          onSuccess: ({ withdrawals }) => setTransWithdrawals(withdrawals),
        });

        if (dataFetched) {
          setIsDataFetched(true);
        }
      }
    };

    fetchRSCBalance();
  }, [isDataFetched]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

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
      <ReputationTooltip />
      <div className={css(styles.historyHeader)}>
        <div className={css(styles.header)}>
          <div className={css(styles.top)}>
            <div
              data-for={"reputation-tool-tip"}
              data-tip=""
              className={css(styles.rscReputation)}
            >
              <ResearchCoinIcon
                overrideStyle={styles.rscIconLarge}
                height={18}
                width={18}
              />
              <div className={css(styles.balanceText)}>
                ResearchCoin{" "}
                <span className={css(styles.dropContentDate)}>(RSC)</span>
              </div>
            </div>
            <ALink
              href={`/user/${currentUser?.author_profile?.id}/rsc`}
              theme="solidPrimary"
              overrideStyle={styles.viewAllButton}
            >
              <span onClick={closeDropdown}>{"View all"}</span>
            </ALink>
          </div>
        </div>
      </div>
      <div className={css(styles.transactionCardWrap)}>
        <ReactPlaceholder
          ready={isDataFetched}
          customPlaceholder={Array.from(new Array(8)).map((_, idx) => (
            <PreviewPlaceholder
              color="#efefef"
              hideAnimation={false}
              key={`placeholder-${idx}`}
              previewStyles={styles.previewPlaceholder}
            />
          ))}
        >
          {transactionCards}
        </ReactPlaceholder>
      </div>
      <div className={css(styles.ctaWrapper)}>
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

        <div
          className={css(styles.depositButton)}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            closeDropdown();
            dispatch(ModalActions.openWithdrawalModal(true, true));
          }}
        >
          {"Deposit RSC"}
        </div>
        <a
          className={css(styles.depositButton, styles.trade)}
          target="_blank"
          href={
            "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd101dcc414f310268c37eeb4cd376ccfa507f571"
          }
          onClick={(event: SyntheticEvent): void => {
            closeDropdown();
          }}
        >
          {"Trade RSC"}
          <div className={css(styles.arrowOut)}>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </div>
        </a>
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
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
  },
  header: {
    width: "100%",
  },
  viewAllButton: {
    marginLeft: "auto",
    fontSize: 14,
  },
  top: {
    display: "flex",
    alignItems: "center",
    columnGap: "7px",
    fontSize: 16,
    width: "100%",
    fontWeight: 500,
  },
  rscReputation: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "pre-wrap",
    cursor: "pointer",
  },
  rscToDisplay: {},
  balanceText: {
    fontSize: 16,
    fontWeight: 500,
    whiteSpace: "pre-wrap",
    display: "flex",
    alignItems: "center",
    // opacity: 0.8,
    // color: colors.ORANGE_DARK2(),
  },
  text: {
    color: "#7C7989",
    textDecoration: "none",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  ctaWrapper: {
    padding: "16px 15px",
    borderTop: `2px solid ${colors.LIGHT_GREY_BORDER}`,
  },
  rscBalanceHistoryDropContentCard: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    paddingBottom: 12,
    paddingTop: 12,
    ":last-child": {
      borderBottom: `none`,
    },
  },
  rscIcon: { width: 14, margin: "0 0 0 4px" },
  rscIconLarge: { height: 18, marginRight: 6 },
  historyHeader: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    fontSize: 14,
    justifyContent: "space-between",
    padding: "12px 12px",
  },
  transactionCardWrap: {
    maxHeight: 320,
    overflowY: "scroll",
    padding: "0px 15px",
  },
  withdrawButton: {
    alignItems: "center",
    background: colors.NEW_BLUE(),
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    justifyContent: "center",
    padding: "10px 15px",
    borderTop: `1px solid ${colors.LIGHT_GREY_BORDER}`,
  },
  trade: {
    borderColor: "rgb(251, 17, 142)",
    color: "rgb(251, 17, 142)",
    textDecoration: "none",
    position: "relative",
  },
  arrowOut: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
  },
  uniswapLogo: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
  },
  depositButton: {
    alignItems: "center",
    border: `1px solid ${colors.NEW_BLUE()}`,
    borderRadius: 4,
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    justifyContent: "center",
    padding: "10px 15px",
    marginTop: 7,
  },
  dropContentContent: {
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    justifyContent: "space-between",
    padding: "0px 0px 5px 0px",
  },
  dropContentDate: {
    fontSize: 12,
    color: colors.LIGHT_GREY_TEXT,
    display: "flex",
    justifyContent: "space-between",
  },
  previewPlaceholder: {
    width: "calc(100% - 16px)",
    height: 28,
    border: "none",
    boxSizing: "border-box",
    margin: 8,
  },
});
