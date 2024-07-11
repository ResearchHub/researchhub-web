import HorizontalTabBar from "~/components/HorizontalTabBar";
import { buildAuthorTabs } from "~/components/Author/lib/utils";
import { useRouter } from "next/router";
import { authorProfileContext } from "~/components/Author/lib/AuthorProfileContext";
import { css, StyleSheet } from "aphrodite";

const AuthorNavigation = () => {
  const router = useRouter();
  const { fullAuthorProfile } = authorProfileContext();
  const authorTabs = buildAuthorTabs({ profile: fullAuthorProfile, router });

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
  },
});

export default AuthorNavigation;
