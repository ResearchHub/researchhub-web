import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createPaperSubmissioncreatePaperSubmissionWithURL } from "./api/createPaperSubmissionWithURL";
import { isStringURL } from "~/config/utils/isStringURL";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";
import { SyntheticEvent, useEffect, useState } from "react";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import Button from "~/components/Form/Button";
import PaperUploadWizardInput from "./shared/PaperUploadWizardInput";
import { useRouter } from "next/router";

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
    console.warn("url: ", url);
    const newFormErrors = { url: !isStringURL(url) };
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
              modalActions.openUploadPaperModal(true, [
                {
                  searchResults: [data],
                  isDuplicate: true,
                },
              ]);
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
        label="Link to Paper"
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadWizardURLBody);
