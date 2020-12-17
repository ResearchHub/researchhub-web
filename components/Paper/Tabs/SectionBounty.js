import React, { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import numeral from "numeral";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { getSummaryText } from "~/config/utils";

const SectionBounty = (props) => {
  const { section, paper, bullets, updatePaperState, loading, auth } = props;
  const isModerator = auth.isLoggedIn && auth.user && auth.user.moderator;
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!loading) {
      setAmount(configureBounty());
    }
  }, [props.loading, props.paper]);

  function configureBounty() {
    const summary = paper.summary && getSummaryText(paper.summary);
    const needSummary = !summary;
    const needTakeaways =
      bullets.bullets.filter((bullet) => !bullet.is_removed).length < 3;

    let bounty =
      section === "summary"
        ? props.paper.summary_low_quality
        : props.paper.bullet_low_quality;

    if (!bounty) {
      if (section === "summary" && needSummary) {
        bounty = 5; // default reward for first summary
      } else if (section === "takeaways" && needTakeaways) {
        bounty = 1; // default reward for first keytakeaway
      }
    }

    return numeral(bounty).format("0a");
  }

  const handleClick = () => {
    if (!isModerator) return;

    props.openSectionBountyModal(true, {
      type: section,
      paper,
      updatePaperState,
    });
  };

  const renderLabel = () => {
    return (
      <Fragment>
        Earn{" " + amount + " "}
        {icons.coinStack({ styles: styles.coinStackIcon })}
      </Fragment>
    );
  };

  const formatToolTip = () => {
    const sectionName = {
      takeaways: "Key Takeaways",
      summary: "Summary",
    };

    if (isModerator) {
      return `Set bounty for ${sectionName[section]}`;
    }
    return `Earn ${amount} RSC for contributing to the ${sectionName[section]}`;
  };

  return (
    <Fragment>
      <ReactTooltip />
      <div
        className={css(
          styles.container,
          isModerator && styles.moderatorContainer,
          amount == 0 && styles.hidden,
          loading && styles.hidden
        )}
        data-tip={formatToolTip()}
        onClick={handleClick}
      >
        {renderLabel()}
      </div>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 12px",
    fontSize: 14,
    fontWeight: 500,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: colors.ORANGE(0.1),
    color: colors.ORANGE(),
    marginLeft: 10,
    cursor: "default",
  },
  moderatorContainer: {
    cursor: "pointer",
    ":hover": {
      boxShadow: `0px 0px 2px ${colors.ORANGE()}`,
    },
  },
  hidden: {
    display: "none",
  },
  coinStackIcon: {
    marginLeft: 4,
    height: 12,
    width: 12,
  },
  placeholder: {
    width: 80,
    height: 24,
    margin: 0,
    marginLeft: 10,
    marginRight: 8,
    borderRadius: 4,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  bullets: state.bullets,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openSectionBountyModal: ModalActions.openSectionBountyModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionBounty);
