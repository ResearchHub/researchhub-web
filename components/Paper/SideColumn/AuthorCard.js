import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

const AuthorCard = (props) => {
  const { name, author, onClaimSelect } = props;
  const { id, orcid_id, user } = author;

  if (true) {
    const shouldDisplayClaimButton = isNullOrUndefined(user); // implies that this author doesn't have user
    return (
      <div className={css(styles.authorCardWrap)}>
        <Link href={"/user/[authorId]/[tabName]"} as={`/user/${id}/posts`}>
          <a className={css(styles.container, styles.hover)}>
            {author.profile_image ? (
              <img
                src={author.profile_image}
                className={css(styles.userImage)}
              />
            ) : (
              <span className={css(styles.userIcon)}>{icons.user}</span>
            )}
            <div className={css(styles.name) + " clamp1"}>{name}</div>
          </a>
        </Link>
        {shouldDisplayClaimButton ? (
          <div
            className={css(styles.claimButton)}
            onClick={(e) => {
              e.stopPropagation();
              onClaimSelect();
            }}
            role="button"
          >
            {"Claim"}
          </div>
        ) : null}
      </div>
    );
  }

  if (orcid_id) {
    return (
      <a
        className={css(styles.container, styles.hover)}
        target="_blank"
        href={`https://orcid.org/${orcid_id}`}
        rel="noreferrer noopener"
      >
        <span className={css(styles.userIcon)}>{icons.user}</span>
        <div className={css(styles.name) + " clamp1"}>{name}</div>
      </a>
    );
  }

  return (
    <div className={css(styles.container)}>
      <span className={css(styles.userIcon)}>{icons.user}</span>
      <div className={css(styles.name) + " clamp1"}>{name}</div>
    </div>
  );
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
    paddingRight: 16,
  },
  claimButton: {
    backgroundColor: colors.NEW_BLUE(1),
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
    height: 24,
    padding: 4,
    width: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    border: "3px solid transparent",
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
});

export default AuthorCard;
