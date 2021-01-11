import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";

// Component
import Loader from "../Loader/Loader";

const DEFAULT_TRANSITION_TIME = 0.4;

class AuthorCardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      removed: {},
    };
  }

  componentWillUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      this.setState({ removed: {} });
    }
  };

  getInitials = (first_name, last_name) => {
    let initials = "";
    initials += first_name[0];
    initials += last_name[0];
    return initials;
  };

  onRemove = (id) => {
    let removed = { ...this.state.removed };
    removed[id] = true;
    this.setState({ removed });
  };

  renderAuthorCard = (authors) => {
    return authors.map((author, i) => {
      let {
        first_name,
        last_name,
        email,
        profile_image,
        onRemove,
        id,
      } = author;
      return (
        <div
          className={css(
            styles.authorCard,
            this.state.removed[id] && styles.hide
          )}
          key={`${i}-${email}`}
          onClick={() =>
            this.props.onAuthorClick && this.props.onAuthorClick(author)
          }
        >
          {profile_image ? (
            <img
              className={css(styles.avatar)}
              src={profile_image}
              alt="Author Avatar"
            />
          ) : (
            <div className={css(styles.avatar, styles.default)}>
              <p className={css(styles.initials)}>
                {this.getInitials(first_name, last_name)}
              </p>
            </div>
          )}
          <div className={css(styles.nameContactWrapper)}>
            <div className={css(styles.name)}>
              {`${first_name} ${last_name}`}
            </div>
            <div className={css(styles.contact)}>{email}</div>
          </div>
          <img
            src={"/static/icons/delete.png"}
            className={css(styles.deleteIcon)}
            onClick={(e) => {
              e.stopPropagation();
              this.onRemove(id);
            }}
            alt="Delete Icon"
          />
        </div>
      );
    });
  };

  render() {
    let { authors, show, loading } = this.props;
    let authorsList = authors.filter(
      (author) => !this.state.removed[author.id]
    );

    return (
      <div
        className={css(
          styles.authorsList,
          show && styles.reveal,
          show &&
            (authorsList.length < 2 && authorsList.length !== 0) &&
            styles.minHeight,
          show && authorsList.length >= 2 && styles.maxHeight,
          loading && styles.loading
        )}
      >
        {loading ? (
          <div className={css(styles.loader)}>
            <Loader loading={loading} />
          </div>
        ) : (
          <span className={css(styles.authorListContainer)}>
            {this.renderAuthorCard(authorsList)}
          </span>
        )}
        <div
          className={css(styles.authorCard, styles.addAuthorCard)}
          onClick={this.props.addAuthor && this.props.addAuthor}
        >
          <div className={css(styles.addButtonWrapper)}>
            <i
              className="fal fa-plus"
              style={{ color: colors.BLUE(1), height: 12, width: 12 }}
            />
          </div>
          <div className={css(styles.nameContactWrapper, styles.marginLeft)}>
            <div className={css(styles.name)}>Add New User</div>
            <div className={css(styles.contact)}>
              Click to add new user on ResearchHub
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  authorsList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 0,
    overflowY: "scroll",
    overflowX: "hidden",
    transition: `all ease-in-out ${DEFAULT_TRANSITION_TIME}s`,
    marginBottom: 10,
  },
  reveal: {
    minHeight: 90,
    maxHeight: 260,
    transition: `all ease-in-out ${DEFAULT_TRANSITION_TIME}s`,
  },
  minHeight: {
    height: 180,
  },
  maxHeight: {
    height: 260,
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
  loader: {
    marginBottom: 10,
  },
  authorCard: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F7F7FB",
    cursor: "pointer",
    border: "1px solid #F7F7FB",
    borderRadius: 5,
    height: 74,
    width: "96%",
    marginBottom: 10,
    position: "relative",
    ":hover": {
      borderColor: "#D2D2E6",
    },
  },
  addAuthorCard: {
    justifyContent: "flex-start",
    minHeight: 74,
    maxHeight: 74,
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: "50%",
    marginLeft: 21,
    marginRight: 21,
    justifyContent: " center",
    alignItems: "center",
    display: "flex",
    "@media only screen and (max-width: 415px)": {
      width: 41,
      height: 41,
    },
  },
  default: {
    backgroundColor: "#484B76",
  },
  initials: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    color: "#FFF",
  },
  nameContactWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 43,
    width: "68%",
  },
  name: {
    fontFamily: "Roboto",
    fontSize: 18,
    color: "#241F3A",
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  contact: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#8d8b9a",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  addButtonWrapper: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: `1px solid ${colors.BLUE(1)}`,
    cursor: "pointer",
    marginLeft: 21,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ":hover": {
      backgroundColor: "#fff",
    },
    "@media only screen and (max-width: 415px)": {
      width: 40,
      height: 40,
    },
  },
  deleteIcon: {
    height: 20,
    width: 14,
    // marginRight: 21,
    userSelect: "none",
    position: "absolute",
    top: 20,
    right: 21,
  },
  marginLeft: {
    marginLeft: 21,
  },
  hide: {
    display: "none",
  },
  authorListContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthorCardList;
