import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import PropTypes from "prop-types";
import Link from "next/link";

// Components
import AuthorAvatar from "../AuthorAvatar";
import { ClampedText } from "~/components/Typography";
import TextEditor from "~/components/TextEditor"; // QuillTextEditor
import ActivityUserLine from "./ActivityHeader";
import { TimeStamp } from "~/components/Notifications/NotificationHelpers";
import HubTag from "~/components/Hubs/HubTag";

import colors from "~/config/themes/colors";

const ActivityEmptyState = (props) => {
  const authorPlaceholder = {
    author_profile: null,
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.row)}>
        <AuthorAvatar author={authorPlaceholder} />
        {/* < */}
        {"Follow an author to get started!"}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    width: "100%",
    padding: "0 20px 20px 20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ActivityEmptyState;
