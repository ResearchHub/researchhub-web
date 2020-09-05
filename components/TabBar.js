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
            return renderTab(tab, selectedTab, dynamic_href, props.fetching);
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
  fetching
) {
  let isSelected = false;
  let classNames = [styles.tab];

  if (href === selected) {
    isSelected = true;
    classNames.push(styles.selected);
  }
  return (
    <Link key={key} href={dynamic_href} as={href}>
      <div className={css(classNames)}>
        <div className={css(styles.link)}>
          {label}{" "}
          {showCount && (
            <Count isSelected={isSelected} amount={count} fetching={fetching} />
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
  return (
    <span className={css(styles.ui, isSelected && styles.selectedUi)}>
      {props.children}
    </span>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    overflow: "auto",
    background: paperTabColors.BACKGROUND,
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
    color: paperTabColors.FONT,
    fontFamily: paperTabFont,
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
    border: "1px solid #AAA7B9",
    borderRadius: 3,
  },
  selectedUi: {
    borderColor: colors.PURPLE(1),
  },
  link: {
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
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
