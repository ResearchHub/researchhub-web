import { StyleSheet, css } from "aphrodite";
import Avatar from "react-avatar";
import Link from "next/link";

const AuthorAvatar = (props) => {
  const { author, size = 30, disableLink } = props;
  let deviceWidth = null;
  if (window.outerHeight) {
    deviceWidth = window.outerWidth;
  } else {
    deviceWidth = document.body.clientWidth;
  }

  const authorId = author && author.id;

  function renderAvatar() {
    let finalSize = size;
    if (deviceWidth < 768) {
      finalSize = size - 5;
    }
    return (
      <div>
        {author && author.profile_image ? (
          <img
            src={author.profile_image}
            style={{
              width: finalSize,
              height: finalSize,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          <i
            className={css(styles.userCircle) + " fas fa-user-circle"}
            style={{ fontSize: finalSize + 1, color: "#aaa" }}
          ></i>
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
          {renderAvatar()}
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
  },
});

export default AuthorAvatar;
