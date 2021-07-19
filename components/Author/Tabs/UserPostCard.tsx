import AuthorAvatar from "../../AuthorAvatar";
import DesktopOnly from "../../DesktopOnly";
import HubDropDown from "../../Hubs/HubDropDown";
import HubTag from "../../Hubs/HubTag";
import Link from "next/link";
import Router from "next/router";
import MobileOnly from "../../MobileOnly";
import React, { Fragment, SyntheticEvent, useState, useEffect } from "react";
import ResponsivePostVoteWidget from "./ResponsivePostVoteWidget";
import Ripples from "react-ripples";
import colors from "../../../config/themes/colors";
import icons from "../../../config/themes/icons";
import { css, StyleSheet } from "aphrodite";
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
  userVoteToConstant,
} from "../../../config/constants";
import API from "../../../config/api";
import { connect } from "react-redux";
import { formatUploadedDate } from "../../../config/utils/dates";
import { transformDate } from "../../../redux/utils";
// import { handleCatch } from "../../../config/utils";

export type UserPostCardProps = {
  created_by: any;
  created_date: any;
  hubs: any[];
  id: number;
  preview_img: string;
  renderable_text: string;
  score: number;
  boost_amount: number;
  style: StyleSheet;
  title: string;
  unified_document_id: number;
  user: any;
  user_vote: any; // TODO: briansantoso - define type for user_vote
  titleAsHtml: any;
  renderableTextAsHtml: any;
};

const renderMetadata = (created_date, mobile = false) => {
  if (created_date) {
    return <div>{renderUploadedDate(created_date, mobile)}</div>;
  }
};

const renderUploadedDate = (created_date, mobile) => {
  if (created_date) {
    const formattedDate = formatUploadedDate(
      transformDate(created_date),
      mobile
    );
    if (!mobile) {
      return (
        <div className={css(styles.metadataContainer, styles.publishContainer)}>
          <span className={css(styles.metadataText)}>{formattedDate}</span>
        </div>
      );
    } else {
      return (
        <div className={css(styles.metadataContainer, styles.publishContainer)}>
          <span>{icons.calendar}</span>
          <span className={css(styles.metadataText)}>{formattedDate}</span>
        </div>
      );
    }
  }
};

