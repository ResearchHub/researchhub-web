import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Link from "next/link";
import {
  HTMLAttributes,
  AnchorHTMLAttributes,
  useRef,
  useEffect,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";

export type Tab = {
  label: string;
  value: string;
  href?: string;
  isSelected?: boolean;
  icon: React.ReactNode;
  selectedIcon?: React.ReactNode;
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
  const tabContainerEl = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = tabContainerEl.current as HTMLDivElement;
      const { scrollLeft, clientWidth, scrollWidth } = el;

      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    };

    if (tabContainerEl?.current) {
      handleScroll();
      tabContainerEl.current.addEventListener("scroll", handleScroll);
      return () => {
        tabContainerEl.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [tabContainerEl]);

  const renderTab = (tab:Tab, index) => {
    const { isSelected, value, label, icon, selectedIcon, pillContent, href } = tab;
    const tabType = href ? "link" : "div";

    const props = {
      key: value,
      className: css(
        styles.tab,
        isSelected ? styles.tabSelected : styles.tabNotSelected,
        tabStyle
      ),
      ...(href && { href }),
      ...(onClick && { onClick: () => onClick(tab, index) }),
    };

    return (
      <_WrapperElement type={tabType} props={props} key={value}>
        <div className={css(styles.tabContentWrapper)}>
          {isSelected && selectedIcon ? selectedIcon : icon}
          {label}
          {pillContent !== undefined && (
            <div className={css(styles.pillContent)}>{pillContent}</div>
          )}
        </div>
      </_WrapperElement>
    );
  };

  const handleArrowClick = (event) => {
    (tabContainerEl.current as HTMLDivElement).scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  return (
    <div className={css(styles.container, containerStyle)}>
      <div className={css(styles.arrowWrapper)}>
        <div className={css(styles.tabContainer)} ref={tabContainerEl}>
          {tabs.map(renderTab)}
        </div>
        {showRightArrow && (
          <div className={css(styles.rightArrow)} onClick={handleArrowClick}>
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ color: colors.BLACK(0.7) }}
            />
          </div>
        )}
      </div>
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
  arrowWrapper: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
  },
  pillContent: {
    background: "#F5F5F9",
    borderRadius: "5px",
    padding: "2px 10px",
    color: colors.BLACK(0.5),
    fontSize: 14,
  },
  rightArrow: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: 20,
    zIndex: 5,
    padding: "8px 15px 7px 24px",
    background:
      "linear-gradient(90deg, rgba(255, 255, 255, 0) 0px, rgb(255, 255, 255) 50%)",
  },
  container: {
    display: "flex",
    justifyContent: "flex-start",
    boxSizing: "border-box",
    marginBottom: 0,
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
    borderBottom: `solid 3px transparent`,
    ":active": {
      color: colors.NEW_BLUE(),
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
  tabNotSelected: {
    ":hover": {
      color: colors.MEDIUM_GREY(),
      borderBottom: `solid 3px ${colors.GREY()}`,
      transition: "all 0.2s ease-in-out",
    },
  },
  tabSelected: {
    color: colors.NEW_BLUE(),
    borderBottom: "solid 3px",
    borderColor: colors.NEW_BLUE(),
  },
});

export default HorizontalTabBar;
