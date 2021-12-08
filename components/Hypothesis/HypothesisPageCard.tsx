import { css, StyleSheet } from "aphrodite";
import { connect } from "react-redux";
import {
  DOWNVOTE,
  DOWNVOTE_ENUM,
  UPVOTE,
  UPVOTE_ENUM,
} from "~/config/constants";
import {
  emptyFncWithMsg,
  filterNull,
  isNullOrUndefined,
} from "~/config/utils/nullchecks";
import { ID } from "~/config/types/root_types";
import { formatPublishedDate } from "~/config/utils/dates";
import {
  Fragment,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { postHypothesisVote } from "./api/postHypothesisVote";
import { updateHypothesis } from "./api/updateHypothesis";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import icons from "~/config/themes/icons";
import PaperMetadata from "~/components/Paper/PaperMetadata";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import ReactHtmlParser from "react-html-parser";
import VoteWidget from "~/components/VoteWidget";
import ActionButton from "../ActionButton";
import { breakpoints } from "~/config/themes/screen";
import {
  removeHypothesis,
  restoreHypothesis,
} from "./api/postHypothesisStatus";
import ColumnHubs from "../Paper/SideColumn/ColumnHubs";

const DynamicCKEditor = dynamic(
  () => import("~/components/CKEditor/SimpleEditor")
);

const getActionButtons = ({
  createdBy,
  currentUser,
  hypothesis,
  onUpdates,
  setShowHypothesisEditor,
}: {
  currentUser: any;
  createdBy: any;
  hypothesis: any;
  onUpdates: Function;
  setShowHypothesisEditor: (flag: boolean) => void;
}): ReactNode => {
  const {
    id: hypoID,
    is_removed: isHypoRemoved,
    unified_document: hypoUniDocID,
  } = hypothesis ?? {};
  const { moderator: isModerator } = currentUser ?? {};
  const isCurrUserSubmitter =
    !isNullOrUndefined(createdBy) && currentUser.id === createdBy.id;
  const actionConfigs = [
    {
      active: isCurrUserSubmitter,
      button: (
        <PermissionNotificationWrapper
          hideRipples
          loginRequired
          modalMessage="edit hypothesis"
          onClick={(): void => setShowHypothesisEditor(true)}
          permissionKey="UpdatePaper"
          styling={styles.borderRadius}
        >
          <div className={css(styles.actionIcon)} data-tip={"Edit Hypothesis"}>
            {icons.pencil}
          </div>
        </PermissionNotificationWrapper>
      ),
    },
    {
      active: isModerator || isCurrUserSubmitter,
      button: (
        <span
          className={css(styles.actionIcon, styles.moderatorAction)}
          data-tip={isHypoRemoved ? "Restore Hypothesis" : "Remove Hypothesis"}
        >
          <ActionButton
            isModerator={true}
            paperId={hypoID}
            restore={isHypoRemoved}
            icon={isHypoRemoved ? icons.plus : icons.minus}
            onAction={() => {
              if (isHypoRemoved) {
                restoreHypothesis({
                  hypoUniDocID,
                  onError: (error: Error) => emptyFncWithMsg(error),
                  onSuccess: (): void => onUpdates(Date.now()),
                });
              } else {
                removeHypothesis({
                  hypoUniDocID,
                  onError: (error: Error) => emptyFncWithMsg(error),
                  onSuccess: (): void => onUpdates(Date.now()),
                });
              }
            }}
            containerStyle={styles.moderatorContainer}
            iconStyle={styles.moderatorIcon}
          />
        </span>
      ),
    },
  ];
  return filterNull(
    actionConfigs.map((config, index: number): any => {
      if (config.active) {
        return (
          <span key={index} className={css(styles.actionButtonMargin)}>
            {config.button}
          </span>
        );
      } else {
        return null;
      }
    })
  );
};

const getMetaData = ({
  authors,
  hypothesis,
}: {
  authors: any[];
  hypothesis: any;
}): ReactElement<"div"> => {
  const { created_date } = hypothesis;
  const { first_name = "", last_name = "" } = authors[0];
  const metadata = [
    {
      label: "Published",
      value: (
        <span
          className={css(styles.metadata) + " clamp1"}
          property="datePublished"
        >
          {formatPublishedDate(dayjs(created_date), true)}
        </span>
      ),
      active: created_date,
    },
    {
      label: "Author",
      value: (
        <span className={css(styles.metadata) + " clamp2"} property="author">
          {first_name + " " + last_name}
        </span>
      ),
      active: created_date,
    },
  ].map((props, i) => <PaperMetadata key={`metadata-${i}`} {...props} />);
  return <div className={css(styles.row)}>{metadata}</div>;
};

const getVoteWidgetProps = ({
  hypothesis,
  localVoteMeta,
  setLocalVoteMeta,
}) => {
  const { downCount, upCount, userVote } = localVoteMeta || {};
  const currScore =
    upCount - downCount + ((hypothesis || {}).boost_amount || 0);
  const { vote_type: currUserVoteType } = userVote || {};

  const handleDownVote = () => {
    if (currUserVoteType === DOWNVOTE_ENUM) {
      return; // can't downvote twice
    }
    const updatedMeta = {
      ...localVoteMeta,
      downCount: downCount + 1,
      upCount: upCount - 1,
    };
    postHypothesisVote({
      hypothesisID: hypothesis.id,
      // NOTE: optimistic update.
      onSuccess: (userVote: any) =>
        setLocalVoteMeta({
          ...updatedMeta,
          userVote,
        }),
      onError: emptyFncWithMsg,
      voteType: DOWNVOTE,
    });
  };

  const handleUpvote = () => {
    if (currUserVoteType === UPVOTE_ENUM) {
      return; // can't upvote twice
    }
    const updatedMeta = {
      ...localVoteMeta,
      downCount: downCount - 1,
      upCount: upCount + 1,
    };
    postHypothesisVote({
      hypothesisID: hypothesis.id,
      // NOTE: optimistic update.
      onSuccess: (userVote: any) =>
        setLocalVoteMeta({
          ...updatedMeta,
          userVote,
        }),
      onError: emptyFncWithMsg,
      voteType: UPVOTE,
    });
  };

  return {
    onDownvote: handleDownVote,
    onUpvote: handleUpvote,
    selected: currUserVoteType,
    score: currScore,
    type: "hypothesis",
  };
};

function HypothesisPageCard({
  authors,
  hubs,
  hypothesis,
  onUpdates,
  user: currentUser,
}): ReactElement<"div"> {
  const {
    created_by: createdBy,
    full_markdown: fullMarkdown,
    id: hypothesisID,
    title = "",
    vote_meta: voteMeta,
  } = hypothesis || {};
  const {
    down_count: downCount,
    up_count: upCount,
    user_vote: userVote,
  } = voteMeta || {};
  const [showHypothesisEditor, setShowHypothesisEditor] = useState(false);
  const [localVoteMeta, setLocalVoteMeta] = useState({
    downCount: downCount || 0,
    upCount: upCount || 0,
    userVote: userVote || null,
  });
  const [displayableMarkdown, setDisplayableMarkdown] = useState(fullMarkdown);
  const [updatedMarkdown, setUpdatedMarkdown] = useState(fullMarkdown);

  useEffect(() => {
    setDisplayableMarkdown(fullMarkdown);
  }, [fullMarkdown]);

  const actionButtons = getActionButtons({
    createdBy,
    currentUser,
    hypothesis,
    onUpdates,
    setShowHypothesisEditor,
  });
  const formattedMetaData = getMetaData({ authors, hypothesis });
  const voteWidgetProps = getVoteWidgetProps({
    hypothesis,
    localVoteMeta,
    setLocalVoteMeta,
  });

  const hypoContent = useMemo((): ReactElement<typeof Fragment> => {
    return showHypothesisEditor ? (
      <Fragment>
        <DynamicCKEditor
          id="text"
          initialData={displayableMarkdown}
          labelStyle={styles.label}
          onChange={(_id: ID, editorData: any): void =>
            setUpdatedMarkdown(editorData)
          }
        />
        <div className={css(styles.editButtonRow)}>
          <Button
            isWhite={true}
            label="Cancel"
            onClick={(): void => {
              setDisplayableMarkdown(fullMarkdown); // revert back to fetched markdown
              setShowHypothesisEditor(false);
            }}
            size="small"
          />
          <Button
            label="Save"
            onClick={() =>
              updateHypothesis({
                hypothesisID: hypothesis?.id,
                hypothesisTitle: title,
                onError: emptyFncWithMsg,
                onSuccess: () => {
                  setDisplayableMarkdown(updatedMarkdown); // optimistic update
                  setShowHypothesisEditor(false);
                },
                updatedMarkdown,
              })
            }
            size="small"
          />
        </div>
      </Fragment>
    ) : (
      <Fragment>
        {!isNullOrUndefined(displayableMarkdown)
          ? ReactHtmlParser(displayableMarkdown)
          : null}
        <div className={css(styles.bottomContainer)}>
          <div className={css(styles.bottomRow)}>
            <div className={css(styles.actions) + " action-bars"}>
              {actionButtons}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }, [
    actionButtons,
    displayableMarkdown,
    displayableMarkdown,
    showHypothesisEditor,
  ]);

  return (
    <div className={css(styles.hypothesisCard)}>
      <div className={css(styles.voting)}>
        <VoteWidget {...voteWidgetProps} />
      </div>
      <div className={css(styles.mobile)}>
        <div className={css(styles.votingMobile)}>
          <VoteWidget {...voteWidgetProps} horizontalView />
        </div>
      </div>
      <div className={css(styles.column)}>
        <div className={css(styles.cardContainer)}>
          <div className={css(styles.metaContainer)}>
            <div className={css(styles.titleHeader)}>
              <div className={css(styles.row)}>
                <h1 className={css(styles.title)} property={"headline"}>
                  {title}
                </h1>
              </div>
            </div>
            <div className={css(styles.column)}>{formattedMetaData}</div>
            <div className="ck-content">{hypoContent}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(HypothesisPageCard);

const styles = StyleSheet.create({
  hypothesisCard: {
    display: "flex",
    flexDirection: "row",
    border: "1.5px solid #F0F0F0",
    backgroundColor: "#fff",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    padding: "20px 30px 30px 20px",
    boxSizing: "border-box",
    borderRadius: 4,
    "@media only screen and (max-width: 1024px)": {
      borderBottom: "none",
      borderRadius: "4px 4px 0px 0px",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      borderRadius: "0px",
      borderTop: "none",
      padding: 20,
      width: "100%",
      flexDirection: "column",
    },
  },
  voting: {
    display: "block",
    width: 65,
    fontSize: 16,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  votingMobile: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
    display: "flex",
    alignItems: "center",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  },
  metaContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 28,
    position: "relative",
    wordBreak: "break-word",
    fontWeight: "unset",
    padding: 0,
    margin: 0,
    display: "flex",

    "@media only screen and (max-width: 760px)": {
      fontSize: 24,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  titleHeader: {
    marginTop: 5,
    marginBottom: 23,
  },
  mobile: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "flex",
      marginLeft: 0,
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexDirection: "row",
      paddingBottom: 10,
    },
  },
  metadata: {
    fontSize: 16,
    color: colors.BLACK(0.7),
    margin: 0,
    padding: 0,
    fontWeight: "unset",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 14,
    },
    marginRight: 16,
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    // minHeight: 25,
    flexWrap: "wrap",

    /**
     * Set the width of the Label ("Paper Title:", "Published:") to align text, but only do so
     * to the first element on each row. This selector is equivalent to row > "first child". */
    ":nth-child(1n) > *:nth-child(1) > div": {
      minWidth: 80,
    },

    "@media only screen and (max-width: 1023px)": {
      flexDirection: "column",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    ":hover .action-bars": {
      opacity: 1,
    },
  },
  rightColumn: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  reverseRow: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column-reverse",
    },
  },
  actionIcon: {
    padding: 5,
    borderRadius: "50%",
    backgroundColor: "rgba(36, 31, 58, 0.03)",
    color: "rgba(36, 31, 58, 0.35)",
    width: 20,
    minWidth: 20,
    maxWidth: 20,
    height: 20,
    minHeight: 20,
    maxHeight: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    cursor: "pointer",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    ":hover": {
      color: "rgba(36, 31, 58, 0.8)",
      backgroundColor: "#EDEDF0",
      borderColor: "#d8d8de",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 13,
      width: 15,
      minWidth: 15,
      maxWidth: 15,
      height: 15,
      minHeight: 15,
      maxHeight: 15,
    },
  },
  borderRadius: {
    borderRadius: "50%",
  },
  actionButtonMargin: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    color: "#241F3A",
    width: 120,
    opacity: 0.7,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 14,
    },
  },
  editButtonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    opacity: 1,
    transition: "all ease-in-out 0.2s",
  },
  bottomContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      margin: 0,
    },
  },
  bottomRow: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      // display: "none",
    },
  },
  moderatorIcon: {
    color: colors.RED(0.6),
    fontSize: 18,
    cursor: "pointer",
    ":hover": {
      color: colors.RED(1),
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 14,
    },
  },
  moderatorContainer: {
    padding: 5,
    borderRadius: "50%",
    width: 22,
    minWidth: 22,
    maxWidth: 22,
    height: 22,
    minHeight: 22,
    maxHeight: 22,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 13,
      width: 15,
      minWidth: 15,
      maxWidth: 15,
      height: 15,
      minHeight: 15,
      maxHeight: 15,
    },
  },
  moderatorAction: {
    ":hover": {
      backgroundColor: colors.RED(0.3),
      borderColor: colors.RED(),
    },
    ":hover .modIcon": {
      color: colors.RED(),
    },
  },
});
