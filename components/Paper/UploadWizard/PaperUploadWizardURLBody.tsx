import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createPaperSubmissioncreatePaperSubmissionWithURL } from "./api/createPaperSubmissionWithURL";
import { css, StyleSheet } from "aphrodite";
import { isStringURL } from "~/config/utils/isStringURL";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import PaperUploadWizardInput from "./shared/PaperUploadWizardInput";

type Props = {
  messageActions: any /* redux */;
  modalActions: any /* redux */;
  onExit: () => void;
  setWizardStep: (step: WizardBodyTypes) => void;
};
type FormErrors = { url: boolean };
type FormValues = { url: string };

function PaperUploadWizardURLBody({
  messageActions,
  modalActions,
  onExit,
  setWizardStep,
}: Props) {
  const [formErrors, setFormErrors] = useState<FormErrors>({ url: false });
  const [formValues, setFormValues] = useState<FormValues>({ url: "" });

  const { url: urlError } = formErrors;
  const { url } = formValues;
  const resetComponent = (): void => {
    setFormErrors({ url: false });
    setFormValues({ url: "" });
  };
  const router = useRouter();

  useEffect(() => {
    return (): void => resetComponent();
  }, []);

  const onSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const WTF = !isStringURL(url);
    const newFormErrors = { url: WTF };
    const hasError = Object.values(newFormErrors).includes(true);

    if (hasError) {
      setFormErrors(newFormErrors);
    } else {
      createPaperSubmissioncreatePaperSubmissionWithURL({
        onError: (error: any): void => {
          const { response } = error;
          switch (response.status) {
            case 403 /* Duplicate error */:
              const { data } = response;
              resetComponent();
              onExit();
              modalActions.openUploadPaperModal(true, [error.message?.data]);
              break;
            default:
              messageActions.setMessage("Please provide valid URL source");
              messageActions.showMessage({ show: true, error: true });
              return;
          }
        },
        onSuccess: (_result: any) => {
          // logical ordering
          resetComponent();
          setWizardStep("standby");
        },
        url,
      });
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ paddingTop: 32 }}>
      <PaperUploadWizardInput
        error={urlError}
        label={
          <div className={css(styles.inputLabel)}>
            <div>
              {"Link to Paper"}
              <span style={{ color: colors.BLUE(1) }}>{" * "}</span>
            </div>
            <div
              className={css(styles.pdfText)}
              onClick={(): void => setWizardStep("pdf_upload")}
            >
              {"Upload a PDF"}
            </div>
          </div>
        }
        onChange={(value: null | string): void =>
          setFormValues({ ...formValues, url: value ?? "" })
        }
        placeholder="Paste a url to source"
        required
        value={url}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 0",
          width: "100%",
        }}
      >
        <Button
          customButtonStyle={verifStyles.buttonSecondary}
          isWhite
          key="upload-wizard-cancel"
          label="Cancel"
          rippleClass={verifStyles.rippleClass}
          size="xxsmall"
          type="button"
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            // logical ordering
            resetComponent();
            setWizardStep("standby");
            onExit();
          }}
        />
        <Button
          customButtonStyle={verifStyles.buttonCustomStyle}
          key="upload-wizard-button"
          label="Import"
          rippleClass={verifStyles.rippleClass}
          size="xxsmall"
          type="submit"
        />
      </div>
    </form>
  );
}

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
});

const styles = StyleSheet.create({
  inputLabel: {
    alignItems: "baseline",
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
  pdfText: {
    color: colors.BLUE(1),
    cursor: "pointer",
    fontSize: 12,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadWizardURLBody);
