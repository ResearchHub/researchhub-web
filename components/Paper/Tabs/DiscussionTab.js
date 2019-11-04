import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import { timeAgo } from "~/config/utils";
import Ripples from "react-ripples";

// Components
import TextEditor from "~/components/TextEditor";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import ComponentWrapper from "../../ComponentWrapper";
import Message from "~/components/Loader/Message";
import PermissionNotificationWrapper from "../../PermissionNotificationWrapper";
import AddDiscussionModal from "~/components/modal/AddDiscussionModal";

// Redux
import { MessageActions } from "~/redux/message";
import { thread } from "~/redux/discussion/shims";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import discussionScaffold from "~/components/Paper/discussionScaffold.json";
import { endsWithSlash } from "~/config/utils/routing";
const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

const DiscussionTab = (props) => {
  const initialDiscussionState = {
    title: "",
    question: discussionScaffoldInitialValue,
  };
  const { hostname, threads } = props;
  const router = useRouter();
  const basePath = formatBasePath(router.asPath);
  const formattedThreads = formatThreads(threads, basePath);
  const [transition, setTransition] = useState(false);
  const [addView, toggleAddView] = useState(false);
  const [discussion, setDiscussion] = useState(initialDiscussionState);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    function handleWindowResize() {
      if (window.innerWidth < 436) {
        if (!mobileView) {
          setMobileView(true);
        }
      } else {
        if (mobileView) {
          setMobileView(false);
        }
      }
    }
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

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
            newCard={transition && i === 0} //conditions when a new card is made
            mobileView={mobileView}
          />
        );
      })
    );
  }

  const addDiscussion = () => {
    props.showMessage({ show: false });
    props.openAddDiscussionModal(true);
  };

  const cancel = () => {
    setDiscussion(initialDiscussionState);
    document.body.style.overflow = "scroll";
    props.openAddDiscussionModal(false);
  };

  const save = async () => {
    if (discussion.title === "" || discussion.question.document.text === "") {
      props.setMessage("Fields must not be empty.");
      return props.showMessage({ show: true, error: true });
    }
    let { paperId } = router.query;
    props.showMessage({ load: true, show: true });

    let param = {
      title: discussion.title,
      text: discussion.question.toJSON(),
      paper: paperId,
    };

    let config = await API.POST_CONFIG(param);

    return fetch(API.DISCUSSION(paperId), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        setTransition(true);
        let newDiscussion = { ...resp };
        newDiscussion = thread(newDiscussion);
        threads.unshift(newDiscussion);
        let formattedDiscussion = createFormattedDiscussion(newDiscussion);
        formattedThreads.unshift(formattedDiscussion);
        setTimeout(() => {
          props.showMessage({ show: false });
          props.setMessage("Successfully Saved!");
          props.showMessage({ show: true });
          setTimeout(() => cancel(), 300);
          setTimeout(() => setTransition(false), 3000);
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

  const createFormattedDiscussion = (newDiscussion) => {
    let discussionObject = {
      data: newDiscussion,
      key: newDiscussion.id,
      path: `/paper/1/discussion/${newDiscussion.id}`,
    };
    return discussionObject;
  };

  const handleInput = (id, value) => {
    let newDiscussion = { ...discussion };
    newDiscussion[id] = value;
    setDiscussion(newDiscussion);
  };

  const handleDiscussionTextEditor = (editorState) => {
    let newDiscussion = { ...discussion };
    newDiscussion.question = editorState;
    setDiscussion(newDiscussion);
  };

  const openAddDiscussionModal = () => {
    props.openAddDiscussionModal(true);
  };

  const renderAddDiscussion = () => {
    return (
      <div
        className={css(
          styles.box
          // formattedThreads.length < 1 && styles.plainBox
        )}
      >
        {formattedThreads.length < 1 && (
          <span className={css(styles.box)}>
            <span className={css(styles.icon)}>
              <i className="fad fa-comments" />
            </span>
            <h2 className={css(styles.noSummaryTitle)}>
              There are no discussions for this paper yet.
            </h2>
            <div className={css(styles.text)}>
              Please add a discussion to this paper
            </div>
          </span>
        )}

        <PermissionNotificationWrapper
          onClick={addDiscussion}
          modalMessage="create a discussion thread"
          permissionKey="CreateDiscussionThread"
          loginRequired={true}
        >
          <button
            className={css(
              styles.addDiscussionButton,
              formattedThreads.length > 0 && styles.plainButton
            )}
          >
            {formattedThreads.length > 0 && (
              <span className={css(styles.discussionIcon)}>
                <i class="fad fa-comment-plus" />
              </span>
            )}
            Add Discussion
          </button>
        </PermissionNotificationWrapper>
      </div>
    );
  };

  return (
    <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
      <AddDiscussionModal
        handleDiscussionTextEditor={handleDiscussionTextEditor}
        discussion={discussion}
        handleInput={handleInput}
        cancel={cancel}
        save={save}
      />
      {threads.length > 0 ? (
        <Fragment>
          <div className={css(styles.box, !addView && styles.right)}>
            <div className={css(styles.addDiscussionContainer)}>
              {renderAddDiscussion()}
            </div>
          </div>
          {renderThreads(formattedThreads, hostname)}
        </Fragment>
      ) : (
        <div className={css(styles.addDiscussionContainer)}>
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
    marginBottom: 15,
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      fontSize: 16,
      marginBottom: 0,
      // marginTop: -10
    },
  },
  plainBox: {
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      fontSize: 16,
      backgroundColor: "#FFF",
    },
  },
  right: {
    alignItems: "flex-end",
  },
  noSummaryTitle: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      width: 250,
      fontSize: 16,
    },
  },
  text: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
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
    "@media only screen and (max-width: 415px)": {
      padding: "6px 24px",
      fontSize: 14,
    },
  },
  plainButton: {
    marginTop: 0,
    backgroundColor: colors.BLUE(1),
    border: "none",
    backgroundColor: "#FFF",
    padding: 16,
    color: "rgb(36, 31, 58)",
    opacity: 0.6,
    ":hover": {
      backgroundColor: "none",
      color: colors.PURPLE(1),
      opacity: 1,
      textDecoration: "underline",
    },
  },
  pencilIcon: {
    marginRight: 5,
  },
  discussionIcon: {
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
    cursor: "pointer",
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
    // marginTop: 10,
    "@media only screen and (max-width: 415px)": {
      height: "unset",
    },
  },
  transition: {
    padding: 1,
    border: `1px solid ${colors.BLUE(1)}`,
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
  },
  asterick: {
    color: colors.BLUE(1),
  },
  componentWrapperStyles: {
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
});

const mapStateToProps = (state) => ({
  message: state.auth,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openAddDiscussionModal: ModalActions.openAddDiscussionModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionTab);
