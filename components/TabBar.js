import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import colors, { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";
import Loader from "~/components/Loader/Loader";

// Components
import ComponentWrapper from "./ComponentWrapper";

const TabBar = (props) => {
  const selectedTab = props.selectedTab;
  const { dynamic_href, fetching } = props;
  const tabs = props.tabs.map(formatTabs);

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.tabContainer)}>
          {tabs.map((tab) => {
            if (tab.label === "transactions" || tab.label === "boosts") {
              let { user, author } = props;
              if (author.user !== user.id) {
                return null;
              }
            }
            return renderTab(
              tab,
              selectedTab,
              dynamic_href,
              props.fetching,
              props.author.id
            );
          })}
        </div>
      </ComponentWrapper>
    </div>
  );
};

function formatTabs(tab) {
  tab.key = `nav-link-${tab.href}`;
  return tab;
}

function renderTab(
  { key, href, label, showCount, count },
  selected,
  dynamic_href,
  fetching,
  userId
) {
  let isSelected = false;
  let classNames = [styles.tab];

  if (href === selected) {
    isSelected = true;
    classNames.push(styles.selected);
  }

  return (
    <Link key={key} href={dynamic_href} as={`/user/${userId}/${href}`}>
      <div className={css(classNames)}>
        <div className={css(styles.link)}>
          {label}{" "}
          {showCount && (
            <Count
              isSelected={isSelected}
              amount={count()}
              fetching={fetching}
            />
          )}
        </div>
      </div>
    </Link>
  );
}

const Count = (props) => {
  const { amount, isSelected, fetching } = props;
  // if (amount < 1) {
  //   return <span id="discussion_count"></span>;
  // }

  return (
    <UIStyling isSelected={isSelected}>
      <span
        id="discussion_count"
        className={css(styles.count, fetching & styles.loaderContainer)}
      >
        {fetching ? (
          <Loader
            size={4}
            loading={true}
            containerStyle={styles.loaderStyle}
            color={paperTabColors.FONT}
          />
        ) : amount > 0 ? (
          amount
        ) : (
          0
        )}
      </span>
    </UIStyling>
  );
};

const UIStyling = (props) => {
  const { isSelected, label } = props;
  return <span className={css(styles.ui)}>{props.children}</span>;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    overflow: "auto",
    borderBottom: "1px solid #F0F0F0",
    // background: paperTabColors.BACKGROUND,
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    minWidth: 450,
    justifyContent: "flex-start",
  },
  firstTab: {
    paddingLeft: 0,
  },
  tab: {
    color: "rgba(36, 31, 58, .6)",
    fontWeight: 500,
    padding: "1rem",

    "@media only screen and (min-width: 768px)": {
      marginRight: 28,
    },
    ":hover": {
      color: colors.PURPLE(1),
      cursor: "pointer",
    },
  },
  count: {
    padding: "3px 8px",
    borderRadius: 3,
    fontSize: 14,
  },
  ui: {
    border: "1px solid rgba(36, 31, 58, 0.1)",
    background: "rgba(36, 31, 58, 0.03)",
    color: "#241F3A",
    borderRadius: 3,
    marginLeft: 5,
  },
  selectedUi: {
    borderColor: colors.PURPLE(1),
  },
  link: {
    textAlign: "center",
    whiteSpace: "pre",
    textDecoration: "none",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
  },
  selected: {
    color: colors.PURPLE(1),
    borderBottom: "solid 3px",
    borderColor: colors.PURPLE(1),
  },
  loaderContainer: {
    padding: 0,
    width: "unset",
  },
  loaderStyle: {
    display: "unset",
  },
});

export default TabBar;
