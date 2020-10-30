import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import Link from "next/link";
import colors from "../config/themes/colors";

const AuthorAvatar = (props) => {
  const [error, setError] = useState(false);
  const {
    author,
    size = 30,
    disableLink,
    showModeratorBadge,
    twitterUrl,
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
    if (deviceWidth < 768) {
      finalSize = size - 5;
    }
    return (
      <div className={css(styles.avatar)}>
        {author && author.profile_image ? (
          !error ? (
            <img
              src={author.profile_image}
              style={{
                width: finalSize,
                height: finalSize,
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #F1F1F1",
              }}
              onError={(e) => {
                setError(true);
              }}
            />
          ) : (
            <div
              style={{
                fontSize: size,
                paddingBottom: 1,
                border: "3px solid #F1F1F1",
                borderRadius: "50%",
                width: finalSize,
                height: finalSize,
              }}
            >
              <i className={css(styles.userCircle) + " fas fa-user-circle"} />
            </div>
          )
        ) : (
          <i
            className={css(styles.userCircle) + " fas fa-user-circle"}
            style={{
              fontSize: finalSize + 1,
              color: "#aaa",
              paddingTop: 3,
              border: "3px solid #F1F1F1",
              borderRadius: "50%",
            }}
          ></i>
        )}
        {showModeratorBadge && (
          <img
            src={"/static/icons/moderatorBadge.png"}
            className={css(styles.moderatorBadge)}
          />
        )}
      </div>
    );
  }

  if (twitterUrl) {
    return (
      <div className={css(styles.avatar)}>
        <a target="_blank" href={twitterUrl} className={css(styles.atag)}>
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
          as={`/user/${authorId}/overview`}
        >
          <a href={`/user/${authorId}/overview`} className={css(styles.atag)}>
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
});

export default AuthorAvatar;
