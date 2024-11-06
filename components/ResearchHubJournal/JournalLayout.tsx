import { css, StyleSheet } from "aphrodite";
import { useRouter } from 'next/router';
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

type JournalLayoutProps = {
  children: React.ReactNode;
};

export default function JournalLayout({ children }: JournalLayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.tabNavigation)}>
        <div className={css(styles.tabContainer)}>
          <button 
            className={css(styles.tab, currentPath === "/researchhub-journal" && styles.activeTab)}
            onClick={() => router.push('/researchhub-journal')}
          >
            About
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "100vh",
  },
  tabNavigation: {
    width: "100%",
    background: colors.WHITE(),
    borderBottom: `1px solid ${colors.GREY_LINE(0.15)}`,
    position: 'relative',
  },
  tabContainer: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px",
    display: "flex",
    gap: "40px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "0 20px",
      gap: "24px",
    },
  },
  tab: {
    padding: "20px 8px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    color: colors.BLACK(0.5),
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    position: 'relative',
    transition: "all 0.2s ease",
    ':after': {
      content: '""',
      position: 'absolute',
      bottom: -1,
      left: 0,
      width: '100%',
      height: '2px',
      background: colors.NEW_BLUE(0.8),
      borderRadius: '2px 2px 0 0',
      transform: 'scaleX(0)',
      transition: 'transform 0.2s ease',
    },
    ":hover": {
      color: colors.NEW_BLUE(0.7),
      ':after': {
        transform: 'scaleX(0.8)',
      }
    },
  },
  activeTab: {
    color: colors.NEW_BLUE(),
    background: colors.NEW_BLUE(0.03),
    ':after': {
      transform: 'scaleX(1)',
    },
    ':hover': {
      color: colors.NEW_BLUE(),
      ':after': {
        transform: 'scaleX(1)',
      }
    },
  },
}); 