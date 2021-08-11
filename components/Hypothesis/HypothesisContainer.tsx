import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { css, StyleSheet } from "aphrodite";
import * as moment from "dayjs";
import ReactHtmlParser from "react-html-parser";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { formatPublishedDate } from "~/config/utils/dates";
import colors from "~/config/themes/colors";

// Components
import Head from "~/components/Head";
import CitationContainer from "./Citation/CitationContainer";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import VoteWidget from "~/components/VoteWidget";
import PaperPromotionIcon from "~/components/Paper/PaperPromotionIcon";
import PaperSideColumn from "~/components/Paper/SideColumn/PaperSideColumn";
import PaperMetadata from "~/components/Paper/PaperMetadata";

type Props = {};

function useFetchHypothesis() {
  const router = useRouter();
  const [hypothesis, setHypothesis] = useState(null);

  useEffect(() => {
    fetch(
      API.HYPOTHESIS({ hypothesis_id: router.query.documentId }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        setHypothesis(data);
      });
  }, []);

  return hypothesis;
}

const renderMetadata = (hypothesis) => {
  const created_date = hypothesis.created_date;
  const metadata = [
    {
      label: "Published",
      value: (
        <span
          className={css(styles.metadata) + " clamp1"}
          property="datePublished"
          dateTime={created_date}
        >
          {formatPublishedDate(moment(created_date), true)}
        </span>
      ),
      active: created_date,
    },
  ];
  return (
    <div className={css(styles.row)}>
      {metadata.map((props, i) => (
        <PaperMetadata
          key={`metadata-${i}`}
          {...props}
          containerStyles={i === 0 && styles.marginRight}
        />
      ))}
    </div>
  );
};

const renderActions = () => {
  const { post, isModerator, flagged, setFlag, isSubmitter, user } = this.props;
  const uploadedById = post && post.created_by && post.created_by.id;
  const isUploaderSuspended =
    post && post.created_by && post.created_by.is_suspended;
  const actionButtons = [
    {
      active: post.created_by && user.id === post.created_by.id,
      button: (
        <PermissionNotificationWrapper
          modalMessage="edit post"
          onClick={this.toggleShowPostEditor}
          permissionKey="UpdatePaper"
          loginRequired={true}
          hideRipples={true}
          styling={styles.borderRadius}
        >
          <ReactTooltip />
          <div className={css(styles.actionIcon)} data-tip={"Edit Post"}>
            {icons.pencil}
          </div>
        </PermissionNotificationWrapper>
      ),
    },
    {
      active: true,
      button: (
        <ShareAction
          addRipples={true}
          title={"Share this post"}
          subtitle={post && post.title}
          url={this.props.shareUrl}
          customButton={
            <div className={css(styles.actionIcon)} data-tip={"Share Post"}>
              {icons.shareAlt}
            </div>
          }
        />
      ),
    },
    {
      active: true,
      button: (
        <span data-tip={"Support Post"}>
          <PaperPromotionButton post={post} customStyle={styles.actionIcon} />
        </span>
      ),
    },
    //{
    //  active: !isSubmitter,
    //  button: (
    //    <span data-tip={"Flag Post"}>
    //      <FlagButton
    //        paperId={post.id}
    //        flagged={flagged}
    //        setFlag={setFlag}
    //        style={styles.actionIcon}
    //      />
    //    </span>
    //  ),
    //},
    {
      active: isModerator || isSubmitter,
      button: (
        <span
          className={css(styles.actionIcon, styles.moderatorAction)}
          data-tip={post.is_removed ? "Restore Page" : "Remove Page"}
        >
          <ActionButton
            isModerator={true}
            paperId={post.id}
            restore={post.is_removed}
            icon={post.is_removed ? icons.plus : icons.minus}
            onAction={post.is_removed ? this.restorePaper : this.removePaper}
            containerStyle={styles.moderatorContainer}
            iconStyle={styles.moderatorIcon}
          />
        </span>
      ),
    },
    {
      active: isModerator && !isNullOrUndefined(uploadedById),
      button: (
        <>
          <ReactTooltip />
          <span
            className={css(styles.actionIcon, styles.moderatorAction)}
            data-tip={isUploaderSuspended ? "Reinstate User" : "Ban User"}
          >
            <ActionButton
              isModerator={isModerator}
              paperId={post.id}
              uploadedById={uploadedById}
              isUploaderSuspended={isUploaderSuspended}
              containerStyle={styles.moderatorContainer}
              iconStyle={styles.moderatorIcon}
              actionType="user"
            />
          </span>
        </>
      ),
    },
  ].filter((action) => action.active);

  return (
    <div className={css(styles.actions) + " action-bars"}>
      {actionButtons.map((action, i) => {
        if (actionButtons.length - 1 === i) {
          return <span key={i}>{action.button}</span>;
        }

        return (
          <span key={i} className={css(styles.actionButtonMargin)}>
            {action.button}
          </span>
        );
      })}
    </div>
  );
};

const voteWidget = (horizontalView) => (
  <VoteWidget
    //score={score + post.boost_amount}
    //onUpvote={this.onUpvote}
    //onDownvote={this.onDownvote}
    //selected={voteState}
    horizontalView={horizontalView}
    isPaper={false}
    type={"Hypothesis"}
  />
);

