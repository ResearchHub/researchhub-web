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
import { faFire } from "@fortawesome/pro-solid-svg-icons";

export type Tab = {
  label: string;
  value: string;
  href?: string;
  isSelected?: boolean;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
  hoverIcon?: React.ReactNode;
  pillContent?: React.ReactNode | string;
  showNewFeatureIndicator?: boolean;
};

interface Props {
  tabs: Array<Tab>;
  onClick?: Function;
  containerStyle?: any;
  tabStyle?: any;
  variant?: "underline" | "text";
}

const HorizontalTabBar = ({
  tabs,
  onClick,
  containerStyle,
  tabStyle,
  variant = "underline",
}: Props) => {
  const tabContainerEl = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<any>(null);

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

  const renderTab = (tab: Tab, index) => {
    const {
      isSelected,
      value,
      label,
      icon,
      selectedIcon,
      pillContent,
      href,
      showNewFeatureIndicator,
    } = tab;
    const tabType = href ? "link" : "div";

    const props = {
      key: value,
      className: css(
        styles.tab,
        isSelected &&
          variant === "underline" &&
          styles.underlineVariantSelected,
        !isSelected &&
          variant === "underline" &&
          styles.underlineVariantNotSelected,
        isSelected && variant === "text" && styles.textVariantSelected,
        !isSelected && variant === "text" && styles.textVariantNotSelected,
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
          {!showNewFeatureIndicator && pillContent !== undefined && (
            <div className={css(styles.pillContent)}>{pillContent}</div>
          )}
          {showNewFeatureIndicator && (
            <span className={css(styles.new)}>
              <span className={css(styles.fireIcon)}>
                {<FontAwesomeIcon icon={faFire}></FontAwesomeIcon>}
              </span>
              <span className={css(styles.newText)}>New</span>
            </span>
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
    color: colors.MEDIUM_GREY(1.0),
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
  underlineVariantSelected: {
    borderBottom: "solid 3px",
    color: colors.NEW_BLUE(),
    borderColor: colors.NEW_BLUE(),
  },
  underlineVariantNotSelected: {
    ":active": {
      color: `solid 3px ${colors.GREY()}`,
    },
    ":hover": {
      borderBottom: `solid 3px ${colors.GREY()}`,
      transition: "all 0.2s ease-in-out",
    },
  },
  textVariantSelected: {
    color: colors.NEW_BLUE(),
  },
  textVariantNotSelected: {
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },

  // new feature indicator
  new: {
    display: "flex",
    alignItems: "center",
    background: colors.NEW_BLUE(0.1),
    borderRadius: "5px",
    padding: "4px 6px",
  },
  newText: {
    fontWeight: 500,
    fontSize: 14,
    color: colors.NEW_BLUE(0.9),
  },
  fireIcon: {
    fontSize: 14,
    marginRight: 5,
    color: colors.NEW_BLUE(0.9),
  },
});

export default HorizontalTabBar;
