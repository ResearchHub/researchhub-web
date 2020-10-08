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
          <Link
            href={{
              pathname: "/hubs#${slug}",
            }}
            as={`/hubs#${slug}`}
          >
            <a className={css(styles.categoryLink)}>{category_name}</a>
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
    position: "fixed",
    maxWidth: 225,
    paddingTop: 50,
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
  },
  categoryList: {
    padding: "0px 30px",
    overflowY: "scroll",
    "@media only screen and (max-height: 800px)": {
      maxHeight: "53vh",
    },
    "@media only screen and (max-height: 700px)": {
      maxHeight: "45vh",
    },
    "@media only screen and (max-height: 600px)": {
      maxHeight: "35vh",
    },
    "@media only screen and (max-height: 500px)": {
      maxHeight: "28vh",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  categories: state.hubs.categories,
});

export default connect(mapStateToProps)(CategoryList);
