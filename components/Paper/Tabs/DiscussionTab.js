import { Fragment } from "react";
import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import { endsWithSlash } from "~/config/utils/routing";
import ComponentWrapper from "../../ComponentWrapper";

import colors from "~/config/themes/colors";

const DiscussionTab = (props) => {
  const { hostname, threads } = props;
  const router = useRouter();
  const basePath = formatBasePath(router.asPath);
  const formattedThreads = formatThreads(threads, basePath);

  function renderThreads(threads) {
    return (
      threads &&
      threads.map((t, i) => {
        return (
          <DiscussionThreadCard
            key={t.key}
            data={t.data}
            hostname={hostname}
            hoverEvents={true}
            path={t.path}
          />
        );
      })
    );
  }

  function addDiscussion() {
    console.log("addDiscussion");
  }

  return (
    <ComponentWrapper>
      {threads.length > 0 ? (
        <Fragment>
          {renderThreads(formattedThreads, hostname)}
          <div className={css(styles.box)}>
            <button className={css(styles.button)} onClick={addDiscussion}>
              Add Discussion
            </button>
          </div>
        </Fragment>
      ) : (
        <div className={css(styles.box)}>
          <img className={css(styles.img)} src={"/static/icons/sad.png"} />
          <h2 className={css(styles.noSummaryTitle)}>
            There are no discussion for this paper yet!
          </h2>
          <div className={css(styles.text)}>
            Please add a discussion to this paper
          </div>
          <button className={css(styles.button)} onClick={addDiscussion}>
            Add Discussion
          </button>
        </div>
      )}
    </ComponentWrapper>
  );
};

function formatBasePath(path) {
  if (endsWithSlash(path)) {
    return path;
  }
  return path + "/";
}

function formatThreads(threads, basePath) {
  return (
    threads &&
    threads.map((thread) => {
      return {
        key: thread.id,
        data: thread,
        path: basePath + thread.id,
      };
    })
  );
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box",
  },
  noSummaryContainer: {
    alignItems: "center",
  },
  guidelines: {
    color: "rgba(36, 31, 58, 0.8)",
    textAlign: "center",
    letterSpacing: 0.7,
    marginBottom: 16,
    width: "100%",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  noSummaryTitle: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
  },
  text: {
    fontSize: 16,
    color: colors.BLACK(0.8),
  },
  summaryActions: {
    width: 280,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryEdit: {
    marginBottom: 50,
    width: "100%",
  },
  action: {
    color: "#241F3A",
    fontSize: 16,
    opacity: 0.6,
    display: "flex",
    cursor: "pointer",
  },
  button: {
    border: "1px solid",
    borderColor: colors.PURPLE(1),
    padding: "8px 32px",
    background: "#fff",
    color: colors.PURPLE(1),
    marginTop: 24,
    fontSize: 16,
    borderRadius: 4,
    height: 45,
    outline: "none",
    cursor: "pointer",
    ":hover": {
      borderColor: "#FFF",
      color: "#FFF",
      backgroundColor: colors.PURPLE(1),
    },
  },
  pencilIcon: {
    marginRight: 5,
  },
  draftContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  editHistoryContainer: {
    position: "absolute",
    right: -280,
    background: "#F9F9FC",
  },
  selectedEdit: {
    background: "#F0F1F7",
  },
  editHistoryCard: {
    width: 250,
    padding: "5px 10px",
    cursor: "pointer",
  },
  date: {
    fontSize: 14,
    fontWeight: 500,
  },
  user: {
    fontSize: 12,
    opacity: 0.5,
  },
  revisionTitle: {
    padding: 10,
  },
});

export default DiscussionTab;
