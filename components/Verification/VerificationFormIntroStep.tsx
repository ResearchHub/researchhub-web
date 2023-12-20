import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Button from "../Form/Button";
import VerifiedBadge from "./VerifiedBadge";

const VerificationFormIntroStep = ({ nextStep }) => {
  return (
    <div>
      {/* <VerifiedBadge width={100} height={100} showTooltipOnHover={false} /> */}
      <div className={css(styles.title)}>Become a Verified Author</div>
      <p className={css(styles.description)}>
        ResearchHub is allowing scientific authors with at least one published
        paper to verify their identity on the platform.
      </p>

      <div className={css(styles.subtitle)}>Requirements</div>
      <ul className={css(styles.list)}>
        <li className={css(styles.listItem)}>
          Have published at least one paper with a DOI
        </li>
        <li className={css(styles.listItem)}>
          Have access to an email affiliated with an academic institution
        </li>
        <li className={css(styles.listItem)}>Profile must have a photo</li>
        <li className={css(styles.listItem)}>
          Profile must have name matching the name on the published paper
        </li>
      </ul>

      <div className={css(styles.whyVerify)}>
        <div className={css(styles.subtitle)}>
          Reasons to become a verified author:
        </div>
        <ul className={css(styles.list)}>
          <li className={css(styles.listItem)}>
            Improve your academic reputation on the platform
          </li>
          <li className={css(styles.listItem)}>
            Get early access to new features
          </li>
          <li className={css(styles.listItem)}>
            Earn ResearchCoin on your papers
          </li>
          <li className={css(styles.listItem)}>
            <div style={{ display: "inline-flex", columnGap: 10 }}>
              Have the verified badge appear next to your name
            </div>
          </li>
        </ul>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={nextStep} label={"Start"} />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    marginTop: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
  },
  whyVerify: {},
  subtitle: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: 20,
  },
  listItem: {
    fontSize: 15,
  },
  list: {
    padding: 0,
    paddingLeft: 10,
    lineHeight: "1.5em",
    listStylePosition: "inside",
  },
});

export default VerificationFormIntroStep;
