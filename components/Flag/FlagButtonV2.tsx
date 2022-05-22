import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { FLAG_REASON, FLAG_REASON_DESCRIPTION } from "./config/constants";
import { Fragment, ReactElement, useState } from "react";
import { KeyOf } from "~/config/types/root_types";
import { MessageActions } from "~/redux/message";
import ResearchHubRadioChoices, {
  RhRadioInputOption,
} from "../shared/ResearchHubRadioChoices";
import BaseModal from "../Modals/BaseModal";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

type Props = {
  buttonText?: string;
  buttonTextStyle?: any;
  defaultReason?: KeyOf<typeof FLAG_REASON>;
  errorMsgText?: string;
  flagIconOverride?: any;
  iconOverride?: any;
  modalHeaderText: string;
  setMsgRedux: any;
  showMsgRedux: any;
  noButtonBackground?: boolean;
  onSubmit: (
    flagReason: KeyOf<typeof FLAG_REASON>,
    renderErrorMsg: (error: Error) => void,
    renderSuccessMsg: () => void
  ) => void;
  successMsgText?: string;
  subHeaderText?: string;
  primaryButtonLabel?: string;
};

function FlagButtonV2({
  buttonText,
  buttonTextStyle,
  defaultReason = "SPAM",
  errorMsgText,
  flagIconOverride,
  iconOverride,
  setMsgRedux,
  showMsgRedux,
  modalHeaderText,
  onSubmit,
  successMsgText,
  subHeaderText = "I am flagging this content because of:",
  primaryButtonLabel = "Flag content",
}: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [flagReason, setFlagReason] =
    useState<KeyOf<typeof FLAG_REASON>>(defaultReason);
  const formattedInputOptions = Object.keys(FLAG_REASON).filter(k => k !== "NOT_SPECIFIED").map(
    (key: string): RhRadioInputOption => ({
      id: key,
      label: (
        <div className={css(styles.optionLabel)} key={key}>
          {FLAG_REASON[key]}
        </div>
      ),
      description: FLAG_REASON_DESCRIPTION[key],
    })
  );

  const renderErrorMsg = (error: any): void => {
    const errorStatus = error?.response?.status;
    setMsgRedux(
      errorStatus === 409
        ? "You've already flagged this content"
        : errorMsgText ?? "Failed. Flag likely removed alraedy."
    );
    showMsgRedux({ show: true, error: true });
  };
  const renderSuccessMsg = (): void => {
    setMsgRedux(successMsgText ?? "Flagged");
    showMsgRedux({ show: true, error: false });
  };
  const handleSubmit = (): void => {
    setIsModalOpen(false);
    setFlagReason(defaultReason);
    onSubmit(flagReason, renderErrorMsg, renderSuccessMsg);
  };

  return (
    <Fragment>
      <div
        onClick={(): void => setIsModalOpen(!isModalOpen)}
        className={css(styles.flagIcon, flagIconOverride)}
      >
        {iconOverride || icons.flag}
        {buttonText && (
          <span className={css(buttonTextStyle)}>{buttonText}</span>
        )}
      </div>
      <BaseModal
        children={
          <div className={css(customModalStyle.modalBody)}>
            {subHeaderText && (
              <div className={css(customModalStyle.subHeaderText)}>
                {subHeaderText}
              </div>
            )}
            <ResearchHubRadioChoices
              inputOptions={formattedInputOptions}
              onChange={(optionID: string): void => {
                setFlagReason(optionID as KeyOf<typeof FLAG_REASON>);
              }}
              inputWrapStyle={styles.inputWrapStyle}
              labelDescriptionStyle={styles.labelDescriptionStyle}
              selectedID={flagReason}
            />
            <div className={css(styles.buttonWrap)}>
              <Button
                label={primaryButtonLabel}
                size="small"
                onClick={handleSubmit}
              />
              <div
                className={css(styles.cancelButton)}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        }
        closeModal={(): void => setIsModalOpen(false)}
        isOpen={isModalOpen}
        modalStyle={customModalStyle.modalStyle}
        title={modalHeaderText}
        titleStyle={customModalStyle.modalHeaderText}
      />
    </Fragment>
  );
}

const customModalStyle = StyleSheet.create({
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  modalStyle: {
    maxHeight: "95vh",
    width: 500,
    "@mediaonly screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 400,
    marginBottom: 25,
  },
  modalHeaderText: {
    alignItems: "flex-start",
    color: colors.LIGHT_GREY_TEXT,
    display: "flex",
    fontSize: 16,
    justifyContent: "flex-start",
    width: "100%",
  },
  modalContentStyle: {
    overflowY: "visible",
    overflow: "visible",
  },
});

const styles = StyleSheet.create({
  flagButtonWrap: {
    cursor: "pointer",
  },
  flagIcon: {
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
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 13,
      width: 15,
      minWidth: 15,
      maxWidth: 15,
      height: 15,
      minHeight: 15,
      maxHeight: 15,
    },
  },
  inputWrapStyle: {
    marginBottom: 12,
  },
  labelDescriptionStyle: {
    color: colors.BLACK(0.7),
  },
  optionLabel: {
    display: "flex",
    fontSize: 16,
    fontWeight: 500,
  },
  buttonWrap: {
    display: "flex",
    marginTop: 10,
    alignItems: "center",
    paddingTop: 20,
    borderTop: `1px solid ${colors.LIGHT_GREY()}`,
    justifyContent: "center",
  },
  cancelButton: {
    alignItems: "center",
    borderRadius: 4,
    color: colors.TEXT_GREY(1),
    cursor: "pointer",
    display: "flex",
    height: 37,
    justifyContent: "center",
    marginLeft: 16,
    width: 126,
    ":hover": {
      background: colors.LIGHT_GREY_BACKGROUND,
    },
  },
});

const mapStateToProps = ({ auth }) => ({
  userRedux: auth.user,
});

const mapDispatchToProps = {
  setMsgRedux: MessageActions.setMessage,
  showMsgRedux: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(FlagButtonV2);
