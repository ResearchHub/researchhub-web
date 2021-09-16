import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { RHLogo } from "~/config/themes/icons";
import Button from "../Form/Button";

function FeedNewFeatureBox({
  feature,
  featureHeadline,
  description,
  bannerExists,
}) {
  return (
    <div className={css(styles.container, bannerExists && styles.bannerExists)}>
      <RHLogo />
      <div className={css(styles.title)}>Introducing {feature}</div>
      <div className={css(styles.description)}>{description}</div>
      <Button
        label={"Learn More"}
        customButtonStyle={styles.customButtonStyle}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    padding: 16,
    marginBottom: 4,
    border: "1px solid #ededed",
    background: "#fff",
    textAlign: "center",

    "@media only screen and (min-width: 1024px)": {
      padding: "28px 60px",
    },
    // color: '#fff',
    // letterSpacing: .7,
    // marginTop: 16,
  },
  bannerExists: {
    marginTop: 16,
  },
  title: {
    fontWeight: 500,
    fontSize: 22,
    marginBottom: 16,
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "left",
    whiteSpace: "pre-wrap",
  },
  customButtonStyle: {
    marginTop: 16,
  },
});

export default FeedNewFeatureBox;
