import { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import { SideColumnTitle } from "~/components/Typography";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import AuthorCard from "./AuthorCard";

// Config
import colors from "~/config/themes/colors";

const DEFAULT_PAGE_SIZE = 5;

class ColumnAuthors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      pages: 1,
      page: 1,
      ready: false,
      paginatedLists: {},
    };
  }

  componentDidMount() {
    this.formatAuthorPages();
  }

  componentDidUpdate(prevProps) {
    const { paperId, authors } = this.props;

    if (prevProps.paperId !== paperId) {
      this.setState({ ready: false }, () => this.formatAuthorPages());
    } else if (JSON.stringify(prevProps.authors) !== JSON.stringify(authors)) {
      this.setState({ ready: false }, () => this.formatAuthorPages());
    }
  }

  renderAuthorCards = () => {
    const { authors } = this.state;

    return authors.map((name, index) => {
      return <AuthorCard name={name} key={`user_${index}`} />;
    });
  };

  formatAuthorPages = () => {
    const { authors } = this.props;

    const paginatedLists = {};
    const count = authors.length;
    let pages = 1;

    if (count > DEFAULT_PAGE_SIZE) {
      pages = Math.ceil(count / DEFAULT_PAGE_SIZE);

      for (let i = 1; i <= pages; i++) {
        let start = (i - 1) * DEFAULT_PAGE_SIZE;
        let end = i * DEFAULT_PAGE_SIZE;

        if (i === pages) {
          paginatedLists[i] = authors.slice(start);
        } else {
          paginatedLists[i] = authors.slice(start, end);
        }
      }

      this.setState({
        authors: paginatedLists[1],
        paginatedLists,
        pages,
        page: 1,
        ready: true,
      });
    } else {
      this.setState({ authors, ready: true });
    }
  };

  nextPage = () => {
    const { paginatedLists, page } = this.state;
    const next = page + 1;
    const authors = [...this.state.authors, ...paginatedLists[next]];
    this.setState({ authors, page: next });
  };

  render() {
    const { paper, authors } = this.props;
    const { ready, pages, page } = this.state;

    return (
      <ReactPlaceholder
        showLoadingAnimation
        ready={ready}
        customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
      >
        <div>
          {paper && authors.length > 0 && (
            <Fragment>
              <SideColumnTitle
                title={`Author Detail${authors.length > 1 ? "s" : ""}`}
                overrideStyles={styles.title}
              />
              <div className={css(styles.authors)}>
                {this.renderAuthorCards()}
                {pages > page && (
                  <div
                    className={css(styles.viewMoreButton)}
                    onClick={this.nextPage}
                  >
                    View more
                  </div>
                )}
              </div>
            </Fragment>
          )}
        </div>
      </ReactPlaceholder>
    );
  }
}

const styles = StyleSheet.create({
  authors: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    margin: "15px 0 10px",
  },
  viewMoreButton: {
    color: "rgba(78, 83, 255)",
    textTransform: "capitalize",
    fontSize: 16,
    padding: "10px 20px",
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
    borderLeft: `3px solid #FFF`,
    fontWeight: 500,
    transition: "all ease-out 0.1s",
    ":hover": {
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
});

export default ColumnAuthors;
