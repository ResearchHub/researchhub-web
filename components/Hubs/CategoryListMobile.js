import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import ScrollMenu from "react-horizontal-scrolling-menu";

// Component

// Config
import colors from "../../config/themes/colors";
import icons from "~/config/themes/icons";

const Tab = ({ text, index, activeCategory }) => {
  let isActive = false;
  let classNames = [styles.tab];
  let slug = text.toLowerCase().replace(/\s/g, "-");

  if (index == activeCategory) {
    isActive = true;
    classNames.push(styles.active);
  }

  return (
    <Link href={`#${slug}`} scroll={false}>
      <div
        className={css(classNames) + ` menu-item ${isActive ? "active" : ""}`}
      >
        <div className={css(styles.link)}>
          {text === "Trending" ? (
            <span>
              {text}
              <span className={css(styles.trendingIcon)}>{icons.fire}</span>
            </span>
          ) : (
            text
          )}
        </div>
      </div>
    </Link>
  );
};

export const Menu = (list, activeCategory) =>
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

export const NavigationArrow = ({ icon, direction, customStyles }) => {
  const classNames = [styles.arrowContainer];

  if (direction === "left") {
    classNames.push(styles.arrowLeft);
  } else {
    classNames.push(styles.arrowRight);
  }

  if (customStyles) {
    classNames.push(customStyles);
  }

  return <div className={css(classNames)}>{icon}</div>;
};

class CategoryListMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories:
        this.props.categories && this.props.categories.results
          ? this.props.categories.results
          : [],
    };
  }

  onSelect = (key) => {
    this._menu && this._menu.scrollTo(key);
    this.props.setClickedTab(true);
    setTimeout(() => {
      this.props.setClickedTab(false);
      this.props.setActiveCategory(key);
    }, 20);
  };

  componentDidUpdate(prevProps) {
    if (this.props.activeCategory !== prevProps.activeCategory) {
      const { categories, activeCategory, clickedTab } = this.props;
      if (categories[activeCategory] && !clickedTab) {
        this._menu && this._menu.scrollTo(activeCategory.toString());
      }
    }
  }

  render() {
    const { categories, activeCategory, setActiveCategory } = this.props;
    let menu = Menu(categories, activeCategory);
    return (
      <div className={css(styles.container)}>
        <ScrollMenu
          data={menu}
          arrowLeft={
            <NavigationArrow icon={icons.chevronLeft} direction={"left"} />
          }
          arrowRight={
            <NavigationArrow icon={icons.chevronRight} direction={"right"} />
          }
          menuStyle={styles.tabContainer}
          itemStyle={{ border: "none", highlight: "none", outline: "none" }}
          hideSingleArrow={true}
          onSelect={this.onSelect}
          wheel={false}
          ref={(el) => (this._menu = el)}
        />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "95%",
    justifyContent: "flex-start",
    boxSizing: "border-box",
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
  arrowLeft: {
    paddingRight: 2,
  },
  arrowRight: {
    paddingLeft: 5,
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
  categories: state.hubs.categories,
});

export default connect(mapStateToProps)(CategoryListMobile);
