import React, { Component } from "react";
import { css, StyleSheet } from "aphrodite";
import ReactPlaceholder from "react-placeholder";
import InfiniteScroll from "react-infinite-scroller";

import SearchEntry from "./SearchEntry";
import HubSearchResult from "./HubSearchResult";
import Loader from "~/components/Loader/Loader";

// Config
import { RHLogo } from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

export default class Search extends Component {
  searchTimeout = -1;
  dropdownTimeout = -1;
  ref = React.createRef();
  scrollParent;
  state = {
    showDropdown: this.props.showDropdown,
    finished: true,
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.showDropdown !== this.props.showDropdown) {
      this.setState({
        showDropdown: this.props.showDropdown,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimeout);
    clearTimeout(this.dropdownTimeout);
    document.removeEventListener("click", this);
  }

  onSearchChange = (e) => {
    clearTimeout(this.searchTimeout);

    const value = e.target.value;

    if (!value) {
      this.setState({
        showDropdown: false,
        finished: true,
        query: "",
      });

      return;
    } else {
      this.setState({
        showDropdown: true,
        finished: false,
        query: value,
      });
    }

    this.searchTimeout = setTimeout(() => {
      const config = {
        route: "all",
      };

      // TODO: add pagination
      // Params to the search for pagination would be page
      fetch(API.SEARCH({ search: value, config }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          this.setState({
            results: resp.results,
            finished: true,
            next: resp.next,
          });
        });
    }, 200);
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
    let universityCount = 0;
    let prevType;
    const results = this.state.results.map((result, index) => {
      result.meta.index === "university" && universityCount++;
      let firstOfItsType = prevType !== result.meta.index;
      prevType = result.meta.index;

      return (
        <div
          key={index}
          className={css(
            styles.searchResult,
            result.meta.index === "university" && styles.hide
          )}
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

    if (results.length === 0 || universityCount === results.length) {
      return (
        <div className={css(styles.emptyResults)}>
          <h2 className={css(styles.emptyTitle)}>
            We can't find what you're looking for! Please try another search.
          </h2>
          <RHLogo iconStyle={styles.logo} />
        </div>
      );
    }

    return results;
  };

  getResultComponent = (result, index, firstOfItsType) => {
    const indexName = result.meta.index;

    switch (indexName) {
      // case "author":
      //   return (
      //     <SearchEntry
      //       indexName={indexName}
      //       result={result}
      //       clearSearch={this.clearQuery}
      //     />
      //   );
      case "crossref_paper":
      case "paper":
        return (
          <SearchEntry
            indexName={"paper"}
            result={result}
            clearSearch={this.clearQuery}
            // index={index}
            firstOfItsType={firstOfItsType}
          />
        );
      // case "discussion_thread":
      //   let data = thread(result);
      //   if (data.isPublic) {
      //     data = this.populateThreadData(data, result);
      //     data.meta = result.meta;
      //     return (
      //       <SearchEntry
      //         indexName={indexName}
      //         result={data}
      //         clearSearch={this.clearQuery}
      //       />
      //     );
      //   }
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
        // return <UniversitySearchResult result={result} />;
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
        <i
          className={
            css(styles.searchIcon, this.props.searchIconClass) +
            " far fa-search"
          }
        ></i>
        {this.state.showDropdown && (
          <div
            className={css(styles.searchDropdown, this.props.dropdownClass)}
            ref={(ref) => (this.scrollParent = ref)}
          >
            <InfiniteScroll
              hasMore={this.state.next}
              loadMore={this.fetchNextPage}
              loader={
                <ReactPlaceholder
                  ready={false}
                  showLoadingAnimation
                  type="media"
                  rows={4}
                  color="#efefef"
                />
              }
              useWindow={false}
              getScrollParent={() => this.scrollParent}
              initialLoad={false}
              threshold={20}
            >
              <ReactPlaceholder
                ready={this.state.finished}
                showLoadingAnimation
                type="media"
                rows={4}
                color="#efefef"
              >
                {this.renderSearchResults()}
              </ReactPlaceholder>
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
    maxHeight: 400,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    overflow: "auto",
    padding: 16,
    boxSizing: "border-box",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    minWidth: 400,
  },
  searchResult: {
    borderBottom: "1px solid rgb(235, 235, 235)",
  },
  emptyResults: {
    textAlign: "center",
    letterSpacing: 0.7,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emptyTitle: {
    fontWeight: 400,
    fontSize: 22,
  },
  searchResultPaper: {
    border: "none",
  },
  hide: {
    display: "none",
  },
});
