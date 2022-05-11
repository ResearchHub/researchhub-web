import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { Fragment, ReactElement, useState } from "react";
import { NullableString } from "~/config/types/root_types";
import ResearchHubRadioChoices, {
  RhRadioInputOption,
} from "./ResearchHubRadioChoices";
import BaseModal from "../Modals/BaseModal";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

type Props = {
  modalHeaderText: string;
  subHeaderText?: string;
};

const FLAG_REASONS = {
  COPYRIGHT: "Copyright Infringement",
  LOW_QUALITY: "Low Quality",
  NOT_CONSTRUCTIVE: "Not Constructive",
  PLAGIARISM: "Plagiarism",
  RUDE_OR_ABUSIVE: "Rude or Abusive",
  SPAM: "Spam",
};

function FlagButtonV2({ modalHeaderText, subHeaderText }: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<NullableString>("SPAM");

  const formattedInputOptions = Object.keys(FLAG_REASONS).map(
    (key: string): RhRadioInputOption => ({
      id: key,
      label: (
        <div className={css(styles.optionLabel)} key={key}>
          {FLAG_REASONS[key]}
        </div>
      ),
    })
  );

  return (
    <Fragment>
      <div
        onClick={(): void => setIsModalOpen(!isModalOpen)}
        className={css(styles.flagIcon)}
      >
        {icons.flag}
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
                setFlagReason(optionID);
              }}
              inputWrapStyle={css(styles.inputWrapStyle)}
              selectedID={flagReason}
            />
            <div className={css(styles.buttonWrap)}>
              <Button label="Flag to report" size="small" />
              <div className={css(styles.cancelButton)}>Cancel</div>
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
    marginBottom: 12,
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
    alignItems: "center",
    display: "flex",
    paddingLeft: 16,
    width: "100%",
    marginBottom: 8,
  },
  optionLabel: {
    display: "flex",
    paddingLeft: 16,
    fontSize: 16,
    fontWeight: 500,
  },
  buttonWrap: {
    display: "flex",
    marginTop: 16,
    alignItems: "center",
  },
  cancelButton: {
    width: 126,
    height: 37,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.TEXT_GREY(1),
    cursor: "pointer",
    border: 10,
    marginLeft: 16,
    ":hover": {
      background: colors.LIGHT_GREY_BACKGROUND,
    },
  },
});

const mapStateToProps = ({ auth }) => ({
  userRedux: auth.user,
});

export default connect(mapStateToProps)(FlagButtonV2);
