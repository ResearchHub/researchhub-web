import { ReactElement, useState } from "react";
import ALink from "../ALink";
import { AuthorProfile } from "~/config/types/root_types";
import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";
import { sortAuthorProfiles } from "./lib/utils";

interface Props {
  authors: Array<AuthorProfile>;
  moreAuthorsBtnStyle?: any;
}

const Author = ({ author }: { author: AuthorProfile }) => {
  return (
    <span
      className={css(styles.author)}
      key={(author?.firstName || "") + (author?.lastName || "") + "_author"}
    >
      {author.id ? (
        <span>
          <ALink href={`/user/${author.id}/overview`}>
            <span>
              {author.firstName} {author.lastName}
            </span>
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

export const CondensedAuthorList = ({
  authorNames,
  numPrimaryAuthorsToShow = 2,
  allowAuthorNameToIncludeHtml = false,
}: {
  authorNames: Array<string>;
  numPrimaryAuthorsToShow?: number;
  allowAuthorNameToIncludeHtml: boolean;
}) => {
  if (authorNames.length === 0) {
    return null;
  }

  const primaryAuthors: Array<string> = [authorNames[0]];
  let showEtAllText = false;

  if (numPrimaryAuthorsToShow > 1 && authorNames.length > 1) {
    // Last author is the second most important author
    primaryAuthors.push(authorNames[authorNames.length - 1]);
  }

  if (authorNames.length > numPrimaryAuthorsToShow) {
    showEtAllText = true;
  }

  return (
    <div className={css(styles.authorsContainer)}>
      {primaryAuthors.map((authorName, idx) => (
        <>
          {allowAuthorNameToIncludeHtml ? (
            <span dangerouslySetInnerHTML={{ __html: authorName }} />
          ) : (
            <span>{authorName}</span>
          )}
          {idx < primaryAuthors.length - 1 && <>,</>}
        </>
      ))}
      {showEtAllText && <>, et al.</>}
    </div>
  );
};

const AuthorList = ({ authors, moreAuthorsBtnStyle }: Props) => {
  authors = sortAuthorProfiles(authors);
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
          className={css(styles.toggleHiddenAuthorsBtn, moreAuthorsBtnStyle)}
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
    marginLeft: 5,
    ":first-child": {
      marginLeft: 0,
    },
  },
});

export default AuthorList;
