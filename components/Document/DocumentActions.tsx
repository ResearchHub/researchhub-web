import { ReactElement } from "react";
import { UnifiedDocument } from "~/config/types/root_types";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import ShareAction from "../ShareAction";
import { StyleSheet, css } from "aphrodite";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import FlagButtonV2 from "../Flag/FlagButtonV2";
import ActionButton from "../ActionButton";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { useRouter } from "next/router";
import icons from "~/config/themes/icons";
import PaperPromotionButton from "../Paper/PaperPromotionButton";
import censorDocument from "./api/CensorDocAPI";
import restoreDocument from "./api/restoreDocAPI";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import colors from "~/config/themes/colors";

type Args = {
  unifiedDocument: UnifiedDocument,
  type: "paper" | "hypothesis" | "post",
}

function DocumentActions({
  unifiedDocument
}: Args): ReactElement<"div">{
  const router = useRouter();
  const currentUser = getCurrentUser();
  const isModerator = Boolean(currentUser?.moderator);
  const isHubEditor = Boolean(currentUser?.author_profile?.is_hub_editor);
  const isSubmitter = unifiedDocument?.createdBy?.id === currentUser.id;

  let title;
  if (unifiedDocument?.documentType === "paper") {
    title = unifiedDocument?.document?.title ?? unifiedDocument?.document?.paperTitle;
  }

  const navigateToEditPaperInfo = (e) => {
    e && e.stopPropagation();
    if (unifiedDocument.documentType === "paper") {
      let href = "/paper/upload/info/[paperId]";
      let as = `/paper/upload/info/${unifiedDocument.document?.id}`;
      router.push(href, as);
    }
  };

  const actionButtons = [
    {
      active: true,
      key: "edit",
      html: (
        <PermissionNotificationWrapper
          modalMessage="edit papers"
          onClick={navigateToEditPaperInfo}
          permissionKey="UpdatePaper"
          loginRequired={true}
          hideRipples={true}
        >
          <div className={css(styles.actionIcon)} data-tip={"Edit Paper"}>
            {icons.pencil}
          </div>
        </PermissionNotificationWrapper>
      ),
    },
    {
      active: true,
      key: "share",
      html: (
        <ShareAction
          /* @ts-ignore */
          addRipples={true}
          title={"Share this paper"}
          subtitle={title}
          url={(process.browser && window.location.href) || null}
          customButton={
            <div className={css(styles.actionIcon)} data-tip={"Share Paper"}>
              {icons.shareAlt}
            </div>
          }
        />
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
          data-tip={unifiedDocument?.document?.isRemoved ? "Restore Page" : "Remove Page"}
        >
          <ActionButton
            isModerator={true}
            paperId={unifiedDocument?.document?.id}
            restore={unifiedDocument?.document?.isRemoved}
            icon={unifiedDocument?.document?.isRemoved ? icons.plus : icons.minus}
            onAction={() => {
              if (unifiedDocument.document?.isRemoved) {
                restoreDocument({
                  unifiedDocumentId: unifiedDocument.id,
                  onError: (error: Error) => {
                    console.log('error')
                  },
                  onSuccess: () => {
                    console.log('success')
                  },
                });
              } else {
                censorDocument({
                  unifiedDocumentId: unifiedDocument.id,
                  onError: (error: Error) => {
                    console.log('error')
                  },
                  onSuccess: (): void => {
                    console.log('success')
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
  ].filter((action) => action.active);

  return (
    <div className={css(styles.documentActions)}>
      {actionButtons.map(actionButton => (
        <span key={actionButton.key}>{actionButton.html}</span>
      ))}
    </div>
  );
}

const styles = StyleSheet.create({
  documentActions: {

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
    padding: 5,
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
})

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(null, mapDispatchToProps)(DocumentActions);