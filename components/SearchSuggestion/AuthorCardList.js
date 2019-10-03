import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";

// Component
import Loader from "../Loader/Loader";

const DEFAULT_TRANSITION_TIME = 0.4;

class AuthorCardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getInitials = (first_name, last_name) => {
    let initials = "";
    initials += first_name[0];
    initials += last_name[0];
    return initials;
  };

  renderAuthorCard = (authors) => {
    return authors.map((author, i) => {
      let { first_name, last_name, email, avatar, onRemove } = author;

      return (
        <div className={css(styles.authorCard)} key={`${i}-${email}`}>
          {avatar ? (
            <img className={css(styles.avatar)} src={uri(avatar)} />
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
            onClick={onRemove && onRemove}
          />
        </div>
      );
    });
  };

  render() {
    let { authors, show, loading } = this.props;

    return (
      <div
        className={css(
          styles.authorsList,
          show && styles.reveal,
          loading && styles.loading
        )}
      >
        {loading ? (
          <div className={css(styles.loader)}>
            <Loader loading={loading} />
          </div>
        ) : (
          <span>{this.renderAuthorCard(authors)}</span>
        )}
        <div className={css(styles.authorCard, styles.addAuthorCard)}>
          <div
            className={css(styles.addButtonWrapper)}
            onClick={this.props.addAuthor && this.props.addAuthor}
          >
            <i
              className="fal fa-plus"
              style={{ color: colors.BLUE(1), height: 12, width: 12 }}
            ></i>
          </div>
          <div className={css(styles.nameContactWrapper, styles.marginLeft)}>
            <div className={css(styles.name)}>Add New User</div>
            <div className={css(styles.contact)}>
              Click to add new user on Research Hub
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
    width: 600,
    height: 0,
    overflowY: "scroll",
    transition: `all ease-in-out ${DEFAULT_TRANSITION_TIME}s`,
    marginBottom: 10,
  },
  reveal: {
    height: 260,
    transition: `all ease-in-out ${DEFAULT_TRANSITION_TIME}s`,
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F7FB",
    cursor: "pointer",
    border: "1px solid #F7F7FB",
    borderRadius: 5,
    height: 74,
    width: 598,
    marginBottom: 10,
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
    justifyContent: " center",
    alignItems: "center",
    display: "flex",
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
    width: 460,
  },
  name: {
    fontFamily: "Roboto",
    fontSize: 18,
    color: "#241F3A",
  },
  contact: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#8d8b9a",
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
  },
  deleteIcon: {
    height: 20,
    width: 14,
    marginRight: 21,
  },
  marginLeft: {
    marginLeft: 21,
  },
});

export default AuthorCardList;
