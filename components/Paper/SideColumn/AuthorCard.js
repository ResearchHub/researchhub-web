import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

const AccruedRSC = ({ name, accruedRSC }) => {
  return (
    <div className={css(styles.nameContainer)}>
      <div className={css(styles.name)}>{name}</div>
      {/* {accruedRSC ? (
        <div className={css(styles.accruedRSC)}>
          <span className={css(styles.accruedAmount)}>{accruedRSC} RSC</span>
          <img
            className={css(styles.potOfGold)}
            src="/static/icons/coin-filled.png"
            alt="Pot of Gold"
          ></img>
        </div>
      ) : null} */}
    </div>
  );
};

const AuthorCard = (props) => {
  const { name, author, accruedRSC } = props;
  const {
    claimed_by_user_author_id,
    id: authorID,
    is_claimed,
    orcid_id,
    user: authorUserID,
  } = author;

  if (authorID) {
    return (
      <Link
        href={"/user/[authorId]/[tabName]"}
        // If the profile is already claimed, redirect to UserProfile that has claimed it
        as={`/user/${
          is_claimed ? claimed_by_user_author_id : authorID
        }/overview`}
        data-test={`author-${author.id}`}
      >
        <a className={css(styles.container, styles.hover)}>
          {author.profile_image ? (
            <img src={author.profile_image} className={css(styles.userImage)} />
          ) : (
            <span className={css(styles.userIcon)}>{icons.user}</span>
          )}
          {authorUserID ? (
            <div className={css(styles.name) + " clamp1"}>{name}</div>
          ) : (
            <AccruedRSC name={name} accruedRSC={accruedRSC} />
          )}
        </a>
      </Link>
    );
  } else if (orcid_id) {
    return (
      <a
        className={css(styles.container, styles.hover)}
        target="_blank"
        href={`https://orcid.org/${orcid_id}`}
        rel="noreferrer noopener"
        data-test={`author-${author.id}`}
      >
        <span className={css(styles.userIcon)}>{icons.user}</span>
        <AccruedRSC name={name} accruedRSC={accruedRSC} />
      </a>
    );
  } else {
    return (
      <div className={css(styles.container)} data-test={`author-${author.id}`}>
        <span className={css(styles.userIcon)}>{icons.user}</span>
        <AccruedRSC name={name} accruedRSC={accruedRSC} />
      </div>
    );
  }
};

AuthorCard.propTypes = {
  name: PropTypes.string,
  author: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 15px 8px 12px",
    borderLeft: `3px solid #FFF`,
    transition: "all ease-out 0.1s",
  },
  authorCardWrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hover: {
    textDecoration: "unset",
    width: "100%",
    ":hover": {
      cursor: "pointer",
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  name: {
    color: colors.BLACK(1),
    fontWeight: 500,
    marginLeft: 10,
    flex: 1,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  userIcon: {
    color: "#aaa",
    width: 30,
    height: 30,
    minWidth: 30,
    minHeight: 30,
    fontSize: 30 + 1,
    border: "1px solid transparent",
    "@media only screen and (max-width: 415px)": {
      width: 25,
      height: 25,
      fontSize: 25 + 1,
      minWidth: 25,
      minHeight: 25,
    },
  },
  userImage: {
    borderRadius: "50%",
    border: "1px solid #ededed",
    width: 30,
    height: 30,
    minWidth: 30,
    minHeight: 30,
    fontSize: 30 + 1,
    objectFit: "contain",
    "@media only screen and (max-width: 415px)": {
      width: 25,
      height: 25,
      fontSize: 25 + 1,
      minWidth: 25,
      minHeight: 25,
    },
  },
  nameContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  accruedRSC: {
    display: "flex",
    alignItems: "center",
    color: colors.BLACK(),
  },
  accruedAmount: {
    fontSize: 12,
  },
  potOfGold: {
    height: 16,
    marginLeft: 4,
  },
});

export default AuthorCard;
