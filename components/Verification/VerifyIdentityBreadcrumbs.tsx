import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";
import { STEP } from "./VerifyIdentityModal";

const VerifyIdentityBreadcrumbs = ({ step }: { step: STEP }) => {
  return (
    <div className={css(styles.breadcrumbs)}>
      <div className={css(styles.step)}>
        <div className={css(styles.num, step === "IDENTITY" && styles.selectedStep)}>
          <div>1</div>
        </div>
        <div className={css(step === "IDENTITY" && styles.selectedStep)}>Verify Identity</div>
      </div>
      <div className={css(styles.line)} style={{ marginRight: -11 }}></div>
      <div className={css(styles.step)}>
        <div className={css(styles.num, step === "PUBLICATIONS" && styles.selectedStep)}>
          <div>2</div>
        </div>
        <div className={css( step === "PUBLICATIONS" && styles.selectedStep)}>Publication History</div>
      </div>
      <div className={css(styles.line)} style={{ marginLeft: -13 }}></div>
      <div className={css(styles.step)}>
        <div className={css(styles.num)}>
          <div>3</div>
        </div>
        <div>View Rewards</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  breadcrumbs: {
    display: "flex",
    justifyContent: "space-between",
    color: "#AAA8B4",
    alignItems: "center",
  },
  step: {
    fontSize: 12,
    fontWeight: 500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  selectedStep: {
    borderColor: colors.NEW_BLUE(),
    color: colors.NEW_BLUE(),
  },
  line: {
    width: 34,
    height: 2,
    marginTop: -24,
    backgroundColor: "#DEDEE6",
  },
  num: {
    borderRadius: "50px",
    padding: 8,
    border: `1px solid ${colors.LIGHT_GREY()}`,
    fontSize: 16,
    fontWeight: 500,
    height: 16,
    width: 16,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default VerifyIdentityBreadcrumbs;