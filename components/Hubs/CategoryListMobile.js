import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireAlt } from "@fortawesome/pro-duotone-svg-icons";
import { useRef, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import ScrollMenu from "react-horizontal-scrolling-menu";

import colors from "../../config/themes/colors";

const Tab = ({ text, index, activeCategory }) => {
  const isActive = index === activeCategory;
  return (
    <Link
      href={`#${text.toLowerCase().replace(/\s/g, "-")}`}
      scroll={false}
      legacyBehavior
    >
      <div
        className={
          css([styles.tab, isActive ? styles.active : null]) +
          ` menu-item ${isActive ? "active" : ""}`
        }
      >
        <div className={css(styles.link)}>
          {text === "Trending" ? (
            <span>
              {text}
              <span className={css(styles.trendingIcon)}>
                {<FontAwesomeIcon icon={faFireAlt}></FontAwesomeIcon>}
              </span>
            </span>
          ) : (
            text
          )}
        </div>
      </div>
    </Link>
  );
};

const Menu = (list, activeCategory) =>
  list.map((el, index) => {
    const name = el.category_name;
    return (
      <Tab
        key={index}
        text={name}
        index={index}
        activeCategory={activeCategory}
      />
    );
  });

const CategoryListMobile = (props) => {
  const {
    activeCategory,
    categories,
    clickedTab,
    setActiveCategory,
    setClickedTab,
  } = props;
  const menu = Menu(categories, activeCategory);
  const menuRef = useRef();

  useEffect(() => {
    if (!clickedTab) {
      menuRef.current && menuRef.current.scrollTo(activeCategory.toString());
    }
  }, [activeCategory]);

  const onSelect = (key) => {
    menuRef.current && menuRef.current.scrollTo(key);
    // TODO: [clickedTab] - [workaround to fix scrolling bug when jumping past multiple Waypoints instantly]
    setClickedTab(true);
    setTimeout(() => {
      setClickedTab(false);
      setActiveCategory(parseInt(key));
    }, 20);
  };

  return (
    <div className={css(styles.container)}>
      <ScrollMenu
        data={menu}
        hideSingleArrow={true}
        itemStyle={{ border: "none", highlight: "none", outline: "none" }}
        menuStyle={styles.tabContainer}
        onSelect={onSelect}
        ref={menuRef}
        wheel={false}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    boxSizing: "border-box",
    background: "#FCFCFC",
    borderBottom: "1.5px solid #F0F0F0",
    borderTop: "1.5px solid #F0F0F0",
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
  },
  arrowContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 40,
    minHeight: 40,
    height: 40,
    maxWidth: 40,
    minWidth: 40,
    width: 40,
    fontSize: 20,
    borderRadius: "50%",
    background: "#FFF",
    boxSizing: "border-box",
    color: colors.PURPLE(),
    border: "1.5px solid rgba(151, 151, 151, 0.2)",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.14)",
    ":hover": {
      background: "#FAFAFA",
    },
  },
  tab: {
    color: "rgba(36, 31, 58, .5)",
    fontWeight: 500,
    padding: "1rem",
    "@media only screen and (min-width: 768px)": {
      marginRight: 28,
    },
  },
  link: {
    textAlign: "center",
    whiteSpace: "pre",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  active: {
    color: colors.PURPLE(1),
    borderBottom: "solid 3px",
    borderColor: colors.PURPLE(1),
  },
  trendingIcon: {
    color: "#FF6D00",
    marginLeft: 5,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CategoryListMobile);
