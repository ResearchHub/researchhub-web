import HorizontalTabBar from "~/components/HorizontalTabBar";
import { buildAuthorTabs } from "~/components/Author/lib/utils";
import { useRouter } from "next/router";
import { authorProfileContext } from "~/components/Author/lib/AuthorProfileContext";
import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";

const AuthorNavigation = () => {
  const router = useRouter();
  const { fullAuthorProfile, summaryStats } = authorProfileContext();
  const authorTabs = buildAuthorTabs({ profile: fullAuthorProfile, summaryStats, router });

  return (
    <div className={css(styles.tabsWrapper)}>
      <HorizontalTabBar tabs={authorTabs} />
    </div>
  );
};

const styles = StyleSheet.create({
  tabsWrapper: {
    width: "1000px",
    margin: "0 auto",
    marginTop: 20,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "100%",
    },    
  },
});

export default AuthorNavigation;
