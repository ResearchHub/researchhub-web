import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import Link from "next/link";

import icons from "~/config/themes/icons";
import colors from "../config/themes/colors";

const AuthorAvatar = (props) => {
  const [error, setError] = useState(false);
  const {
    author,
    size = 30,
    disableLink,
    showModeratorBadge,
    twitterUrl,
    trueSize,
    border,
    dropShadow,
  } = props;
  let deviceWidth = null;
  if (process.browser) {
    if (window.outerHeight) {
      deviceWidth = window.outerWidth;
    } else {
      deviceWidth = document.body.clientWidth;
    }
  }

  const authorId = author && author.id;

  function renderAvatar() {
    let finalSize = size;
    if (deviceWidth < 768 && !trueSize) {
      finalSize = size - 5;
    }

    return (
      <>
        {author && author.profile_image && !error ? (
          <img
            src={author.profile_image}
            style={{
              minWidth: finalSize,
              width: finalSize,
              maxWidth: finalSize,
              minHeight: finalSize,
              height: finalSize,
              maxHeight: finalSize,
              objectFit: "cover",
              borderRadius: "50%",
              border,
              // border: border ? border : "3px solid #F1F1F1",
              boxShadow: dropShadow && "0px 2px 4px rgba(185, 185, 185, 0.25)",
            }}
            onError={(e) => {
              setError(true);
            }}
            alt={"Author Profile Avatar"}
            loading="lazy"
          />
        ) : (
          <span
            className={css(styles.userIcon)}
            style={{
              width: finalSize,
              height: finalSize,
              fontSize: finalSize + 1,
              // border: "3px solid transparent",
            }}
          >
            {icons.user}
          </span>
        )}
        {showModeratorBadge && (
          <img
            src={"/static/icons/moderatorBadge.png"}
            className={css(styles.moderatorBadge)}
          />
        )}
      </>
    );
  }

  if (twitterUrl) {
    return (
      <div className={css(styles.avatar)}>
        <a
          target="_blank"
          href={twitterUrl}
          className={css(styles.atag)}
          rel="noreferrer noopener"
        >
          {renderAvatar()}
        </a>
      </div>
    );
  }

  return (
    <div className={css(styles.avatar)}>
      {disableLink || !authorId ? (
        renderAvatar()
      ) : (
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${authorId}/discussions`}
        >
          <a
            href={`/user/${authorId}/discussions`}
            className={css(styles.atag)}
            rel="noreferrer noopener"
          >
            {renderAvatar()}
          </a>
        </Link>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  avatar: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    position: "relative",
    borderRadius: "50%",
    // border: "3px solid #F1F1F1",
  },
  moderatorBadge: {
    position: "absolute",
    color: colors.BLUE(),
    bottom: -2,
    right: -5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  atag: {
    color: "unset",
    textDecoration: "unset",
  },
  userIcon: {
    color: "#aaa",
    position: "relative",
    // top: 2,
    left: 0.25,
  },
});

export default AuthorAvatar;
