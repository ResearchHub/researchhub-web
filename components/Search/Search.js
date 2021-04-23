import React, { Component, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import ReactPlaceholder from "react-placeholder";
import InfiniteScroll from "react-infinite-scroller";

import SearchEntry from "./SearchEntry";
import HubSearchResult from "../HubSearchResult";
import Loader from "~/components/Loader/Loader";

// Config
import icons from "~/config/themes/icons";
import colors from "../../config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const SEARCH_TIMEOUT = 400;

export default class Search extends Component {
  searchTimeout = -1;
  dropdownTimeout = -1;
  ref = React.createRef();
  scrollParent;
  state = {
    showDropdown: this.props.showDropdown,
    searching: false,
    searchMade: false,
    results: [],
    query: "",
    next: null,
    count: null,
    loading: false,
  };

  componentDidMount() {
    this.searchTimeout = -1;
    document.addEventListener("click", this);
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimeout);
    clearTimeout(this.dropdownTimeout);
    document.removeEventListener("click", this);
  }

  onSearchChange = (e) => {
    const { query } = this.state;
    const ignoreTimeout = query.length >= 7 && query.length % 7 === 0; // call search at 7th keystroke and every multiple of 7 thereafter

    if (!ignoreTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const value = e.target.value;

    if (!value) {
      return this.setState({
        searching: false,
        searchMade: false,
        showDropdown: false,
        query: "",
      });
    } else {
      this.setState({
        showDropdown: true,
        query: value,
        searching: true,
      });
    }

    this.searchTimeout = setTimeout(() => {
      const config = {
        route: "all",
      };

      return fetch(API.SEARCH({ search: value, config }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          this.setState({
            results: resp.results,
            next: resp.next,
            searchMade: true,
            searching: false,
          });
        });
    }, SEARCH_TIMEOUT);
  };

  fetchNextPage = () => {
    if (!this.state.loading && this.state.next) {
      this.setState({ loading: true }, () => {
        fetch(this.state.next, API.GET_CONFIG())
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            this.setState({
              results: [...this.state.results, ...res.results],
              loading: false,
              next: res.next,
            });
          });
      });
    }
  };

  renderSearchResults = () => {
    const { results, searching, searchMade } = this.state;

    if (!searchMade && results.length === 0) {
      return (
        <ReactPlaceholder
          ready={false}
          showLoadingAnimation
          type="media"
          rows={4}
          color="#efefef"
        />
      );
    }

    if (searchMade && results.length === 0) {
      return (
        <div className={css(styles.emptyResults)}>
          <img
            src={"/static/icons/search-empty.png"}
            className={css(styles.logo)}
            alt="Empty Search Icon"
          />
          <h3 className={css(styles.emptyTitle)}>
            We can't find what you're looking for!{"\n"}
            {searching ? (
              <div style={{ display: "flex" }}>
                Please try another search
                <Loader
                  loading={true}
                  size={3}
                  type={"beat"}
                  color={"#000"}
                  containerStyle={styles.loaderStyle}
                />
              </div>
            ) : (
              "Please try another search."
            )}
          </h3>
        </div>
      );
    }

    let prevType; // used to add result type header

    return results.map((result, index) => {
      let firstOfItsType = prevType !== result.meta.index;
      prevType = result.meta.index;

      return (
        <div
          key={index}
          className={css(styles.searchResult)}
          onClick={() => {
            this.dropdownTimeout = setTimeout(
              this.setState({ showDropdown: false }),
              500
            );
          }}
        >
          {this.getResultComponent(result, index, firstOfItsType)}
        </div>
      );
    });
  };

  getResultComponent = (result, index, firstOfItsType) => {
    const indexName = result.meta.index;
    const props = {
      indexName,
      result,
      clearSearch: this.clearQuery,
      firstOfItsType,
      query: this.state.query,
    };
    switch (indexName) {
      case "author":
      case "crossref_paper":
      case "paper":
        return <SearchEntry {...props} {...result} />;
      case "hub":
        return (
          <HubSearchResult
            indexName={"hub"}
            result={result}
            index={index}
            clearSearch={this.clearQuery}
          />
        );
      case "university":
        return null;
      default:
        break;
    }
  };

  populateThreadData = (data, result) => {
    data["createdBy"]["firstName"] =
      result.created_by_author_profile.first_name;
    data["createdBy"]["lastName"] = result.created_by_author_profile.last_name;
    data["createdBy"]["authorProfile"] = result.created_by_author_profile;
    return data;
  };

  handleEvent = (e) => {
    if (this.state.showDropdown && this.ref.current) {
      if (this.ref.current.contains(e.target) === false) {
        this.dropdownTimeout = setTimeout(
          this.setState({ showDropdown: false }),
          500
        );
      }
    }
  };

  clearQuery = () => {
    this.setState({ query: "" });
    this.props.afterSearchClick && this.props.afterSearchClick();
  };

  render() {
    return (
      <div
        ref={this.ref}
        className={css(styles.search, this.props.searchClass)}
      >
        <input
          className={css(styles.searchbar, this.props.inputClass)}
          placeholder={"Search..."}
          onChange={this.onSearchChange}
          value={this.state.query}
        />
        <span className={css(styles.searchIcon, this.props.searchIconClass)}>
          {icons.search}
        </span>
        {this.state.showDropdown && (
          <div
            className={css(styles.searchDropdown, this.props.dropdownClass)}
            ref={(ref) => (this.scrollParent = ref)}
          >
            <InfiniteScroll
              hasMore={this.state.next}
              loadMore={this.fetchNextPage}
              loader={
                <div style={{ marginTop: 15 }}>
                  <ReactPlaceholder
                    ready={false}
                    showLoadingAnimation
                    type="media"
                    rows={4}
                    color="#efefef"
                  />
                </div>
              }
              useWindow={false}
              getScrollParent={() => this.scrollParent}
              initialLoad={false}
              threshold={20}
            >
              {this.renderSearchResults()}
            </InfiniteScroll>
          </div>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  search: {
    width: 600,
    height: 45,
    boxSizing: "border-box",
    background: "#FBFBFD",
    border: "#E8E8F2 1px solid",
    display: "flex",
    alignItems: "center",
    position: "relative",
    "@media only screen and (max-width: 1024px)": {
      display: "none",
    },
  },
  searchbar: {
    padding: 10,
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: 16,
    position: "relative",
    cursor: "pointer",
    ":hover": {
      borderColor: "#B3B3B3",
    },
    ":focus": {
      borderColor: "#3f85f7",
      ":hover": {
        boxShadow: "0px 0px 1px 1px #3f85f7",
        cursor: "text",
      },
    },
  },
  searchIcon: {
    position: "absolute",
    right: 10,
    top: 13,
    cursor: "text",
    opacity: 0.4,
  },
  searchDropdown: {
    width: "150%",
    position: "absolute",
    zIndex: 10,
    top: 60,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    overflow: "scroll",
    overflowX: "hidden",
    padding: 16,
    boxSizing: "border-box",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    minWidth: 400,
    maxHeight: 400,
    color: colors.BLACK(),
  },

  searchResult: {
    borderBottom: "1px solid rgb(235, 235, 235)",
  },
  emptyResults: {
    padding: "15px 0",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.BLACK(),
    boxSizing: "border-box",
  },
  emptyTitle: {
    fontWeight: 500,
    fontSize: 18,
    whiteSpace: "pre-wrap",
    marginLeft: 15,
    lineHeight: 1.5,
    height: 55,
    "@media only screen and (max-width: 415px)": {
      height: 45,
      fontSize: 16,
    },
  },
  logo: {
    height: 55,
    "@media only screen and (max-width: 415px)": {
      height: 45,
    },
  },
  searchResultPaper: {
    border: "none",
  },
  hide: {
    display: "none",
  },
  loaderStyle: {
    paddingTop: 2,
    paddingLeft: 1,
  },
});
