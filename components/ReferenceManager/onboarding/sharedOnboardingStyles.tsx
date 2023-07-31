import { StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const sharedOnboardingStyles = StyleSheet.create({
  h1: {
    fontSize: 42,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 0,
  },
  subtext: {
    fontSize: 24,
    color: colors.VOTE_ARRROW,
    marginTop: 12,
    marginBottom: 30,
    textAlign: "center",
  },
  continueButton: {
    background: colors.NEW_BLUE(1),
    color: colors.WHITE(),
    // maxWidth: 440,
    width: "100%",
    border: 0,
    height: 50,
    borderRadius: 4,
    fontSize: 18,
    cursor: "pointer",
  },
  spacer: {
    padding: 40,
  },
  input: {
    cursor: "text",
    ":focus": {
      ":hover": {
        boxShadow: "none",
      },
    },
    ":hover": {
      borderColor: colors.LIGHT_GREYISH_BLUE,
      outline: "none",
      boxShadow: "none",
      ":focus": {
        borderColor: "#3f85f7",
      },
    },
  },
});

export default sharedOnboardingStyles;
