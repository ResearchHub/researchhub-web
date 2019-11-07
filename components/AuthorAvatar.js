import { StyleSheet, css } from "aphrodite";
import Avatar from "react-avatar";
import Link from "next/link";

const AuthorAvatar = (props) => {
  const {
    author,
    size = 30,
    textSizeRatio = 2.5,
    disableLink,
    avatarClassName,
    name,
  } = props;

  const authorId = author && author.id;

  function renderAvatar() {
    let authorName =
      author && typeof author === "object"
        ? `${author.first_name} ${author.last_name}`
        : null;
    return (
      <Avatar
        className={avatarClassName}
        name={name || authorName}
        size={size}
        round={true}
        textSizeRatio={textSizeRatio}
        src={author ? author.profile_image : null}
      />
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