function UserPostCard(props: UserPostCardProps) {
  const {
    created_by,
    created_date,
    hubs,
    id,
    preview_img: previewImg,
    renderable_text: renderableText,
    score: initialScore,
    boost_amount: boostAmount,
    style,
    title,
    unified_document_id: unifiedDocumentId,
    user,
    user_vote: userVote,
    /*
      In some contexts we want to wrap the title/renderable_text 
      with html. e.g. rendering search highlights.
    */
    titleAsHtml,
    renderableTextAsHtml,
  } = props;

  if (created_by == null) {
    return null;
  }

  const {
    author_profile: { first_name, last_name, author },
  } = created_by;

  const [voteState, setVoteState] = useState<string | null>(
    userVoteToConstant(userVote)
  );
  const [score, setScore] = useState<number>(initialScore + (boostAmount || 0));
  const [isHubsOpen, setIsHubsOpen] = useState(false);

  useEffect((): void => {
    setVoteState(userVoteToConstant(userVote));
  }, [userVote]);

  const creatorName = first_name + " " + last_name;
  const slug = title.toLowerCase().replace(/\s/g, "-");
  const mainTitle = (
    <Link href={"/post/[documentId]/[title]"} as={`/post/${id}/${slug}`}>
      <a
        className={css(styles.link)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span className={css(styles.title)}>
          {titleAsHtml ? titleAsHtml : title ? title : ""}
        </span>
      </a>
    </Link>
  );

  let previewImgComponent;
  if (previewImg) {
    previewImgComponent = (
      <div
        className={css(styles.column, styles.previewColumn)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css(styles.preview)}>
          <img src={previewImg} className={css(styles.image)} />
        </div>
      </div>
    );
  } else {
    previewImgComponent = (
      <div className={css(styles.column, styles.previewColumn)}>
        <div className={css(styles.preview, styles.previewEmpty)} />
      </div>
    );
  }

  const creatorTag = (
    <div className={css(styles.postCreatedBy)}>
      <AuthorAvatar
        author={created_by.author_profile}
        size={28}
        border="2px solid #F1F1F1"
      />
      {/* <span className={css(styles.creatorName)}>{creatorName}</span> */}
    </div>
  );

  const summary = (
    <div className={css(styles.summary) + " clamp2"}>
      {renderableTextAsHtml
        ? renderableTextAsHtml
        : renderableText
        ? renderableText
        : ""}
    </div>
  );

  const hubTags = (
    <div className={css(styles.tags)}>
      {hubs.map(
        (tag, index) =>
          tag &&
          index < 3 && (
            // @ts-ignore
            <HubTag
              key={`hub_${index}`}
              tag={tag}
              last={index === hubs.length - 1}
              labelStyle={
                hubs.length >= 3 ? styles.smallerHubLabel : styles.hubLabel
              }
            />
          )
      )}
      {hubs.length > 3 && (
        <HubDropDown
          hubs={hubs}
          labelStyle={styles.hubLabel}
          isOpen={isHubsOpen}
          setIsOpen={setIsHubsOpen}
        />
      )}
    </div>
  );

  const createVoteHandler = (voteType) => {
    const voteStrategies = {
      [UPVOTE]: {
        increment: 1,
        getUrl: API.RH_POST_UPVOTE,
      },
      [DOWNVOTE]: {
        increment: -1,
        getUrl: API.RH_POST_DOWNVOTE,
      },
    };

    const { increment, getUrl } = voteStrategies[voteType];

    const handleVote = async (postId) => {
      const response = await fetch(getUrl(postId), API.POST_CONFIG()).catch(
        (err) => console.log(err)
      );

      return response;
    };

    return async (e: SyntheticEvent) => {
      e.stopPropagation();

      if (user && user.author_profile.id === created_by.author_profile.id) {
        console.log("Not logged in or Attempted to vote own post");
        return;
      }

      if (voteState === voteType) {
        /**
         * Deselect
         * NOTE: This will never be called with the current implementation of
         * VoteWidget, because it disables the onVote/onDownvote callback
         * if the button is already selected.
         */
        setVoteState(null);
        setScore(score - increment); // Undo the vote
      } else {
        setVoteState(voteType);
        if (voteState === UPVOTE || voteState === DOWNVOTE) {
          // If post was already upvoted / downvoted by user, then voting
          // oppoistely will reverse the score by twice as much
          setScore(score + increment * 2);
        } else {
          // User has not voted, so regular vote
          setScore(score + increment);
        }
      }

      await handleVote(id);
    };
  };

  const desktopVoteWidget = (
    <ResponsivePostVoteWidget
      onDesktop
      onDownvote={createVoteHandler(DOWNVOTE)}
      onUpvote={createVoteHandler(UPVOTE)}
      score={score}
      voteState={voteState}
    />
  );

  const mobileVoteWidget = (
    <ResponsivePostVoteWidget
      onDesktop={false}
      onDownvote={createVoteHandler(DOWNVOTE)}
      onUpvote={createVoteHandler(UPVOTE)}
      score={score}
      voteState={voteState}
    />
  );
  const mobileCreatorTag = <MobileOnly> {creatorTag} </MobileOnly>;

  const navigateToPage = (e) => {
    if (e.metaKey || e.ctrlKey) {
      window.open(`/post/${id}/${slug}`, "_blank");
    } else {
      Router.push("/post/[documentId]/[title]", `/post/${id}/${slug}`);
    }
  };

  const metadata = renderMetadata(created_date);

  return (
    <Ripples
      className={css(
        styles.userPostCard,
        style && style,
        isHubsOpen && styles.overflow
      )}
      onClick={navigateToPage}
    >
      {desktopVoteWidget}
      <div className={css(styles.container)}>
        <div className={css(styles.rowContainer)}>
          <div className={css(styles.column, styles.metaData)}>
            <div className={css(styles.topRow)}>
              {mobileVoteWidget}
              <DesktopOnly> {mainTitle} </DesktopOnly>
            </div>
            <MobileOnly> {mainTitle} </MobileOnly>
            {metadata}
            {summary}
            {mobileCreatorTag}
          </div>
          <DesktopOnly> {previewImgComponent} </DesktopOnly>
        </div>
        <div className={css(styles.bottomBar)}>
          <div className={css(styles.rowContainer)}>
            <DesktopOnly> {creatorTag} </DesktopOnly>
          </div>
          <DesktopOnly>
            <div className={css(styles.row)}>
              {/* TODO: briansantoso - Hub tags go here */}
              {hubTags}
            </div>
          </DesktopOnly>
        </div>
        <MobileOnly>
          <div className={css(styles.bottomBar, styles.mobileHubTags)}>
            {/* TODO: briansantoso - Hub tags go here */}
            {hubTags}
          </div>
        </MobileOnly>
      </div>
    </Ripples>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPostCard);

/**
 * Styles taken from PaperEntryCard.js
 * If style does not appear correct, check if Paper Entry Cards
 * are behaving the same way. If not, refer to PaperEntryCard.js styles
 */
const styles = StyleSheet.create({
  userPostCard: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  overflow: {
    overflow: "visible",
  },
  postCreatedBy: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      marginTop: 8,
    },
  },
  postContent: {},
  creatorName: {
    fontSize: 18,
    fontWeight: 400,
    marginLeft: 8,
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
  },
  image: {
    objectFit: "contain",
    maxHeight: 90,
    height: 90,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  },
  rowContainer: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    position: "relative",
  },
  metaData: {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "space-between",
    marginRight: "8px",
  },
  metadataContainer: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 5,
  },
  publishContainer: {
    marginRight: 10,
  },
  metadataText: {
    fontSize: 13,
    color: colors.BLACK(0.5),
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 8,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "space-between",
      paddingBottom: 10,
    },
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  mobileHubTags: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      width: "100%",
      justifyContent: "flex-end",
      marginTop: 0,
    },
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
  },
  title: {
    width: "100%",
    fontSize: 20,
    fontWeight: 500,
    color: colors.BLACK(),
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
      paddingBottom: 10,
    },
  },
  preview: {
    height: 90,
    maxHeight: 90,
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  previewEmpty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "unset",
    backgroundColor: "unset",
    height: "unset",
    maxHeight: "unset",
    width: "unset",
    minWidth: "unset",
    maxWidth: "unset",
  },
  previewColumn: {
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  },
  summary: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    color: colors.BLACK(0.8),
    fontSize: 14,
    lineHeight: 1.3,
    marginTop: 5,
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  row: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      height: "unset",
      alignItems: "flex-start",
    },
  },
  hubLabel: {
    "@media only screen and (max-width: 415px)": {
      maxWidth: 60,
      flexWrap: "unset",
    },
  },
  smallerHubLabel: {
    maxWidth: 150,
    "@media only screen and (max-width: 415px)": {
      maxWidth: 60,
      flexWrap: "unset",
    },
  },
  tags: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap-reverse",
    marginLeft: "auto",
    width: "max-content",
    "@media only screen and (max-width: 970px)": {
      flexWrap: "wrap",
    },
    "@media only screen and (max-width: 767px)": {
      margin: 0,
      padding: 0,
      width: "fit-content",
    },
  },
});
