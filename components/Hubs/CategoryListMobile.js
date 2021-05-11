import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import ScrollMenu from "react-horizontal-scrolling-menu";

// Component

// Config
import colors from "../../config/themes/colors";
import icons from "~/config/themes/icons";

const Tab = ({ text, selected }) => {
  let isSelected = false;
  let classNames = [styles.tab];
  let slug = text.toLowerCase().replace(/\s/g, "-");

  if (selected) {
    isSelected = true;
    classNames.push(styles.selected);
  }

  return (
    <Link href={`#${slug}`} scroll={false}>
      <div
        className={css(classNames) + ` menu-item ${isSelected ? "active" : ""}`}
      >
        <div className={css(styles.link)}>{text}</div>
      </div>
    </Link>
  );
};

export const Menu = (list, selected) =>
  list.map((el) => {
    const name = el.category_name;
    return <Tab text={name} key={name} selected={selected} />;
  });

const selected = "Trending";

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

  state = {
    selected,
  };

  onSelect = (key) => {
    this.setState({ selected: key });
  };

  render() {
    const { categories, selected } = this.props;
    let menu = Menu(categories, selected);
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
          selected={"Trending"}
          scrollToSelected={true}
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
    ":hover": {
      color: colors.PURPLE(1),
      cursor: "pointer",
    },
    "@media only screen and (min-width: 768px)": {
      marginRight: 28,
    },
  },
  link: {
    textAlign: "center",
    whiteSpace: "pre",
    textDecoration: "none",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  selected: {
    color: colors.PURPLE(1),
    borderBottom: "solid 3px",
    borderColor: colors.PURPLE(1),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  categories: state.hubs.categories,
});

export default connect(mapStateToProps)(CategoryListMobile);
