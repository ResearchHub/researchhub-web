import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Link from "next/link";
import { HTMLAttributes, AnchorHTMLAttributes } from "react";

export type Tab = {
  label: string;
  value: string;
  href?: string;
  isSelected?: boolean;
  icon: React.ReactNode;
  pillContent?: React.ReactNode | string;
};

interface Props {
  tabs: Array<Tab>;
  onClick?: Function;
  containerStyle?: any;
  tabStyle?: any;
}

const HorizontalTabBar = ({
  tabs,
  onClick,
  containerStyle,
  tabStyle,
}: Props) => {
  const renderTab = (tab, index) => {
    const { isSelected, label } = tab;
    const tabType = tab.href ? "link" : "div";

    const props = {
      key: tab.value,
      className: css(styles.tab, isSelected && styles.tabSelected, tabStyle),
      ...(tab.href && { href: tab.href }),
      ...(onClick && { onClick: () => onClick(tab, index) }),
    };

    return (
      <_WrapperElement type={tabType} props={props} key={tab.value}>
        <div className={css(styles.tabContentWrapper)}>
          {tab.icon}
          {label}
        </div>
      </_WrapperElement>
    );
  };

  return (
    <div className={css(styles.container, containerStyle)}>
      <div className={css(styles.tabContainer)}>{tabs.map(renderTab)}</div>
    </div>
  );
};

function _WrapperElement({ children, type, props = {} }): JSX.Element {
  switch (type) {
    case "link":
      return (
        // @ts-ignore
        <Link {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </Link>
      );
    case "div":
    default:
      return (
        <div {...(props as HTMLAttributes<HTMLDivElement>)}>{children}</div>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    boxSizing: "border-box",
    marginBottom: -1,
  },
  tabContainer: {
    display: "flex",
    maxWidth: "100vw",
    justifyContent: "flex-start",
    overflowX: "scroll",
    boxSizing: "border-box",
    overflowScrolling: "touch",
    scrollbarWidth: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  tab: {
    color: colors.BLACK(0.5),
    textDecoration: "none",
    display: "block",
    padding: "1rem",
    paddingRight: "10px",
    paddingLeft: "10px",
    marginRight: "8px",
    whiteSpace: "nowrap",
    textTransform: "unset",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    ":active": {
      color: colors.NEW_BLUE(),
    },
    ":hover": {
      color: colors.MEDIUM_GREY(),
      borderBottom: `solid 2px ${colors.GREY()}`,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 16,
      fontSize: 16,
    },
  },
  tabContentWrapper: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
  },
  tabSelected: {
    color: colors.NEW_BLUE(),
    borderBottom: "solid 2px",
    borderColor: colors.NEW_BLUE(),
  },
});

export default HorizontalTabBar;
