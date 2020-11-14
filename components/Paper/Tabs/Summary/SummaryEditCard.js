import { useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { useAlert } from "react-alert";
import moment from "moment";

import AuthorAvatar from "~/components/AuthorAvatar";
import Loader from "~/components/Loader/Loader";
import VoteWidget from "~/components/VoteWidget";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const SummaryEditCard = (props) => {
  const alert = useAlert();

  const [pending, setPending] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { summary, selected, active, onClick, onSetAsMain } = props;
  const { first_name, last_name } = summary.proposedBy.authorProfile;

  const setAsMainSummary = () => {
    setPending(true);
    onSetAsMain &&
      onSetAsMain(() => {
        setPending(false);
        setHovered(false);
      });
  };

  const saveConfirmation = () => {
    setHovered(true);
    alert.show({
      text: "Set this version as the paper's summary?",
      buttonText: "Yes",
      onClick: () => setAsMainSummary(),
    });
  };

  const renderActions = () => {
    const { auth } = props;
    if (auth && auth.isLoggedIn) {
      if (props.auth.user.moderator) {
        return (
          <span
            className={css(styles.icon, active && styles.activeSummary)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={saveConfirmation}
          >
            {pending ? (
              <Loader
                key={`summaryEditLoader-${summary.id}`}
                loading={true}
                size={15}
                color={colors.BLUE()}
              />
            ) : active || hovered ? (
              icons.starFilled
            ) : (
              icons.starEmpty
            )}
          </span>
        );
      }
    } else {
      return (
        <span className={css(styles.icon)}>{active && icons.starFilled}</span>
      );
    }
  };

  return (
    <div
      className={css(styles.editHistoryCard, selected && styles.selectedEdit)}
      onClick={onClick && onClick}
    >
      <div className={css(styles.voteWidgetContainer)}>
        <VoteWidget styles={styles.voteWidget} promoted={false} />
      </div>
      <AuthorAvatar
        author={summary.proposedBy.authorProfile}
        size={30}
        disableLink={true}
        trueSize={true}
      />
      <div className={css(styles.column)}>
        <div className={css(styles.date, active && styles.selected)}>
          {moment(summary.approvedDate).format("MMM Do YYYY, h:mm A")}
        </div>
        <div className={css(styles.user)}>{`${first_name} ${last_name}`}</div>
      </div>
      {renderActions()}
    </div>
  );
};

const styles = StyleSheet.create({
  selectedEdit: {
    background: "#F0F1F7",
    borderColor: "#D7D7E3",
  },
  editHistoryCard: {
    // width: 320,
    boxSizing: "border-box",
    padding: "14px 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    background: "#F9F9FC",
    borderTop: "0.75px solid #F0F1F7",
    borderBottom: "0.75px solid #F0F1F7",
    ":hover": {
      background: "#F0F1F7",
      borderColor: "#D7D7E3",
    },
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  voteWidgetContainer: {
    width: 40,
    marginRight: 10,
  },
  voteWidget: {
    marginRight: 0,
    fontSize: 15,
  },
  column: {
    width: 178,
    marginLeft: 8,
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  date: {
    fontSize: 14,
    fontWeight: 400,
  },
  selected: {
    fontWeight: 500,
  },
  user: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 3,
  },
  icon: {
    color: colors.YELLOW(),
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: 18,
    marginLeft: 10,
  },
  activeSummary: {
    color: colors.YELLOW(1),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryEditCard);
