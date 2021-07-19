import { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import { connect } from "react-redux";
import { isNullOrUndefined } from "../../../config/utils/nullchecks";
import { SideColumnTitle } from "~/components/Typography";
import AuthorCard from "./AuthorCard";

// Config
import { getAuthorName } from "~/config/utils/misc";
import AuthorClaimModal from "~/components/AuthorClaimModal/AuthorClaimModal";
import colors from "~/config/themes/colors";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";

const DEFAULT_PAGE_SIZE = 5;

class ColumnAuthors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      page: 1,
      pages: 1,
      paginatedLists: {},
      ready: false,
      shouldOpenAuthorClaimModal: false,
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

    return authors.map((author, index) => {
      const name = getAuthorName(author);
      const key = `${name}-${index}`; // not all author have ids nor orcid_id -> combined list of authors and raw_authors

      return <AuthorCard author={author} name={name} key={key} />;
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
    const { auth, authors, paper } = this.props;
    const { pages, page, ready, shouldOpenAuthorClaimModal } = this.state;
    const hasManyAuthors = authors.length > 1;
    const claimableAuthors = authors.filter(
      // checks if this author is NOT an "raw_author"
      (author) => !isNullOrUndefined(author.id) && !Boolean(author.is_claimed)
    );
    const shouldDisplayClaimCard = claimableAuthors.length > 0;
    const authorCards = this.renderAuthorCards();

    return (
      <ReactPlaceholder
        showLoadingAnimation
        ready={ready}
        customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
      >
        <AuthorClaimModal
          auth={auth}
          authors={claimableAuthors}
          isOpen={shouldOpenAuthorClaimModal}
          setIsOpen={(flag) =>
            this.setState({
              ...this.state,
              shouldOpenAuthorClaimModal: flag,
            })
          }
        />
        <div>
          <div className={css(styles.paperAuthorListContainer)}>
            <SideColumnTitle
              title={`Author Detail${hasManyAuthors ? "s" : ""}`}
              overrideStyles={styles.title}
            />
            {shouldDisplayClaimCard && (
              <div className={css(styles.claimCardWrap)}>
                <div className={css(styles.claimCard)}>
                  <div className={css(styles.claimCardTextGroup)}>
                    <div className={css(styles.claimCardTextMain)}>
                      {hasManyAuthors
                        ? "Are you one of the authors?"
                        : "Are you the author?"}
                    </div>
                    <div className={css(styles.claimCardText)}>
                      {"Claim your profile and receive up to 1000 RSC"}
                    </div>
                  </div>
                  <img
                    className={css(styles.RSCIcon)}
                    src="/static/icons/coin-filled.png"
                    alt="Pot of Gold"
                  />
                </div>
                <div
                  className={css(styles.claimButton)}
                  onClick={() =>
                    this.setState({
                      ...this.state,
                      shouldOpenAuthorClaimModal: true,
                    })
                  }
                  role="button"
                >
                  {"Claim"}
                </div>
              </div>
            )}
            <div className={css(styles.authors)}>
              {authorCards}
              {pages > page && (
                <div
                  className={css(styles.viewMoreButton)}
                  onClick={this.nextPage}
                >
                  View more
                </div>
              )}
            </div>
          </div>
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
  claimCardWrap: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    margin: "8px 0 0",
    padding: "10px 20px",
    width: "100%",
  },
  claimCard: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
  },
  claimButton: {
    alignItems: "center",
    backgroundColor: colors.NEW_BLUE(1),
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    height: 24,
    justifyContent: "center",
    marginTop: 12,
    padding: 4,
    width: "100%",
  },
  claimCardTextGroup: {
    display: "flex",
    flexDirection: "column",
    height: "inherit",
    justifyContent: "flex-start",
    alignItems: "space-around",
    width: 192,
  },
  claimCardTextMain: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 4,
  },
  claimCardText: {
    color: "#272727",
    fontSize: 14,
    fontStyle: "normal",
    width: "100",
  },
  title: {},
  paperAuthorListContainer: {
    margin: "15px 0 10px",
    "@media only screen and (max-width: 415px)": {
      margin: "15px 0 5px",
    },
  },
  RSCIcon: {
    marginLeft: 8,
    width: 40,
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
    transition: "all ease-out 0.1s",
    padding: "0 16px",
    ":hover": {
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ColumnAuthors);
