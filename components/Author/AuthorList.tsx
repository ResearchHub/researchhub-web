import { ReactElement, useState } from "react";
import ALink from "../ALink";
import { AuthorProfile } from "~/config/types/root_types";
import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";

interface Props {
  authors: Array<AuthorProfile>;
}

const Author = ({ author }: { author: AuthorProfile }) => {
  return (
    <span className={css(styles.author)}>
      {author.id ? (
        <span>
          <ALink href={`/user/${author.id}/overview`}>
            {author.firstName} {author.lastName}
          </ALink>
        </span>
      ) : (
        <span>
          {author.firstName} {author.lastName}
        </span>
      )}
    </span>
  );
};

const AuthorList = ({ authors }: Props) => {
  const [showSecondaryAuthors, setShowSecondaryAuthors] = useState(false);

  // If authors list is greater than this, we want to hide "secondary" authors
  const minLengthReqToHide = 4;

  let primaryAuthors: Array<ReactElement<"div">> = [];
  primaryAuthors = authors
    .slice(0, 2)
    .map((author) => <Author author={author} />);

  let secondaryAuthors: Array<ReactElement<"div">> = [];
  if (authors.length >= minLengthReqToHide) {
    secondaryAuthors = authors
      .slice(2, authors.length - 1)
      .map((author) => <Author author={author} />);
  }

  const primaryAuthorElems = primaryAuthors.map((author, idx) => {
    const renderComma =
      (showSecondaryAuthors && authors.length > 2) ||
      (authors.length > 1 && idx < primaryAuthors.length - 1);
    return (
      <>
        {author}
        {renderComma ? "," : ""}
      </>
    );
  });
  const secondaryAuthorElems = secondaryAuthors.map((author, idx) => (
    <>
      {author}
      {idx < secondaryAuthors.length - 1 ? "," : ""}
    </>
  ));
  const lastAuthor =
    authors.length > 2 ? <Author author={authors[authors.length - 1]} /> : null;

  return (
    <div className={css(styles.authorsContainer)}>
      {primaryAuthorElems}
      <div
        className={css(
          styles.secondaryAuthors,
          showSecondaryAuthors && styles.showSecondaryAuthors
        )}
      >
        {secondaryAuthorElems}
      </div>
      {!showSecondaryAuthors && secondaryAuthors.length > 0 && (
        <div
          className={css(styles.toggleHiddenAuthorsBtn)}
          onClick={() => setShowSecondaryAuthors(true)}
        >
          +{secondaryAuthors.length} authors
        </div>
      )}
      {lastAuthor && <>,{lastAuthor}</>}
      {showSecondaryAuthors && (
        <div
          className={css(styles.toggleHiddenAuthorsBtn)}
          onClick={() => setShowSecondaryAuthors(false)}
        >
          Show less
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  badgesWrapper: {
    display: "flex",
    marginBottom: 10,
  },
  authorsContainer: {
    display: "inline",
  },
  secondaryAuthors: {
    display: "none",
    marginLeft: 5,
  },
  showSecondaryAuthors: {
    display: "inline",
  },
  toggleHiddenAuthorsBtn: {
    marginLeft: 5,
    display: "inline",
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  author: {
    color: colors.PURE_BLACK(),
    marginLeft: 5,
    ":first-child": {
      marginLeft: 0,
    },
  },
});

export default AuthorList;
