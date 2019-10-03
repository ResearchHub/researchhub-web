import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import moment from "moment";
import Avatar from "react-avatar";

// Components
import PaperTabBar from "~/components/PaperTabBar";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import ComponentWrapper from "~/components/ComponentWrapper";

import { PaperActions } from "~/redux/paper";

import { getNestedValue } from "~/config/utils";

const Paper = (props) => {
  const router = useRouter();
  const { paperId, tabName } = router.query;
  let { paper } = props;

  const threadCount = getNestedValue(paper, ["discussion", "count"], 0);
  const discussionThreads = getNestedValue(paper, ["discussion", "threads"]);

  let renderTabContent = () => {
    switch (tabName) {
      case "summary":
        return <SummaryTab paperId={paperId} paper={paper} />;
      case "discussion":
        return <DiscussionTab paperId={paperId} threads={discussionThreads} />;
      case "full":
        return <PaperTab />;
      case "citations":
        return null;
    }
  };

  function renderAuthors() {
    let authors =
      paper &&
      paper.authors.map((author, index) => {
        return (
          <div className={css(styles.authorContainer)} key={`author_${index}`}>
            <Avatar
              name={`${author.first_name} ${author.last_name}`}
              size={30}
              round={true}
              textSizeRatio="1"
            />
          </div>
        );
      });
    return authors;
  }

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.header)}>
          <div className={css(styles.title)}>{paper && paper.title}</div>
          <div className={css(styles.authors)}>{renderAuthors()}</div>
          <div className={css(styles.infoSection)}>
            <div className={css(styles.info)}>
              Published{" "}
              {moment(paper && paper.paper_publish_date).format(
                "DD MMMM, YYYY"
              )}
            </div>
            <div className={css(styles.info)}>DOI: {paper && paper.doi}</div>
          </div>
        </div>
      </ComponentWrapper>
      <PaperTabBar
        baseUrl={paperId}
        selectedTab={tabName}
        threadCount={threadCount}
      />
      <div className={css(styles.contentContainer)}>{renderTabContent()}</div>
    </div>
  );
};

Paper.getInitialProps = async ({ store, isServer, query }) => {
  let { paper } = store.getState();

  if (!paper.id) {
    await store.dispatch(PaperActions.getPaper(query.paperId));
  }

  return { isServer };
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
  },
  header: {
    padding: "30px 0px",
    width: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 33,
    marginBottom: 10,
  },
  infoSection: {
    display: "flex",
  },
  info: {
    opacity: 0.5,
    fontSize: 14,
    marginRight: 20,
  },
  authors: {
    marginBottom: 10,
    display: "flex",
  },
  authorContainer: {
    marginRight: 5,
  },
});

const mapStateToProps = (state) => ({
  paper: state.paper,
});

export default connect(mapStateToProps)(Paper);
