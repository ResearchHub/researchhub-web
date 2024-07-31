import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import Image from "next/image";
import { faChartPie, faLockOpen, faPieChart } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  isOpenAccess: boolean;
  isOpenData: boolean;
  isPreregistered: boolean;
  baseReward: number;
  preregistrationMultiplier?: number;
  openDataMultiplier?: number;
}

const ClaimRewardSummary = ({
  baseReward,
  isOpenAccess,
  isOpenData,
  isPreregistered,
  preregistrationMultiplier = 0,
  openDataMultiplier = 0
}: Props) => {

  const calculatedRewards = {
    openAccess: isOpenAccess ? baseReward : 0,
    openData: isOpenData ? baseReward * openDataMultiplier : 0,
    preregistration: isPreregistered ? baseReward * preregistrationMultiplier : 0,
    total: 0,
  }

  calculatedRewards.total = calculatedRewards.openAccess + calculatedRewards.openData + calculatedRewards.preregistration;

  return (
    <div>
      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>
          <div className={css(styles.lineItemIcon)}>
            <FontAwesomeIcon icon={faLockOpen} fontSize={16} />
          </div>
          Open Access:
        </div>
        <div className={css(styles.value)}>
          {calculatedRewards.openAccess.toLocaleString() + " RSC"}
        </div>
      </div>

      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>
          <div className={css(styles.lineItemIcon)}>
            <FontAwesomeIcon icon={faPieChart} fontSize={16} />
          </div>
          Open Data:
        </div>
        <div className={css(styles.value)}>
          {calculatedRewards.openData.toLocaleString() + " RSC"}
          <span className={css(styles.multiplier)}>
            {openDataMultiplier && ` ${openDataMultiplier}x`}
          </span>
        </div>
      </div>

      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>
          <div className={css(styles.lineItemIcon)}>
            <Image
              alt="blueprint"
              width={20}
              height={20}
              src={"/static/icons/blueprint_gray.svg"}
            />
          </div>          
          Preregistration:
        </div>
        <div className={css(styles.value)}>
          {calculatedRewards.preregistration.toLocaleString() + " RSC"}
          <span className={css(styles.multiplier)}>
            {preregistrationMultiplier && ` ${preregistrationMultiplier}x`}
          </span>
        </div>
      </div>      

      <div className={css(styles.lineItem, styles.totalLineItem)}>
        <div className={css(styles.label, styles.totalLabel)}>Total rewards:</div>
        <div className={css(styles.value, styles.totalValue)}>
          {calculatedRewards.total.toLocaleString() + " RSC"}
        </div>

      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  lineItem: {
    display: "flex",
    color: colors.MEDIUM_GREY2(),
    fontSize: 16,
    gap: 4,
    alignItems: "center",
    marginBottom: 5,
  },
  lineItemIcon: {
    width: 30,
  },
  label: {
    width: 160,
    display: "flex",
    alignItems: "center",
  },
  value: {
    color: colors.BLACK(),
    fontSize: 14
  },
  totalLineItem: {
    color: colors.NEW_GREEN(),
    borderTop: `1px solid ${colors.LIGHT_GREY()}`,
    width: 250,
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    width: "auto",
  },
  totalValue: {
    color: colors.NEW_GREEN(),
    fontSize: 14,
    fontWeight: 500,
  },
  multiplier: {
    fontWeight: 500,
    fontSize: 14,
    color: colors.BLACK(),
  }
});

export default ClaimRewardSummary;