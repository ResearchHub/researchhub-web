import { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import { SideColumnTitle } from "~/components/Typography";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import AuthorCard from "./AuthorCard";

const ColumnAuthors = (props) => {
  const { paper, authors } = props;
  const [showAuthors, toggleShowAuthors] = useState(true);

  const renderAuthorCards = () => {
    const list = (authors || []).map((name, index) => {
      return <AuthorCard name={name} key={`user_${index}`} />;
    });

    if (list && list.length) {
      return <div className={css(styles.authors)}>{list}</div>;
    } else {
      return null;
    }
  };

  return (
    <ReactPlaceholder
      showLoadingAnimation
      ready={paper}
      customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
    >
      <div>
        {paper && authors.length > 0 && (
          <Fragment>
            <SideColumnTitle
              title={`Author Detail${authors.length > 1 ? "s" : ""}`}
              overrideStyles={styles.title}
              onClick={() => toggleShowAuthors(!showAuthors)}
              state={showAuthors}
              count={authors.length}
            />
            {showAuthors && renderAuthorCards()}
          </Fragment>
        )}
      </div>
    </ReactPlaceholder>
  );
};

const styles = StyleSheet.create({
  authors: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    margin: "15px 0 10px",
  },
});

export default ColumnAuthors;
