import { CondensedAuthorList } from "../Author/AuthorList";
import { GenericDocument } from "../Document/lib/types";
import { css, StyleSheet } from "aphrodite";

interface Args {
  document: GenericDocument;
  showDate?: boolean;
}

const FeedCard = ({ document, showDate = true }: Args) => {
  return (
    <div>
      <div className={css(styles.vote)}>
        {document.score}
      </div>
      <div className={css(styles.main)}>
        <div className={css(styles.title)}>
          {document.title}
        </div>
        <div className={css(styles.authorsWrapper)}>
          <div className={css(styles.authors)}>
            <CondensedAuthorList
              authorNames={document.authors.map(a => a.firstName + " " + a.lastName)}
              allowAuthorNameToIncludeHtml={false}
            />
          </div>
          <div className={css(styles.publishDate)}>
            {document.publishedDate}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  vote: {

  },
  main: {

  },
  title: {

  },
  authorsWrapper: {
    display: "flex",
  },
  publishDate: {

  },
  authors: {

  },
  date: {

  },
  metadata: {

  }
});

export default FeedCard;