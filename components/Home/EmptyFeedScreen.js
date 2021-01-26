import { useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

import Loader from "~/components/Loader/Loader";

import { ModalActions } from "~/redux/modals";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const EmpytFeedScreen = () => {
  return (
    <div className={css(styles.column)} style={{ height: this.state.height }}>
      <img
        className={css(styles.emptyPlaceholderImage)}
        src={"/static/background/homepage-empty-state.png"}
        loading="lazy"
        alt="Empty State Icon"
      />
      <div className={css(styles.text, styles.emptyPlaceholderText)}>
        There are no academic papers uploaded for this hub.
      </div>
      <div className={css(styles.text, styles.emptyPlaceholderSubtitle)}>
        Click ‘Upload paper’ button to upload a PDF
      </div>
      <PermissionNotificationWrapper
        onClick={this.navigateToPaperUploadPage}
        modalMessage="upload a paper"
        loginRequired={true}
        permissionKey="CreatePaper"
      >
        <Button label={"Upload Paper"} hideRipples={true} />
      </PermissionNotificationWrapper>
    </div>
  );
};
