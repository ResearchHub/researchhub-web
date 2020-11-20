import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { useAlert } from "react-alert";

import Loader from "~/components/Loader/Loader";

// Redux
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import icons from "../../config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { doesNotExist } from "~/config/utils";

const ModeratorPaperSection = ({
  auth,
  label,
  type,
  paper,
  updatePaperState,
  containerStyles,
}) => {
  const alert = useAlert();
  const [moderator, isModerator] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn) {
      if (auth.user.moderator) {
        return isModerator(true);
      }
    }
    moderator && isModerator(false);
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (type === "takeaways") {
      setActive(paper.bullet_low_quality);
    } else if (type === "summary") {
      setActive(paper.summary_low_quality);
    }
  }, [paper]);

  const handleClick = (e) => {
    e && e.stopPropagation();
    alert.show({
      text: active
        ? `Unpin ${type} for improvement?`
        : `Pin ${type} for improvement?`,
      buttonText: "Yes",
      onClick: () => {
        markSection();
      },
    });
  };

  const markSection = () => {
    setLoading(true);

    const paperId = paper.id;
    const PAYLOAD = formatPayload();

    fetch(API.PAPER({ paperId, progress: true }), API.PATCH_CONFIG(PAYLOAD))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        updatePaperState(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const formatPayload = () => {
    const payload = {};
    if (type === "takeaways") {
      payload.bullet_low_quality = !paper.bullet_low_quality;
    } else if (type === "summary") {
      payload.summary_low_quality = !paper.summary_low_quality;
    }
    return payload;
  };

  const renderIcon = () => {
    return loading ? <Loader loading={true} size={5} /> : icons.pin;
  };

  const renderLabel = () => {
    return active ? "Unpin Section" : "Needs Improvement";
  };

  return (
    <div
      className={css(
        styles.container,
        containerStyles && containerStyles,
        !moderator && styles.hide
      )}
      onClick={handleClick}
    >
      <span className={css(styles.icon, active && styles.iconActive)}>
        {renderIcon()}
      </span>
      {renderLabel()}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "20px 20px 0px 0px",
    fontSize: 16,
    cursor: "pointer",
    "@media only screen and (max-width: 450px)": {
      display: "none",
    },
  },
  hide: {
    display: "none",
  },
  icon: {
    fontSize: 14,
    marginRight: 5,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  iconActive: {
    color: colors.BLUE(),
    opacity: 1,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  null
)(ModeratorPaperSection);
