import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import Link from "next/link";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { useHasMounted } from "~/config/utils/hooks";

const AuthorAvatar = (props) => {
  const [error, setError] = useState(false);
  const hasMounted = useHasMounted();

  // fixes an error with `style` Prop not matching on Server/Client
  if (!hasMounted || !props.author) {
    return null;
  }

  const {
    author,
    boldName,
    border,
    disableLink,
    dropShadow,
    fontSize = 16,
    showModeratorBadge,
    size = 30,
    spacing,
    trueSize,
    twitterUrl,
    withAuthorName,
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
    const profileImage = author.profile_image || author.profileImage;
    if (deviceWidth < 768 && !trueSize) {
      finalSize = size - 5;
    }

    return (
      <>
        {author && profileImage && !error ? (
          <img
            src={profileImage}
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

  const avatarComponent = renderAvatar();
  const fullName = `${author?.first_name ?? author?.firstName ?? ""} ${
    author?.last_name ?? author.lastName ?? ""
  }`;

  if (twitterUrl) {
    return (
      <div className={css(styles.avatar)}>
        <a
          target="_blank"
          href={twitterUrl}
          className={css(styles.atag)}
          rel="noreferrer noopener"
        >
          {avatarComponent}
        </a>
      </div>
    );
  }

  return (
    <div className={css(styles.avatar)}>
      {disableLink || !authorId ? (
        avatarComponent
      ) : (
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${authorId}/overview`}
        >
          <a
            href={`/user/${authorId}/overview`}
            className={css(styles.atag)}
            rel="noreferrer noopener"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {avatarComponent}
            {Boolean(withAuthorName) ? (
              <span
                style={{
                  color: colors.BLACK(),
                  fontSize: fontSize,
                  fontWeight: boldName ? 500 : 400,
                  marginLeft: spacing ?? 8,
                  whiteSpace: "nowrap",
                }}
                className={css(styles.name)}
              >
                {fullName}
              </span>
            ) : null}
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
    alignItems: "center",
    color: "unset",
    display: "flex",
    textDecoration: "unset",
  },
  userIcon: {
    color: "#aaa",
    position: "relative",
    // top: 2,
    left: 0.25,
  },
  name: {
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
});

export default AuthorAvatar;
