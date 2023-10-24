import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState } from "react";
import Link from "next/link";
import colors from "~/config/themes/colors";
import { VerifiedBadge } from "./Verification/VerificationModal";

const AuthorAvatar = (props) => {
  const [error, setError] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(null);

  const {
    author,
    boldName,
    border,
    disableLink,
    dropShadow,
    fontColor,
    showBadgeIfVerified = false,
    fontSize = 16,
    showModeratorBadge,
    size = 30,
    spacing,
    trueSize,
    twitterUrl,
    withAuthorName,
    anonymousAvatarStyle,
  } = props;

  useEffect(() => {
    let width = null;

    if (window.outerHeight) {
      width = window.outerWidth;
    } else {
      width = document.body.clientWidth;
    }

    setDeviceWidth(width);
  }, []);

  const authorId = author && author.id;

  function renderAvatar() {
    let finalSize = size;
    const profileImage = author?.profile_image || author?.profileImage;
    if (deviceWidth && deviceWidth < 768 && !trueSize) {
      finalSize = size - 5;
    }

    return (
      <>
        {showBadgeIfVerified &&
          !showModeratorBadge &&
          (author?.is_verified || author?.isVerified) && (
            <div style={{ position: "absolute", right: -9, top: -3 }}>
              <VerifiedBadge
                height={20}
                width={20}
                showTooltipOnHover={false}
              />
            </div>
          )}
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
            className={css(styles.userIcon, anonymousAvatarStyle)}
            style={{
              width: finalSize,
              height: finalSize,
              fontSize: finalSize,
              border,
              borderRadius: "50%",
              // border: "3px solid transparent",
            }}
          >
            {<FontAwesomeIcon icon={faCircleUser}></FontAwesomeIcon>}
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
    author?.last_name ?? author?.lastName ?? ""
  }`;

  return (
    <div className={css(styles.avatar)}>
      {disableLink || !authorId ? (
        avatarComponent
      ) : (
        <Link
          href={`/user/${authorId}/overview`}
          className={css(styles.atag)}
          rel="noreferrer noopener"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={css(styles.atag)}>
            {avatarComponent}
            {!!withAuthorName ? (
              <span
                style={{
                  color: fontColor ?? colors.BLACK(),
                  fontSize: fontSize ?? size,
                  fontWeight: boldName ? 500 : 400,
                  marginLeft: spacing ?? 8,
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={css(styles.name)}
              >
                {fullName}
              </span>
            ) : null}
          </div>
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
    display: "flex",
    left: 0.25,
  },
  name: {
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
});

export default AuthorAvatar;
