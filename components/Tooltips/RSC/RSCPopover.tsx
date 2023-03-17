import { ReactElement } from "react";
import { css, StyleSheet } from "aphrodite";

// Utils
import { breakpoints } from "~/config/themes/screen";
import { useExchangeRate } from "~/components/contexts/ExchangeRateContext";
import { formatBountyAmount } from "~/config/types/bounty";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import ContentBadge from "~/components/ContentBadge";

const RSCPopover = ({ amount }: { amount: number }): ReactElement | null => {
  const { rscToUSDDisplay } = useExchangeRate();

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.row, styles.firstRow)}>
        <div className={css(styles.column)}>
          <ContentBadge
            contentType="bounty"
            badgeOverride={styles.badgeOverride}
            rscContentOverride={styles.rscContentOverride}
            label={
              <div
                style={{
                  display: "flex",
                  whiteSpace: "pre",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {formatBountyAmount({
                    amount,
                  })}{" "}
                  RSC
                </div>
                <div>≈</div>
                <div>{rscToUSDDisplay(amount)} USD</div>
              </div>
            }
          />
        </div>
        {/* <div className={css(styles.column, styles.priceColumn)}></div> */}
      </div>
      <div className={css(styles.lower)}>
        <div className={css(styles.row)}>
          <div className={css(styles.column)}>
            <a
              className={css(styles.text)}
              href={"https://docs.researchhub.com/researchcoin/token-overview"}
              target="_blank"
            >
              What is ResearchCoin?
            </a>
          </div>
        </div>
        <div>
          <div className={css(styles.row)}>
            <a
              className={css(styles.text)}
              href={
                "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd101dcc414f310268c37eeb4cd376ccfa507f571"
              }
              target="_blank"
            >
              ResearchCoin is on Uniswap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    background: "#fff",
    // padding: 12,
    borderRadius: 4,
    lineHeight: 1.4,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  rscIcon: {
    marginTop: 4,
    marginRight: 6,
  },
  row: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    marginBottom: 4,
    // columnGap: 5,
    whiteSpace: "pre",
  },
  firstRow: {
    marginBottom: 0,
  },
  lower: {
    padding: 16,
  },
  column: {
    flex: 1,
  },
  priceColumn: {
    marginLeft: "auto",
  },
  rscContentOverride: {
    width: "100%",
  },
  badgeOverride: {
    padding: "8px 16px",
    background: "#FDF8E6",
    borderRadius: 0,
    borderBottom: "1px solid #eee",
  },
  text: {
    color: "#7C7989",
    textDecoration: "none",
  },
});

export default RSCPopover;
