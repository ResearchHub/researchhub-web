import { Button as Btn, IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import Button from "~/components/Form/Button";
import { css, StyleSheet } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faWarning } from "@fortawesome/pro-solid-svg-icons";
import { RewardsEligibilityInfo } from "../ResearchCoin/lib/rewardsUtil";

const getTooltipContent = (rewardEligibilityInfo: RewardsEligibilityInfo) => {
  if (rewardEligibilityInfo.isEligibleForRewards) {
    return (
      <div className={css(styles.tooltip, styles.tooltipEligible)}>
        <div className={css(styles.tooltipLineItem)}>
          <FontAwesomeIcon icon={faCircleCheck} color={colors.GREEN()} />
          This paper meets our healthy research rewards criteria.
        </div>          
      </div>
    )
  }
  else {
    return (
      <div className={css(styles.tooltip)}>
        <div className={css(styles.tooltipLineItem)}>
          <FontAwesomeIcon icon={faWarning} color={colors.MEDIUM_GREY2()} />
          {rewardEligibilityInfo.reason === "NOT_FIRST_AUTHOR" && "Only first authors are eligible for rewards at this time."}
          {rewardEligibilityInfo.reason === "NOT_SUPPORTED_TYPE" && "Only primary literature is eligible for rewards at this time."}
        </div>          
      </div>
    )
  }
}


const ClaimRewardsButton = ({ rewardEligibilityInfo, handleClick }: { rewardEligibilityInfo: RewardsEligibilityInfo, handleClick: Function }) => {
  if (rewardEligibilityInfo.isEligibleForRewards) {
    return (
      <Tooltip
        title={getTooltipContent(rewardEligibilityInfo)}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: 14,
              bgcolor: "#EEF8EE",
            },
          },
        }}
      >
        <div>
          <Button
            size="small"
            variant="contained"
            customButtonStyle={styles.claimButton}
            onClick={handleClick}
          >
            <div
              style={{
                color: colors.NEW_GREEN(),
                display: "flex",
                alignItems: "center",
                columnGap: 10,
              }}
            >
              <ResearchCoinIcon version={4} color={colors.NEW_GREEN()} />{" "}
              Claim rewards
            </div>
          </Button>
        </div>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip
        title={getTooltipContent(rewardEligibilityInfo)}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: 14,
              bgcolor: "#F3F3F3",
              color: colors.BLACK(),
            },
          },
        }}        
      >
        <div>
        <Button
          size="small"
          variant="contained"
          disabled
          customButtonStyle={styles.claimButtonNotEligible}
        >
          <div
            style={{
              color: "rgba(0, 0, 0, 0.40)",
              display: "flex",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <ResearchCoinIcon
              version={4}
              color={"rgba(0, 0, 0, 0.40)"}
            />{" "}
            Claim rewards
          </div>
        </Button>
        </div>
      </Tooltip>
    );
  }
}

const styles = StyleSheet.create({
  tooltip: {
    padding: 6,
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    alignContent: "center", 
    gap: 5,
  },  
  tooltipEligible: {
    color: colors.BLACK(),
  },
  claimButton: {
    background: colors.NEW_GREEN(0.1),
    border: `1px solid ${colors.NEW_GREEN()}`,
    marginTop: 20,
    marginBottom: 5,
  },
  claimButtonNotEligible: {
    background: "rgba(0, 0, 0, 0.12)",
    border: `1px solid rgba(0, 0, 0, 0.12)`,
    marginTop: 20,
    marginBottom: 5,
  },
  tooltipLineItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 400,
  },  
})

export default ClaimRewardsButton;