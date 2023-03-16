import AuthorFacePile from "../shared/AuthorFacePile";
import { css, StyleSheet } from "aphrodite";
import { AuthorProfile, ID } from "~/config/types/root_types";

type CommentAvatarsArgs = {
  authors: AuthorProfile[];
};

const CommentAvatars = ({ authors }: CommentAvatarsArgs) => {
  const avatarMargin = authors.length > 1 ? -12 : 0;

  return (
    <div className={css(styles.avatarsWrapper)}>
      <AuthorFacePile
        margin={avatarMargin}
        horizontal={true}
        authorProfiles={authors}
        imgSize={24}
        fontSize={24}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  avatarsWrapper: {
    display: "flex",
    alignItems: "center",
    columnGap: "7px",
    fontSize: 15,
  },
});

export default CommentAvatars;
