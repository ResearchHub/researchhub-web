import { useEffect, useState, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import { useDispatch, useStore } from "react-redux";
import ReactTooltip from "react-tooltip";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";

import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";

import { doesNotExist } from "~/config/utils";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import icons, { voteWidgetIcons, BoltSvg } from "~/config/themes/icons";
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "../config/constants";
import { getCurrentUserReputation } from "../config/utils";

import "./stylesheets/voteTooltip.css";
const VoteWidget = (props) => {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {}, [props.promoted]);

  const {
    onUpvote,
    onDownvote,
    fontSize,
    selected,
    width,
    horizontalView,
    searchResult,
    isPaper,
    type,
    promoted,
    paper,
    showPromotion,
  } = props;

  const score = getScore(props);
  const userReputation = getCurrentUserReputation(store.getState());
  const { permission } = store.getState();

  const [upvoteDisabled] = useState(
    permission.success &&
      userReputation < permission.data.UpvotePaper.minimumReputation
  );
  const [downvoteDisabled] = useState(
    permission.success &&
      userReputation < permission.data.DownvotePaper.minimumReputation
  );

  const [upvoteSelected, setUpvoteSelected] = useState(
    selected === UPVOTE || selected === UPVOTE_ENUM
  );
  const [downvoteSelected, setDownvoteSelected] = useState(
    selected === DOWNVOTE || selected === DOWNVOTE_ENUM
  );

  useEffect(() => {
    if (selected === UPVOTE || selected === UPVOTE_ENUM) {
      setUpvoteSelected(true);
      setDownvoteSelected(false);
    } else if (selected === DOWNVOTE || selected === DOWNVOTE_ENUM) {
      setDownvoteSelected(true);
      setUpvoteSelected(false);
    }
  }, [selected]);

  function onUpvoteClick(e) {
    if (upvoteDisabled) {
      dispatch(ModalActions.openPermissionNotificationModal(true, "upvote"));
    } else if (upvoteSelected) {
      // TODO: show a user state here?
    } else {
      if (isPaper || type === "Discussion") {
        let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
        dispatch(AuthActions.checkUserFirstTime(firstTime));
        dispatch(AuthActions.getUser());
      }
      onUpvote(e);
    }
  }

  function onDownvoteClick(e) {
    if (downvoteDisabled) {
      dispatch(ModalActions.openPermissionNotificationModal(true, "downvote"));
    } else if (downvoteSelected) {
      // TODO: show a user state here?
    } else {
      if (isPaper || type === "Discussion") {
        let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
        dispatch(AuthActions.checkUserFirstTime(firstTime));
        dispatch(AuthActions.getUser());
      }
      onDownvote(e);
    }
  }

  const openPromotionInfoModal = (e) => {
    e && e.stopPropagation();
    dispatch(ModalActions.openPromotionInfoModal(true, paper));
  };

  return (
    <Fragment>
      <div
        className={css(
          styles.container,
          horizontalView && styles.horizontalView,
          props.styles
        )}
        style={{ fontSize: fontSize, width: width }}
      >
        <PermissionNotificationWrapper
          loginRequired={true}
          onClick={onUpvoteClick}
          modalMessage={"vote"}
        >
          <UpvoteButton
            selected={upvoteSelected}
            disabled={upvoteDisabled || searchResult}
            horizontalView={horizontalView && horizontalView}
          />
        </PermissionNotificationWrapper>
        <ReactTooltip
          id="reputationTooltip"
          className={css(styles.tooltip)}
          place="bottom"
          effect="solid"
        />
        <ScorePill
          score={promoted !== false && type === "Paper" ? promoted : score}
          promoted={promoted}
          paper={paper}
          showPromotion={showPromotion}
          type={type}
        />
        <PermissionNotificationWrapper
          loginRequired={true}
          onClick={onDownvoteClick}
          modalMessage={"vote"}
        >
          <DownvoteButton
            selected={downvoteSelected}
            disabled={downvoteDisabled || searchResult}
            horizontalView={horizontalView && horizontalView}
          />
        </PermissionNotificationWrapper>
      </div>
    </Fragment>
  );
};

VoteWidget.propTypes = {
  fontSize: PropTypes.string,
  onUpvote: PropTypes.func,
  onDownvote: PropTypes.func,
  score: PropTypes.number,
  width: PropTypes.string,
};

