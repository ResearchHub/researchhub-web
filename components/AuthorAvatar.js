import { StyleSheet, css } from "aphrodite";
import Avatar from "react-avatar";
import Link from "next/link";

const AuthorAvatar = (props) => {
  const { author, size = 30, disableLink } = props;

  const authorId = author && author.id;

  function renderAvatar() {
    return (
      <div>
        {author && author.profile_image ? (
          <img
            src={author.profile_image}
            style={{
              width: size,
              height: size,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          <i
            className="fas fa-user-circle"
            style={{ fontSize: size + 1, color: "#aaa" }}
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
  },
});

export default AuthorAvatar;
