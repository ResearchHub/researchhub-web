import colors from "~/config/themes/colors";
import { FullAuthorProfile, Reputation } from "../lib/types";
import { css, StyleSheet } from "aphrodite";

const ReputationGauge = ({ reputation }: { reputation: Reputation }) => {
  const userBinPos = reputation.bins.findIndex(
    (bin) => reputation.score >= bin[0] && reputation.score <= bin[1]
  );

  return (
    <div className={css(styles.gauge)}>
      {reputation.bins.map((bin, index) => {
        let binShadePct = 0;
        if (index === 0 && userBinPos === 0) {
          binShadePct = Math.max(0.5, reputation.score / bin[1]);
        } else if (index < userBinPos) {
          binShadePct = 1;
        } else if (index === userBinPos) {
          binShadePct = reputation.score / reputation.bins[userBinPos][1];
        } else if (index > userBinPos) {
          binShadePct = 0;
        }

        return (
          <div className={css(styles.bin)} key={`bin-` + index}>
            <div
              className={css(styles.binFilled)}
              style={{ width: `${binShadePct * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
};

const styles = StyleSheet.create({
  gauge: {
    display: "flex",
    columnGap: "2px",
    height: 16,
  },
  bin: {
    background: "rgba(240, 240, 240, 1)",
    width: "25%",
    height: "100%",
    position: "relative",
  },
  binFilled: {
    background: colors.LIGHT_BLUE3(),
    position: "absolute",
    height: "100%",
  },
});

export default ReputationGauge;