const ScorePill = (props) => {
  const dispatch = useDispatch();
  const { score, paper, small, promoted, showPromotion } = props;

  const openPromotionInfoModal = (e) => {
    e && e.stopPropagation();
    let reduxProps = { ...paper };
    if (showPromotion) {
      reduxProps.showPromotion = true;
    }
    dispatch(ModalActions.openPromotionInfoModal(true, reduxProps));
  };

  return (
    <div
      className={css(
        styles.pillContainer,
        promoted !== false && styles.promotedPillContainer
      )}
      // data-tip={"This paper has been promoted."}
      onClick={(e) =>
        props.promoted !== false &&
        props.type === "Paper" &&
        openPromotionInfoModal(e)
      }
    >
      <div className={css(small && styles.small)}>{score}</div>
      {/* {props.promoted !== false && props.type === "Paper" && (
        <span className={css(styles.promotionIcon)}>
          <BoltSvg color={colors.GREEN()} opacity={1} />
        </span>
      )} */}
    </div>
  );
};

const VoteButton = (props) => {
  const { onClick, selected, disabled, horizontalView, right } = props;

  let style = [styles.icon];

  if (selected) {
    style.push(styles.selected);
  }
  if (disabled) {
    style = [styles.iconDisabled];
  }
  if (horizontalView) {
    style.push(styles.horizontalViewButton);
    if (right) {
      style.push(styles.marginRight);
    } else {
      style.push(styles.marginLeft);
    }
  }

  return (
    <a className={css(...style)} onClick={onClick}>
      {props.children}
    </a>
  );
};

const UpvoteButton = (props) => {
  return (
    <VoteButton {...props} right={props.horizontalView}>
      {voteWidgetIcons.upvote}
    </VoteButton>
  );
};

const DownvoteButton = (props) => {
  return <VoteButton {...props}>{voteWidgetIcons.downvote}</VoteButton>;
};

function getScore(props) {
  const { score } = props;
  if (doesNotExist(score)) {
    return 0;
  }
  return score;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    marginRight: 17,
  },
  horizontalView: {
    flexDirection: "row",
    alignItems: "center",
  },
  horizontalViewButton: {
    fontSize: 23,
    "@media only screen and (max-width: 321px)": {
      fontSize: 23,
    },
  },
  pillContainer: {
    background: voteWidgetColors.BACKGROUND,
    color: colors.GREEN(),
    boxSizing: "border-box",
    fontWeight: "bold",
    borderRadius: 24,
    padding: ".2em .5em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 30,
    ":hover": {
      background: "rgba(30, 207, 49, 0.2)",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  promotedPillContainer: {
    cursor: "help",
  },
  small: {
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  promotionIcon: {
    fontSize: 11,
    marginLeft: 3,
  },
  icon: {
    fontSize: 18,
    cursor: "pointer",
    color: voteWidgetColors.ARROW,
    ":hover": {
      color: colors.BLUE(1),
    },
  },
  iconBlue: {
    color: "#eaebfe",
  },
  iconDisabled: {
    color: voteWidgetColors.ARROW,
  },
  coins: {
    fontSize: 10,
  },
  selectedBlue: {
    color: colors.BLUE(),
    // color: colors.GREEN(),
  },
  selected: {
    color: colors.GREEN(),
  },
  marginLeft: {
    marginLeft: 8,
  },
  marginRight: {
    marginRight: 8,
  },
  promotionContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    display: "none",
    cursor: "pointer",
    "@media only screen and (max-width: 767px)": {
      display: "unset",
    },
  },
  marginLeft: {
    marginLeft: 10,
  },
  divider: {
    margin: "5px 0 15px",
    width: "100%",
    border: "1px solid rgba(36, 31, 58, 0.1)",
  },
  scoreContainer: {
    color: "rgba(36, 31, 58, 0.4)",
    fontWeight: "bold",
    fontSize: 14,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  tooltip: {
    maxWidth: 200,
    width: 200,
    padding: 15,
    fontSize: 14,
    // background: colors.BLUE(1),
    background: "rgba(0, 0, 0, 0.7)",
    opacity: 1,
  },
});

export { ScorePill };
export default VoteWidget;
