import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";

// Components
import TextEditor from "~/components/TextEditor";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import ComponentWrapper from "../../ComponentWrapper";
import Message from "~/components/Loader/Message";

// Redux
import { MessageActions } from "~/redux/message";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import discussionScaffold from "~/components/Paper/discussionScaffold.json";
import { endsWithSlash } from "~/config/utils/routing";
const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

const DiscussionTab = (props) => {
  const { hostname, threads } = props;
  const router = useRouter();
  const basePath = formatBasePath(router.asPath);
  const formattedThreads = formatThreads(threads, basePath);
  const [transition, setTransition] = useState(false);
  const [addView, toggleAddView] = useState(false);
  const [discussion, setDiscussion] = useState({
    title: "",
    question: discussionScaffoldInitialValue,
  });

  props.showMessage({ show: false });

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

  const addDiscussion = async () => {
    await setTransition(true);
    setTimeout(() => {
      toggleAddView(true);
      setTransition(false);
    }, 200);
  };

  const cancel = async () => {
    await setTransition(true);
    setTimeout(() => {
      toggleAddView(false);
      setTransition(false);
    }, 200);
  };

  const save = async () => {
    let { paperId } = router.query;
    props.showMessage({ load: true, show: true });

    let param = {
      title: discussion.title,
      text: JSON.stringify(discussion.question.toJSON()),
      paper: paperId,
    };

    let config = await API.POST_CONFIG(param);

    return fetch(API.DISCUSSION(paperId), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        setTimeout(() => {
          props.showMessage({ show: false });
          props.setMessage("Successfully Saved!");
          props.showMessage({ show: true });
          setTimeout(() => cancel(), 300);
        }, 800);
      })
      .catch((err) => {
        setTimeout(() => {
          props.showMessage({ show: false });
          props.setMessage("Something went wrong");
          props.showMessage({ show: true, error: true });
        }, 800);
      });
  };

  function handleInput(id, value) {
    let newDiscussion = { ...discussion };
    newDiscussion[id] = value;
    setDiscussion(newDiscussion);
  }

  const handleDiscussionTextEditor = (editorState) => {
    let newDiscussion = { ...discussion };
    newDiscussion.question = editorState;
    setDiscussion(newDiscussion);
  };

  function renderAddDiscussion() {
    if (addView) {
      return (
        <div className={css(styles.box)}>
          <Message />
          <FormInput
            label={"Title"}
            placeholder="Title of discussion"
            containerStyle={styles.container}
            value={discussion.title}
            id={"title"}
            onChange={handleInput}
          />
          <div className={css(styles.discussionInputWrapper)}>
            <div className={css(styles.label)}>Question</div>
            <div className={css(styles.discussionTextEditor)}>
              <TextEditor
                canEdit={true}
                readOnly={false}
                onChange={handleDiscussionTextEditor}
                hideButton={true}
                placeholder={"Leave a question or a comment"}
                initialValue={discussion.question}
              />
            </div>
          </div>
          <div className={css(styles.buttonRow, styles.buttons)}>
            <div
              className={css(styles.button, styles.buttonLeft)}
              onClick={cancel}
            >
              <span className={css(styles.buttonLabel, styles.text)}>
                Cancel
              </span>
            </div>
            <Button
              label={"Save"}
              customButtonStyle={styles.button}
              onClick={save}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className={css(styles.box)}>
          {props.threads.length < 1 && (
            <span className={css(styles.box)}>
              {/* <img className={css(styles.img)} src={"/static/icons/sad.png"} /> */}
              <span className={css(styles.icon)}>
                <i class="fad fa-comments" />
              </span>
              <h2 className={css(styles.noSummaryTitle)}>
                There are no discussions for this paper yet.
              </h2>
              <div className={css(styles.text)}>
                Please add a discussion to this paper
              </div>
            </span>
          )}
          <button
            className={css(styles.addDiscussionButton)}
            onClick={addDiscussion}
          >
            Add Discussion
          </button>
        </div>
      );
    }
  }

  return (
    <ComponentWrapper>
      {threads.length > 0 ? (
        <Fragment>
          {renderThreads(formattedThreads, hostname)}
          <div className={css(styles.box)}>{renderAddDiscussion()}</div>
        </Fragment>
      ) : (
        <div
          className={css(
            styles.addDiscussionContainer,
            transition && styles.transition
          )}
        >
          {renderAddDiscussion()}
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
    scrollBehavior: "smooth",
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
  addDiscussionButton: {
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
  discussionInputWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  discussionTextEditor: {
    width: 600,
    height: 200,
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
  },
  container: {
    width: 600,
    marginBottom: 20,
  },
  buttonRow: {
    width: "70%",
    minWidth: 820,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 40,
  },
  buttons: {
    justifyContent: "center",
  },
  button: {
    width: 180,
    height: 55,
  },
  buttonLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  buttonLabel: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  addDiscussionContainer: {
    transition: "all ease-in-out 0.3s",
    opacity: 1,
  },
  transition: {
    opacity: 0,
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
  },
});

const mapStateToProps = (state) => ({
  message: state.auth,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionTab);
