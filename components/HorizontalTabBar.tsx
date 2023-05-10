import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Link from "next/link";
import { HTMLAttributes, AnchorHTMLAttributes } from "react";

interface Props {
  tabs: Array<any>;
  onClick?: Function;
  containerStyle?: any;
}

const HorizontalTabBar = ({ tabs, onClick, containerStyle = null }: Props) => {
  const renderTab = (tab, index) => {
    const { isSelected, label } = tab;
    const tabType = tab.href ? "link" : "div";

    const props = {
      key: tab.value,
      className: css(styles.tab, isSelected && styles.tabSelected),
      ...(tab.href && { href: tab.href }),
      ...(onClick && { onClick: () => onClick(tab, index) }),
    };

    return (
      <_WrapperElement type={tabType} props={props} key={tab.value}>
        {label}
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
    marginRight: 8,
    whiteSpace: "nowrap",
    textTransform: "unset",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    ":active": {
      color: colors.NEW_BLUE(),
    },
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 16,
      fontSize: 16,
    },
  },
  tabSelected: {
    color: colors.NEW_BLUE(),
    borderBottom: "solid 3px",
    borderColor: colors.NEW_BLUE(),
  },
});

export default HorizontalTabBar;
