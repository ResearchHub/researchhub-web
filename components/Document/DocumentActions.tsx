import { ReactElement, useEffect, useState } from "react";
import { UnifiedDocument } from "~/config/types/root_types";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import { StyleSheet, css } from "aphrodite";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import FlagButtonV2 from "../Flag/FlagButtonV2";
import ActionButton from "../ActionButton";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { useRouter } from "next/router";
import icons from "~/config/themes/icons";
import PaperPromotionButton from "../Paper/PaperPromotionButton";
import restoreDocument from "./api/restoreDocAPI";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import colors from "~/config/themes/colors";
import censorDocument from "./api/censorDocAPI";
import AdminButton from "../Admin/AdminButton";
import { breakpoints } from "~/config/themes/screen";


type Args = {
  unifiedDocument: UnifiedDocument,
  type: "paper" | "hypothesis" | "post",
  onDocumentRemove: Function,
  onDocumentRestore: Function,  
  handleEdit: Function,  
}

function DocumentActions({
  unifiedDocument,
  onDocumentRemove,
  onDocumentRestore,
  handleEdit,
}: Args): ReactElement<"div">{
  const router = useRouter();
  const currentUser = getCurrentUser();
  const isModerator = Boolean(currentUser?.moderator);
  const isHubEditor = Boolean(currentUser?.author_profile?.is_hub_editor);
  const isSubmitter = unifiedDocument?.createdBy?.id === currentUser.id;
  const [isRemoved, setIsRemoved] = useState(unifiedDocument.isRemoved);


  let title;
  if (unifiedDocument?.documentType === "paper") {
    title = unifiedDocument?.document?.title ?? unifiedDocument?.document?.paperTitle;
  }

  const actionButtons = [
    {
      active: true,
      key: "edit",
      html: (
        <PermissionNotificationWrapper
          modalMessage="edit document"
          onClick={handleEdit}
          permissionKey="UpdatePaper"
          loginRequired={true}
          hideRipples={true}
        >
          <div className={css(styles.actionIcon)} data-tip={"Edit"}>
            {icons.pencil}
          </div>
        </PermissionNotificationWrapper>
      ),
    },
    {
      active: true,
      key: "support",
      html: (
        <span data-tip={"Support Paper"}>
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
      html: (
        <span data-tip={"Flag Paper"}>
          <FlagButtonV2
            modalHeaderText="Flagging"
            flagIconOverride={styles.flagButton}
            onSubmit={(flagReason, renderErrorMsg, renderSuccessMsg) => {
              flagGrmContent({
                contentID: unifiedDocument?.document?.id,
                contentType: unifiedDocument.documentType,
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
      html: (
        <span
          className={css(styles.actionIcon, styles.moderatorAction)}
          data-tip={isRemoved ? "Restore Page" : "Remove Page"}
        >
          <ActionButton
            isModerator={true}
            paperId={unifiedDocument?.document?.id}
            restore={isRemoved}
            icon={isRemoved ? icons.plus : icons.minus}
            onAction={() => {
              if (isRemoved) {
                restoreDocument({
                  unifiedDocumentId: unifiedDocument.id,
                  onError: (error: Error) => {
                    console.log('error')
                  },
                  onSuccess: () => {
                    setIsRemoved(false);
                    onDocumentRestore();
                  },
                });
              } else {
                censorDocument({
                  unifiedDocumentId: unifiedDocument.id,
                  onError: (error: Error) => {
                    console.log('error')
                  },
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
      key: 'admin',
      html: (
        <span
          className={css(styles.actionIcon, styles.moderatorAction)}
          data-tip="Admin"
        >
          <AdminButton unifiedDocumentId={unifiedDocument.id} />
        </span>
      ),
    },    
  ].filter((action) => action.active);

  return (
    <div className={css(styles.documentActions)}>
      {actionButtons.map(actionButton => (
        <span key={actionButton.key} className={css(styles.button)}>{actionButton.html}</span>
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
    }
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
})

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(null, mapDispatchToProps)(DocumentActions);