import React from "react";
import { css, StyleSheet } from "aphrodite";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-dom";
import AlgoliaSearchResults from "~/components/Search/AlgoliaSearchResults";
import AlgoliaSearchBox from "~/components/Search/AlgoliaSearchBox";

import { ALGOLIA_APP_ID, ALGOLIA_API_KEY } from "~/config/constants";
import colors from "~/config/themes/colors";

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

class AlgoliaSearch extends React.Component {
  dropdownTimeout = -1;
  ref = React.createRef();

  state = {
    showDropdown: this.props.showDropdown,
  };

  componentDidMount() {
    document.addEventListener("click", this.handleEvent);
  }

  componentWillUnmount() {
    clearTimeout(this.dropdownTimeout);
    document.removeEventListener("click", this.handleEvent);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.showDropdown !== this.props.showDropdown) {
      this.setState({
        showDropdown: this.props.showDropdown,
      });
    }
  }

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

  handleSearch = (query) => {
    if (query && !this.state.showDropdown) {
      this.setState({ showDropdown: true });
    } else if (!query && this.state.showDropdown) {
      this.setState({ showDropdown: false });
    }
  };

  onResultClick = (e) => {
    e && e.stopPropagation();
    this.props.afterSearchClick
      ? this.props.afterSearchClick()
      : this.setState({ showDropdown: false });
  };

  render() {
    const { mobile } = this.props;
    return (
      <div
        className={css(styles.search, mobile && styles.searchMobile)}
        ref={this.ref}
      >
        <InstantSearch
          indexName={`papers_${process.env.NODE_ENV}`}
          searchClient={searchClient}
        >
          <AlgoliaSearchBox
            onChange={this.handleSearch}
            onReset={() => this.setState({ showDropdown: false })}
            delay={500}
          />

          {this.state.showDropdown && (
            <div
              className={css(styles.searchDropdown, this.props.dropdownClass)}
              ref={(ref) => (this.scrollParent = ref)}
            >
              <AlgoliaSearchResults onClickCallBack={this.onResultClick} />
            </div>
          )}
        </InstantSearch>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  search: {
    width: "100%",
    maxWidth: 600,
    boxSizing: "border-box",
    background: "#FBFBFD",
    border: "#E8E8F2 1px solid",
    display: "flex",
    alignItems: "center",
    position: "relative",
    ":hover": {
      borderColor: colors.BLUE(),
    },
    "@media only screen and (max-width: 1024px)": {
      display: "none",
    },
  },
  searchMobile: {
    "@media only screen and (max-width: 760px)": {
      display: "flex",
      borderRadius: 10,
      maxWidth: "unset",
      marginBottom: 15,
    },
  },
  searchDropdown: {
    width: "150%",
    minWidth: 800,
    position: "absolute",
    zIndex: 10,
    top: 55,
    maxHeight: 400,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    overflow: "scroll",
    padding: 16,
    boxSizing: "border-box",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    "@media only screen and (max-width: 760px)": {
      maxHeight: "80vh",
      top: 57,
    },
  },
});

export default AlgoliaSearch;
