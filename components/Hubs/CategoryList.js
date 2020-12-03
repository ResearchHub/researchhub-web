import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Component
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";

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
          className={css(styles.categoryEntry)}
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
      <div className={css(styles.categoryListContainer)}>
        <div className={css(styles.listLabel)} id={"categoryListTitle"}>
          Categories
        </div>
        <div className={css(styles.categoryList)}>
          {this.props.categories.length > 0 ? (
            this.renderCategoryEntry()
          ) : (
            <Fragment>
              <ReactPlaceholder
                showLoadingAnimation
                ready={false}
                customPlaceholder={
                  <HubEntryPlaceholder color="#efefef" rows={9} />
                }
              />
            </Fragment>
          )}
        </div>
      </div>
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
    width: "99%",
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    transition: "all ease-out 0.1s",
    borderRadius: 3,
    border: "1px solid #fcfcfc",
    marginBottom: 8,
    ":hover": {
      borderColor: "rgb(237, 237, 237)",
      backgroundColor: "#FAFAFA",
    },
  },
  categoryLink: {
    textDecoration: "none",
    color: "#111",
    display: "flex",
    alignItems: "center",
    padding: "8px",
    width: "100%",
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
