import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import Avatar from "react-avatar";
import Link from "next/link";
import colors from "../config/themes/colors";

const AuthorAvatar = (props) => {
  const [error, setError] = useState(false);
  const { author, size = 30, disableLink, showModeratorBadge } = props;
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
              }}
              onError={(e) => {
                setError(true);
              }}
            />
          ) : (
            <div
              style={{
                fontSize: size,
              }}
            >
              <i className="fas fa-user-circle" />
            </div>
          )
        ) : (
          <i
            className={css(styles.userCircle) + " fas fa-user-circle"}
            style={{ fontSize: finalSize + 1, color: "#aaa" }}
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
  return (
    <div className={css(styles.avatar)}>
      {disableLink || !authorId ? (
        renderAvatar()
      ) : (
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${authorId}/contributions`}
        >
          <a
            href={`/user/${authorId}/contributions`}
            className={css(styles.atag)}
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
