import { StyleSheet, css } from "aphrodite";
import Avatar from "react-avatar";
import Link from "next/link";

// Config
import colors from "~/config/themes/colors";

const AuthorAvatar = (props) => {
  const {
    author,
    size = 30,
    textSizeRatio = 1,
    disableLink,
    avatarClassName,
    name,
  } = props;

  function renderAvatar() {
    let authorName = author ? `${author.first_name} ${author.last_name}` : null;
    return (
      <Avatar
        className={avatarClassName}
        name={author ? authorName : name}
        size={size}
        round={true}
        textSizeRatio={textSizeRatio}
      />
    );
  }
  return (
    <div className={css(styles.avatar)}>
      {disableLink ? (
        renderAvatar()
      ) : (
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/contributions`}
        >
          {renderAvatar()}
        </Link>
      )}
    </div>
  );
};

const styles = StyleSheet.create({});

export default AuthorAvatar;
