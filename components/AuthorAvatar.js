import { StyleSheet, css } from "aphrodite";
import Avatar from "react-avatar";
import Link from "next/link";

// Config
import colors from "~/config/themes/colors";

const AuthorAvatar = (props) => {
  const {
    author,
    size = 30,
    textSizeRatio = 2.5,
    disableLink,
    avatarClassName,
    name,
  } = props;

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
        src={author.profile_image}
      />
    );
  }
  return (
    <div className={css(styles.avatar)}>
      {disableLink || !author.id ? (
        renderAvatar()
      ) : (
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/contributions`}
          style={css(styles.link)}
        >
          {renderAvatar()}
        </Link>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  link: {
    cursor: "pointer",
  },
});

export default AuthorAvatar;
