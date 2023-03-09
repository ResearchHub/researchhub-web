import AuthorFacePile from "../shared/AuthorFacePile";
import { css, StyleSheet } from "aphrodite";
import { AuthorProfile, ID } from "~/config/types/root_types";

type CommentAuthorArgs = {
  authors: AuthorProfile[];
  primaryAuthorId?: ID;
};

const CommentAuthors = ({ authors, primaryAuthorId }: CommentAuthorArgs) => {
  const primaryAuthor = primaryAuthorId
    ? authors.find((a) => a.id === primaryAuthorId)
    : authors[0];
  const avatarMargin = authors.length > 1 ? -10 : 0;

  return (
    <div className={css(styles.commentHeader)}>
      <AuthorFacePile
        margin={avatarMargin}
        horizontal={true}
        authorProfiles={authors}
        imgSize={25}
      />
      {primaryAuthor?.firstName} {primaryAuthor?.lastName}
      {authors.length > 1 && <span>+ {authors.length}</span>}
    </div>
  );
};

const styles = StyleSheet.create({
  commentHeader: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  },
});

export default CommentAuthors;
