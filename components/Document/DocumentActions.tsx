import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/pro-solid-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faPencil } from "@fortawesome/pro-solid-svg-icons";
import { faDownToLine } from "@fortawesome/pro-solid-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import { MessageActions } from "~/redux/message";
import { ReactElement, useState } from "react";
import { RhDocumentType, UnifiedDocument } from "~/config/types/root_types";
import { StyleSheet, css } from "aphrodite";
import ActionButton from "../ActionButton";
import AdminButton from "../Admin/AdminButton";
import censorDocument from "./api/censorDocAPI";
import colors from "~/config/themes/colors";
import FlagButtonV2 from "../Flag/FlagButtonV2";

import PaperPromotionButton from "../Paper/PaperPromotionButton";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import restoreDocument from "./api/restoreDocAPI";
import ReactTooltip from "react-tooltip";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

type Args = {
  currentUser: any;
  handleEdit: Function;
  onDocumentRemove: Function;
  onDocumentRestore: Function;
  openPaperPDFModal?: Function;
  type: RhDocumentType;
  unifiedDocument: UnifiedDocument;
};

function DocumentActions({
  currentUser,
  handleEdit,
  onDocumentRemove,
  onDocumentRestore,
  openPaperPDFModal,
  unifiedDocument,
}: Args): ReactElement<"div"> {
  const isModerator = Boolean(currentUser?.moderator);
  const isHubEditor = Boolean(currentUser?.author_profile?.isHubEditor);
  const isSubmitter = unifiedDocument?.createdBy?.id === currentUser.id;
  const [isRemoved, setIsRemoved] = useState(unifiedDocument.isRemoved);

  let title;
  if (unifiedDocument?.documentType === "paper") {
    title =
      unifiedDocument?.document?.title ?? unifiedDocument?.document?.paperTitle;
  }

  let canEdit = false;
  if (unifiedDocument?.documentType === "paper") {
    canEdit = true;
  } else if (
    (unifiedDocument?.documentType === "post" ||
      unifiedDocument?.documentType === "bounty" ||
      unifiedDocument?.documentType === "question" ||
      unifiedDocument?.documentType === "hypothesis") &&
    isSubmitter
  ) {
    canEdit = true;
  }

  const actionButtons = [
    {
      active: openPaperPDFModal,
      key: "pdf",
      html: (
        <div
          className={css(styles.actionIcon)}
          data-tip={"Download PDF"}
          onClick={() => openPaperPDFModal && openPaperPDFModal(true)}
        >
          {<FontAwesomeIcon icon={faDownToLine}></FontAwesomeIcon>}
        </div>
      ),
    },
    {
      active: canEdit,
      key: "edit",
      tooltip: "Edit",
      html: (
        <PermissionNotificationWrapper
          modalMessage="edit document"
          onClick={handleEdit}
          permissionKey="UpdatePaper"
          loginRequired={true}
          hideRipples={true}
        >
          <div className={css(styles.actionIcon)}>
            {<FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>}
          </div>
        </PermissionNotificationWrapper>
      ),
    },
    {
      active: true,
      key: "support",
      tooltip: `Support ${unifiedDocument?.documentType}`,
      html: (
        <span>
          <PaperPromotionButton
            paper={unifiedDocument.document}
            customStyle={styles.actionIcon}
          />
        </span>
      ),
    },
    {
      active: true,
      key: "flag",
      tooltip: "Flag content",
      html: (
        <span>
          <FlagButtonV2
            modalHeaderText="Flagging"
            flagIconOverride={styles.flagButton}
            onSubmit={(flagReason, renderErrorMsg, renderSuccessMsg) => {
              flagGrmContent({
                contentID: unifiedDocument?.document?.id,
                contentType: unifiedDocument?.documentType,
                flagReason,
                onError: renderErrorMsg,
                onSuccess: renderSuccessMsg,
              });
            }}
          />
        </span>
      ),
    },
    {
      active: isModerator || isSubmitter || isHubEditor,
      key: "remove-restore",
      tooltip: isRemoved ? "Restore Page" : "Remove Page",
      html: (
        <span className={css(styles.actionIcon, styles.moderatorAction)}>
          <ActionButton
            isModerator={true}
            paperId={unifiedDocument?.document?.id}
            restore={isRemoved}
            icon={
              isRemoved ? (
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
              )
            }
            onAction={() => {
              if (isRemoved) {
                restoreDocument({
                  unifiedDocumentId: unifiedDocument.id,
                  onError: emptyFncWithMsg,
                  onSuccess: () => {
                    setIsRemoved(false);
                    onDocumentRestore();
                  },
                });
              } else {
                censorDocument({
                  unifiedDocumentId: unifiedDocument.id,
                  onError: emptyFncWithMsg,
                  onSuccess: (): void => {
                    setIsRemoved(true);
                    onDocumentRemove();
                  },
                });
              }
            }}
            containerStyle={styles.moderatorContainer}
            iconStyle={styles.moderatorIcon}
          />
        </span>
      ),
    },
    {
      active: isModerator,
      key: "admin",
      tooltip: "Admin",
      html: (
        <span className={css(styles.actionIcon, styles.moderatorAction)}>
          <AdminButton unifiedDocumentId={unifiedDocument.id} />
        </span>
      ),
    },
    {
      active: isModerator || isHubEditor,
      key: "remove-from-feed",
      tooltip: "Remove item from Feed",
      html: (
        <span className={css(styles.actionIcon, styles.moderatorAction)}>
          <AdminButton unifiedDocumentId={unifiedDocument.id} />
        </span>
      ),
    },
  ].filter((action) => action.active);

  return (
    <div className={css(styles.documentActions)}>
      {actionButtons.map((actionButton) => (
        <span
          data-tip={actionButton.tooltip}
          data-effect="solid"
          onClick={(event) => {
            ReactTooltip.hide();
          }}
          key={actionButton.key}
          className={css(styles.button)}
        >
          {actionButton.html}
        </span>
      ))}
    </div>
  );
}

const styles = StyleSheet.create({
  documentActions: {
    display: "flex",
  },
  button: {
    marginRight: 8,
    ":last-child": {
      marginRight: 0,
    },
  },
  flagButton: {
    padding: 8,
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
  moderatorIcon: {
    color: colors.RED(0.6),
    fontSize: 18,
    cursor: "pointer",
    ":hover": {
      color: colors.RED(1),
    },
    "@media only screen and (max-width: 415px)": {
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
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      width: 15,
      minWidth: 15,
      maxWidth: 15,
      height: 15,
      minHeight: 15,
      maxHeight: 15,
    },
  },
  actionIcon: {
    padding: 8,
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
      width: 15,
      minWidth: 15,
      maxWidth: 15,
      height: 15,
      minHeight: 15,
      maxHeight: 15,
    },
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth?.user,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentActions);
