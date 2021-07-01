import { connect } from "react-redux";
import { Fragment } from "react";
import { getAuthorName } from "~/config/utils/";
import { isNullOrUndefined } from "../../../config/utils/nullchecks";
import { SideColumnTitle } from "~/components/Typography";
import { StyleSheet, css } from "aphrodite";
import AuthorCard from "./AuthorCard";
import AuthorClaimModal from "~/components/AuthorClaimModal/AuthorClaimModal";
import colors from "~/config/themes/colors";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";

const DEFAULT_PAGE_SIZE = 5;

class ColumnAuthors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      claimSelectedAuthor: null,
      page: 1,
      pages: 1,
      paginatedLists: {},
      ready: false,
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

      return (
        <AuthorCard
          author={author}
          name={name}
          key={key}
          onClaimSelect={() =>
            this.setState({
              ...this.state,
              claimSelectedAuthor: author /* this relies on the hope that author profile was already created */,
            })
          }
        />
      );
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
    const { claimSelectedAuthor, pages, page, ready } = this.state;
    const hasManyAuthors = authors.length > 1;
    const shouldDisplayClaimCard = authors.some((author) =>
      isNullOrUndefined(author.user)
    );
    const authorCards = this.renderAuthorCards();
    return (
      <ReactPlaceholder
        showLoadingAnimation
        ready={ready}
        customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
      >
        <AuthorClaimModal
          auth={auth}
          author={claimSelectedAuthor}
          isOpen={!isNullOrUndefined(claimSelectedAuthor)}
          setIsOpen={() =>
            this.setState({
              ...this.state,
              claimSelectedAuthor: null,
            })
          }
        />
        <div>
          {paper && authors.length > 0 && (
            <div className={css(styles.paperAuthorListContainer)}>
              <SideColumnTitle
                title={`Author Detail${hasManyAuthors ? "s" : ""}`}
                overrideStyles={styles.title}
              />
              {shouldDisplayClaimCard && (
                <div className={css(styles.claimCard)}>
                  <div className={css(styles.claimCardTextGroup)}>
                    <div className={css(styles.claimCardTextMain)}>
                      {hasManyAuthors
                        ? `Are you an author?`
                        : "Are you the author?"}
                    </div>
                    <div className={css(styles.claimCardText)}>
                      {"Claim your author and receive up to 1000 RSC"}
                    </div>
                  </div>
                  <img
                    className={css(styles.potOfGold)}
                    src="/static/icons/pot-of-gold.png"
                    alt="Pot of Gold"
                  />
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
  claimCard: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    height: 60,
    margin: "16px 0 8px 0",
    padding: "10px 20px",
    width: "100%",
  },
  claimCardTextGroup: {
    display: "flex",
    flexDirection: "column",
    height: "inherit",
    justifyContent: "flex-start",
    alignItems: "space-around",
    width: 210,
  },
  claimCardTextMain: {
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 500,
    marginBottom: 4,
  },
  claimCardText: {
    color: "#272727",
    fontFamily: "Poppins",
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
  potOfGold: {
    width: 56,
  },
  viewMoreButton: {
    color: "rgba(78, 83, 255)",
    textTransform: "capitalize",
    fontSize: 16,
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
    borderLeft: `3px solid #FFF`,
    transition: "all ease-out 0.1s",
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