const renderHypothesisEditor = (hypothesisBody, setHypothesisBody) => {
  return (
    <>
      <SimpleEditor
        id="text"
        initialData={hypothesisBody}
        labelStyle={styles.label}
        onChange={(id, editorData) =>
          useEffect(() => {
            setHypothesisBody(editorData);
          }, [])
        }
        containerStyle={styles.editor}
      />
      <div className={css(styles.editButtonRow)}>
        <Button
          isWhite={true}
          label={"Cancel"}
          onClick={toggleShowPostEditor}
          size={"small"}
        />
        <Button label={"Save"} onClick={this.sendPost} size={"small"} />
      </div>
    </>
  );
};

const toggleShowPostEditor = () => {
  ReactTooltip.hide();
  this.setState({ showPostEditor: !this.state.showPostEditor });
};

export default function HypothesisContainer(props: Props): ReactElement<"div"> {
  const hypothesis = useFetchHypothesis();
  const [showHypothesisEditor, setShowHypothesisEditor] = useState(false);
  const [hypothesisBody, setHypothesisBody] = useState("");
  const [discussionCount, setDiscussionCount] = useState(0);

  useEffect(() => {
    if (!isNullOrUndefined(hypothesis)) {
      setHypothesisBody(hypothesis.full_markdown);
      setDiscussionCount(hypothesis.discussion_count);
    }
  }, [hypothesis]);

  return !isNullOrUndefined(hypothesis) ? (
    <div>
      <Head
        title={"test title"}
        description={"test description"}
        //socialImageUrl={null}
        //noindex={hypothesis.is_removed}
        //canonical={`https://www.researchhub.com/hypothesis/${hypothesis.id}/${hypothesis.slug}`}
      />
      <div className={css(styles.container)}>
        <div className={css(styles.hypothesisCard)}>
          <div className={css(styles.voting)}>
            {voteWidget(false)}
            {/* <PaperPromotionIcon hypothesis={null} /> */}
          </div>
          <div className={css(styles.column)}>
            <div className={css(styles.reverseRow)}>
              <div className={css(styles.cardContainer)}>
                <div className={css(styles.metaContainer)}>
                  <div className={css(styles.titleHeader)}>
                    <div className={css(styles.row)}>
                      <h1 className={css(styles.title)} property={"headline"}>
                        {hypothesis.title}
                      </h1>
                    </div>
                  </div>
                  <div className={css(styles.column)}>
                    {renderMetadata(hypothesis)}
                  </div>
                  <div className="ck-content">
                    {showHypothesisEditor ? (
                      renderHypothesisEditor(hypothesisBody, setHypothesisBody)
                    ) : (
                      <>
                        {hypothesisBody && ReactHtmlParser(hypothesisBody)}
                        <div className={css(styles.bottomContainer)}>
                          <div className={css(styles.bottomRow)}>
                            {/*renderActions()*/}
                          </div>
                          <div className={css(styles.downloadPDF)}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={css(styles.rightColumn, styles.mobile)}>
                <div className={css(styles.votingMobile)}>
                  {voteWidget(true)}
                  {/* <PaperPromotionIcon hypothesis={null} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CitationContainer />
        <div className={css(styles.space)}>
          <a name="comments" />
          <DiscussionTab
            documentType={"hypothesis"}
            hypothesis={hypothesis}
            hypothesisId={hypothesis.id}
            calculatedCount={discussionCount}
            setCount={setDiscussionCount}
            isCollapsible={false}
          />
        </div>
        <div className={css(styles.sidebar)}>
          <PaperSideColumn
            authors={[hypothesis.created_by.author_profile]}
            paper={hypothesis}
            hubs={hypothesis.hubs}
            paperId={hypothesis.id}
            isPost={true}
          />
        </div>
      </div>
    </div>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
    borderCollapse: "separate",
    borderSpacing: "30px 40px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      borderSpacing: "0",
      display: "flex",
      flexDirection: "column",
    },
    "@media only screen and (min-width: 768px)": {
      display: "flex",
      marginTop: 16,
      width: "90%",
    },
    "@media only screen and (min-width: 1024px)": {
      width: "100%",
      display: "table",
    },
    "@media only screen and (min-width: 1200px)": {
      width: "90%",
    },
  },
  hypothesisCard: {
    display: "flex",
    flexDirection: "row",
    border: "1.5px solid #F0F0F0",
    backgroundColor: "#fff",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    padding: "20px 30px 30px 20px",
    boxSizing: "border-box",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      padding: 20,
      width: "100%",
    },
  },
  sidebar: {
    display: "table-cell",
    boxSizing: "border-box",
    verticalAlign: "top",
    position: "relative",
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
    "@media only screen and (min-width: 768px)": {
      width: "20%",
      marginLeft: 16,
    },
    "@media only screen and (min-width: 1024px)": {
      minWidth: 250,
      maxWidth: 280,
      width: 280,
      marginLeft: 0,
    },
  },
  voting: {
    display: "block",
    width: 65,
    fontSize: 16,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginLeft: 20,
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
  reverseRow: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column-reverse",
    },
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
    "@media only screen and (max-width: 415px)": {
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
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      marginLeft: 0,
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexDirection: "row",
      paddingBottom: 10,
    },
  },
  votingMobile: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
    display: "flex",
    alignItems: "center",
  },
  metadata: {
    fontSize: 16,
    color: colors.BLACK(0.7),
    margin: 0,
    padding: 0,
    fontWeight: "unset",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
});
