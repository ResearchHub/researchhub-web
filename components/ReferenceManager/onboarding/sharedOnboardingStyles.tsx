import { StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const sharedOnboardingStyles = StyleSheet.create({
  h1: {
    fontSize: 42,
    fontWeight: 500,
    textAlign: "center",
  },
  subtext: {
    fontSize: 24,
    color: "#AAA8B4",
    marginTop: 24,
    marginBottom: 40,
    textAlign: "center",
  },
  continueButton: {
    background: colors.NEW_BLUE(1),
    color: "#fff",
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
    ":hover": {
      borderColor: "#E8E8F2",
      ":focus": {
        borderColor: "#3f85f7",
      },
    },
  },
});

export default sharedOnboardingStyles;
