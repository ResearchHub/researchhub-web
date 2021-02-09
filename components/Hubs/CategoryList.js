import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";
import SideColumn from "~/components/Home/SideColumn";

// Config
import colors from "../../config/themes/colors";
import icons from "~/config/themes/icons";

class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories:
        this.props.categories && this.props.categories.results
          ? this.props.categories.results
          : [],
    };
  }

  renderCategoryEntry = () => {
    let categories = this.props.categories;
    return categories.map((category, i) => {
      let { category_name } = category;
      let slug = category_name.toLowerCase().replace(/\s/g, "-");

      return (
        <Ripples
          className={css(
            styles.categoryEntry,
            i === categories.length - 1 && styles.last
          )}
          key={`${category_name}-${i}`}
        >
          <Link href={"/hubs"} as={`/hubs#${slug}`}>
            <a className={css(styles.categoryLink)}>
              {category_name === "Trending" ? (
                <span>
                  {category_name}
                  <span className={css(styles.trendingIcon)}>{icons.fire}</span>
                </span>
              ) : (
                category_name
              )}
            </a>
          </Link>
        </Ripples>
      );
    });
  };

  render() {
    return (
      <SideColumn
        customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={9} />}
        title={"Categories"}
        renderListItem={this.renderCategoryEntry}
        ready={this.props.categories.length}
      />
    );
  }
}

const styles = StyleSheet.create({
  categoryListContainer: {
    paddingTop: 30,
    alignItems: "center",
    textAlign: "left",
    cursor: "default",
    "@media only screen and (max-height: 450px)": {
      display: "none",
    },
  },
  listLabel: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 15,
    textAlign: "left",
    color: "#a7a6b0",
    transition: "all ease-out 0.1s",
    width: "90%",
    paddingLeft: 35,
    boxSizing: "border-box",
  },
  categoryEntry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    borderRadius: 3,
    borderLeft: "3px solid #fff",
    borderBottom: "1px solid #F0F0F0",
    color: colors.BLACK(0.6),
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
      color: colors.NEW_BLUE(),
      transition: "all ease-out 0.1s",
    },
    ":active": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
    ":focus": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  last: {
    borderBottom: "none",
  },
  categoryLink: {
    textDecoration: "none",
    color: "#111",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  categoryList: {
    padding: "0px 30px",
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

export default connect(mapStateToProps)(CategoryList);
