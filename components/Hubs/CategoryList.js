import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireAlt } from "@fortawesome/pro-duotone-svg-icons";
import { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Ripples from "react-ripples";

// Component
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";
import SideColumn from "~/components/Home/SideColumn";

// Config
import colors from "../../config/themes/colors";

import { isDevEnv } from "~/config/utils/env";

class CategoryList extends Component {
  constructor(props) {
    super(props);
  }

  renderCategoryEntry = () => {
    const { categories, activeCategory, setActiveCategory } = this.props;

    return categories.map((category, i) => {
      let { category_name } = category;
      let slug = category_name.toLowerCase().replace(/\s/g, "-");

      return (
        <Ripples
          className={css(
            styles.categoryEntry,
            i === categories.length - 1 && styles.last,
            activeCategory === i && styles.active
          )}
          key={`${category_name}-${i}`}
          onClick={() => {
            setActiveCategory(i);
            setTimeout(() => {
              setActiveCategory(i);
            }, 100);
          }}
          data-test={isDevEnv() ? `category-list` : undefined}
        >
          <Link
            href={"/hubs"}
            as={`/hubs#${slug}`}
            className={css(styles.categoryLink)}
          >
            {category_name === "Trending" ? (
              <span>
                {category_name}
                <span className={css(styles.trendingIcon)}>
                  {<FontAwesomeIcon icon={faFireAlt}></FontAwesomeIcon>}
                </span>
              </span>
            ) : (
              category_name
            )}
          </Link>
        </Ripples>
      );
    });
  };

  render() {
    return (
      <div className={css(styles.categoryListContainer)}>
        <SideColumn
          customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={9} />}
          title={"Categories"}
          renderListItem={this.renderCategoryEntry}
          ready={this.props.categories.length > 0}
        />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  categoryListContainer: {
    paddingTop: 15,
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
  active: {
    color: colors.NEW_BLUE(),
    background:
      "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
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

export default CategoryList;
