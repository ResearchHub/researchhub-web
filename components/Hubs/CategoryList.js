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

// Redux
import { HubActions } from "~/redux/hub";

const DEFAULT_TRANSITION_TIME = 400;

class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories:
        this.props.categories && this.props.categories.results
          ? this.props.categories.results
          : [],
      reveal: true,
    };
  }

  componentDidMount() {
    let { auth } = this.props;
    if (this.props.categories) {
      this.setState({ categories: [...this.props.categories] });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.categories !== this.props.categories) {
      this.setState({ categories: [...this.props.categories] });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.revealTimeout);
    this.setState({ reveal: false });
  }

  revealTransition = () => {
    setTimeout(() => this.setState({ reveal: true }), DEFAULT_TRANSITION_TIME);
  };

  renderCategoryEntry = () => {
    let categories = this.state.categories;
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
    let { overrideStyle } = this.props;
    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.categoryListContainer)}>
          <div className={css(styles.listLabel)} id={"categoryListTitle"}>
            Categories
          </div>
          <div
            className={css(
              styles.categoryList,
              this.state.reveal && styles.reveal
            )}
          >
            {this.state.categories.length > 0 ? (
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
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // width: "calc(100% * .625)",
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  categoryListContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "left",
    cursor: "default",
  },
  text: {
    fontFamily: "Roboto",
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
    paddingLeft: 25,
    boxSizing: "border-box",
  },
  topIcon: {
    color: colors.RED(),
    marginLeft: 6,
    fontSize: 13,
  },
  categoryEntry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    boxSizing: "content-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    borderRadius: 3,
    border: "1px solid #fff",
    marginBottom: 8,
    ":hover": {
      borderColor: "rgb(237, 237, 237)",
      backgroundColor: "#FAFAFA",
    },
  },
  categoryLink: {
    textDecoration: "none",
    color: "#111",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "8px",
  },
  current: {
    borderColor: "rgb(237, 237, 237)",
    backgroundColor: "#FAFAFA",
    ":hover": {
      borderColor: "rgb(227, 227, 227)",
      backgroundColor: "#EAEAEA",
    },
  },
  categoryList: {
    opacity: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "0px 30px",
  },
  reveal: {
    opacity: 1,
    transition: "all ease-in-out 0.2s",
  },
  space: {
    height: 10,
  },
});

const mapStateToProps = (state) => ({
  categories: state.hubs.categories,
  auth: state.auth,
});

export default connect(mapStateToProps)(CategoryList);
