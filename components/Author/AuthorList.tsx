import { ReactElement, useState } from "react";
import ALink from "../ALink";
import { AuthorProfile } from "~/config/types/root_types";
import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";
import GenericMenu from "../shared/GenericMenu";
import IconButton from "../Icons/IconButton";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faArrowRight } from "@fortawesome/pro-light-svg-icons";
import { useRouter } from "next/router";
import { Helpers } from "@quantfive/js-web-config";
import api, { generateApiUrl } from "../../config/api";

interface Props {
  authors: Array<AuthorProfile>;
  doc?: any;
  moreAuthorsBtnStyle?: any;
}

function updateAuthors({
  doc,
  author,
  onSuccess
}) {
  const url = generateApiUrl(
    `paper/${doc.id}/update_paper_authors`,
  );
  const data = {
    remove: [author.id]
  }

  return fetch(url, api.PATCH_CONFIG(data))
    .then(Helpers.checkStatus)
    .then((res) => {
      onSuccess();
      return res;
    });
}

const Author = ({ author, authorOptionsSelect }: { author: AuthorProfile, authorOptionsSelect: Function }) => {
    const currentUser = getCurrentUser();
    const authorOptions = [
    {
      value: "PROFILE",
      disableHover: true,
      disableStyle: true,
      icon: <FontAwesomeIcon icon={faArrowRight} />,
      label: "Go to Profile",
    },
    ...(currentUser.moderator || currentUser.author_profile?.id == author.id ? [{
      value: "REMOVE",
      disableHover: true,
      disableStyle: true,
      icon: <FontAwesomeIcon icon={faBan} />,
      label: "Remove Author",
    }] : []
    ),
  ];

  return (
    <span
      className={css(styles.author)}
      key={author.firstName + author.lastName + "_author"}
    >
      {author.id ? (
        <GenericMenu
          softHide={true}
          options={authorOptions}
          width={150}
          onSelect={(selected) => {
            authorOptionsSelect(selected.value, author);
          }}
          direction="top"
          id="document-comment-menu"
        >
          <span>
            {author.firstName} {author.lastName}
          </span>
        </GenericMenu>
      ) : (
        <span>
          {author.firstName} {author.lastName}
        </span>
      )}
    </span>
  );
};

const AuthorList = ({ authors, doc, moreAuthorsBtnStyle }: Props) => {
  const onAuthorOptionsSelect = (value, author) => {
    if (value == "PROFILE") {
      router.push(
        `/user/${author.id}/overview`
      );
    } else if (value == "REMOVE") {
      const onSuccess = (): void => {
        router.reload();
      };
      updateAuthors({doc, author, onSuccess});
    };
  };

  const [showSecondaryAuthors, setShowSecondaryAuthors] = useState(false);
  const router = useRouter();

  // If authors list is greater than this, we want to hide "secondary" authors
  const minLengthReqToHide = 4;

  let primaryAuthors: Array<ReactElement<"div">> = [];
  console.log(authors);
  primaryAuthors = authors
    .slice(0, 2)
    .map((author) => <Author author={author} authorOptionsSelect={onAuthorOptionsSelect} />);

  let secondaryAuthors: Array<ReactElement<"div">> = [];
  if (authors.length >= minLengthReqToHide) {
    secondaryAuthors = authors
      .slice(2, authors.length - 1)
      .map((author) => <Author author={author} authorOptionsSelect={onAuthorOptionsSelect} />);
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
    authors.length > 2 ? <Author author={authors[authors.length - 1]} authorOptionsSelect={onAuthorOptionsSelect} /> : null;

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
    display: "inline-flex",
    marginLeft: 5,
    ":first-child": {
      marginLeft: 0,
    },
  },
});

export default AuthorList;
