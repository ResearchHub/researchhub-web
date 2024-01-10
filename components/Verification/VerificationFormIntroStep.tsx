import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Button from "../Form/Button";
import VerifiedBadge from "./VerifiedBadge";

const VerificationFormIntroStep = ({ nextStep }) => {
  return (
    <div>
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>
          <div className={css(styles.badgeWrapper)}>
            <VerifiedBadge width={35} height={35} showTooltipOnHover={false} />
          </div>
          <span>
            Become a Verified Author
          </span>
        </div>
        <p className={css(styles.description)}>
          ResearchHub is allowing scientific authors with at least one published
          paper to verify their identity on the platform.
        </p>
      </div>

      <div className={css(styles.whyVerify)}>
        <div className={css(styles.subtitle)}>
          Reasons to become a verified author:
        </div>
        <ul className={css(styles.list)}>
          <li className={css(styles.listItem)}>
            <div style={{ display: "inline-flex", columnGap: 10 }}>
              Have the verified badge appear next to your name
            </div>
          </li>
          <li className={css(styles.listItem)}>
            Improve your academic reputation on the platform
          </li>
          <li className={css(styles.listItem)}>
            Earn ResearchCoin on your papers
          </li>
        </ul>
      </div>

      <div className={css(styles.subtitle)}>Requirements</div>
      <ul className={css(styles.list)}>
        <li className={css(styles.listItem)}>
          At least one published paper with DOI
        </li>
        <li className={css(styles.listItem)}>
          Have access to an email affiliated with an academic institution
        </li>
        <li className={css(styles.listItem)}>Profile must have authentic and clear photo of your face</li>
        <li className={css(styles.listItem)}>Profile name must match the name on the published paper</li>
        <li className={css(styles.listItem)}>
          Profile must be updated to include the following information:
          <ul>
            <li className={css(styles.listItem)}>Academic institution(s)</li>
            <li className={css(styles.listItem)}>Biography</li>
            <li className={css(styles.listItem)}>Orcid url (Recommended)</li>
          </ul>
        </li>
      </ul>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20,   }}>
        <div style={{ width: 160,   }}>
          <Button onClick={nextStep} label={"Start"} fullWidth />
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  notice: {
    fontSize: 14,
    marginBottom: 0,
    color: "rgb(205 133 8)",
  },
  header: {
    borderBottom: `1px solid ${colors.BLACK(0.1)}`,
    marginBottom: 20,
  },
  badgeWrapper: {
    justifyContent: "center",
    display: "flex",
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "left",
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 22
    },    
  },
  whyVerify: {},
  subtitle: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: 15,
    marginBottom: 8,
  },

  listItem: {
    fontSize: 14,
  },
  list: {
    padding: 0,
    paddingLeft: 5,
    lineHeight: "1.5em",
    listStylePosition: "inside",
  },
});

export default VerificationFormIntroStep;
