import { StyleSheet, css } from "aphrodite";
import RHLogo from "~/components/Home/RHLogo";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { CSSProperties } from "aphrodite/no-important";
import { NextPage } from "next";

interface StyleDeclaration {
  [key: string]: CSSProperties;
}

const MaintenancePage: NextPage = () => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.content)}>
        <div className={css(styles.logoWrapper)}>
          <RHLogo withText iconStyle={styles.logo as any} />
        </div>
        <h1 className={css(styles.title)}>We'll be back soon!</h1>
        <p className={css(styles.message)}>
          ResearchHub is currently undergoing scheduled maintenance. We'll be back shortly.
        </p>
        <p className={css(styles.submessage)}>
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

const styles = StyleSheet.create<StyleDeclaration>({
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.GREY_ICY_BLUE_HUE,
    padding: 20,
  },
  content: {
    textAlign: "center",
    maxWidth: 600,
    padding: "40px 20px",
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  logoWrapper: {
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 45,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 160,
    },
  },
  title: {
    fontSize: 32,
    fontWeight: 500,
    color: colors.NEW_BLUE(),
    marginBottom: 20,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 28,
    },
  },
  message: {
    fontSize: 18,
    lineHeight: 1.5,
    color: colors.BLACK(0.8),
    marginBottom: 16,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
    },
  },
  submessage: {
    fontSize: 16,
    color: colors.BLACK(0.6),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 14,
    },
  },
});

export default MaintenancePage; 