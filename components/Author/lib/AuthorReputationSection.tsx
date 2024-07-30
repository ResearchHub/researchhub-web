import { css, StyleSheet } from "aphrodite";
import Tooltip from "@mui/material/Tooltip";
import ReputationGauge from "../lib/ReputationGauge";
import { DEMO_BINS, Reputation } from "../lib/types";
import colors from "~/config/themes/colors";

const getTooltipText = (percentile) => {
  let text = "";
  if (percentile === 1) {
    text += "1st ";
  } else if (percentile === 2) {
    text += "2nd ";
  } else if (percentile === 3) {
    text += "3rd ";
  } else {
    text += percentile + "th ";
  }
  text += "percentile relative to other researchers globally in this field.";
  return text;
};

const AuthorReputationSection = ({
  reputationList,
  limit = -1,
}: {
  reputationList: Reputation[];
  limit?: number;
}) => {
  let repListToRender = reputationList;
  if (limit > 0) {
    repListToRender = reputationList.slice(0, limit);
  }
  if (repListToRender.length < limit) {
    // Show the reminder from DEMO_BINS
    const remainder = DEMO_BINS.slice(0, limit - repListToRender.length);
    repListToRender = repListToRender.concat(remainder);
  }

  return (
    <>
      {repListToRender.map((rep, index) => (
        <div className={css(styles.reputation)} key={"rep" + index}>
          <div className={css(styles.reputationHubLabel)}>
            <span>{rep.hub.name}</span>
            <span className={css(styles.percentile)}>
              <Tooltip
                title={getTooltipText(rep.percentile)}
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: 14,
                      bgcolor: colors.GREY(),
                      fontWeight: 400,
                      color: colors.BLACK(1.0),
                    },
                  },
                }}
              >
                <div>{rep.percentile <= 1 ? "< 1%" : rep.percentile + "%"}</div>
              </Tooltip>
            </span>
          </div>
          <ReputationGauge reputation={rep} key={`reputation-` + index} />
        </div>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  percentile: {
    color: colors.MEDIUM_GREY2(),
    fontWeight: 400,
    fontSize: 14,
    cursor: "pointer",
  },
  reputation: {
    marginTop: 10,
    ":first-child": {
      marginTop: 0,
    },
  },
  reputationHubLabel: {
    fontSize: 14,
    marginBottom: 5,
    textTransform: "capitalize",
    justifyContent: "space-between",
    display: "flex",
  },
});

export default AuthorReputationSection;
