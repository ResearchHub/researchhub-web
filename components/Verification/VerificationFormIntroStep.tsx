import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Button from "../Form/Button";
import VerifiedBadge from "./VerifiedBadge";

const VerificationFormIntroStep = ({ nextStep }) => {
  return (
    <div>
      <div className={css(styles.header)}>
        <div className={css(styles.badgeWrapper)}>
          <VerifiedBadge width={75} height={75} showTooltipOnHover={false} />
        </div>
        <div className={css(styles.title)}>
          Become a Verified Author
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
          <li className={css(styles.listItem)}>
            Get early access to new features
          </li>
        </ul>
      </div>

      <div className={css(styles.subtitle)}>Requirements</div>
      <ul className={css(styles.list)}>
        <li className={css(styles.listItem)}>
          Published at least one paper with a DOI
        </li>
        <li className={css(styles.listItem)}>
          Have access to an email affiliated with an academic institution
        </li>
        <li className={css(styles.listItem)}>Profile must have a photo and academic instituation(s) set</li>
        <li className={css(styles.listItem)}>
          Profile name must match the name on the published paper
        </li>
      </ul>


      <div style={{ display: "flex", justifyContent: "center", marginTop: 30,   }}>
        <div style={{ width: 160,   }}>
          <Button onClick={nextStep} label={"Start"} fullWidth />
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottom: `1px solid ${colors.BLACK(0.1)}`,
    marginBottom: 30,
  },
  badgeWrapper: {
    justifyContent: "center",
    display: "flex",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    textAlign: "center",
  },
  whyVerify: {},
  subtitle: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 8,
  },

  listItem: {
    fontSize: 14,
  },
  list: {
    padding: 0,
    paddingLeft: 10,
    lineHeight: "1.5em",
    listStylePosition: "inside",
  },
});

export default VerificationFormIntroStep;
