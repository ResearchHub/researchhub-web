import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createPaperSubmissionWithDOI } from "./api/createPaperSubmissionWithDOI";
import { css, StyleSheet } from "aphrodite";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import PaperUploadWizardInput from "./shared/PaperUploadWizardInput";
import { isString } from "~/config/utils/string";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";

type Props = {
  messageActions: any /* redux */;
  modalActions: any /* redux */;
  onExit: () => void;
};
type FormErrors = { doi: boolean };
type FormValues = { doi: string };

function PaperUploadWizardDOIBody({
  messageActions,
  modalActions,
  onExit,
}: Props) {
  const { values: uploaderContextValues, setValues: setUploaderContextValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);

  const [formErrors, setFormErrors] = useState<FormErrors>({ doi: false });
  const [formValues, setFormValues] = useState<FormValues>({ doi: "" });

  const { doi: doiError } = formErrors;
  const { doi } = formValues;
  const resetComponent = (): void => {
    setFormErrors({ doi: false });
    setFormValues({ doi: "" });
  };

  useEffect(() => {
    return (): void => resetComponent();
  }, []);

  const onSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();

    const newFormErrors = { ...formErrors, doi: !isString(doi) };
    const hasError = Object.values(newFormErrors).includes(true);
    resetComponent(); /* intentional reset before execution */

    if (hasError) {
      setFormErrors(newFormErrors);
    } else {
      createPaperSubmissionWithDOI({
        onError: (error: any): void => {
          resetComponent();
          const { response } = error;
          switch (response.status) {
            case 403 /* Duplicate error */:
              const { data } = response;
              onExit();
              modalActions.openUploadPaperModal(true, [error.message?.data]);
              break;
            default:
              messageActions.setMessage("Please provide valid doi source");
              messageActions.showMessage({ show: true, error: true });
              return;
          }
        },
        onSuccess: (result: any) => {
          // logical ordering
          resetComponent();
          setUploaderContextValues({
            ...uploaderContextValues,
            submissionID: result?.id,
            wizardBodyType: "standby",
          });
        },
        doi,
      });
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ paddingTop: 32 }}>
      <PaperUploadWizardInput
        error={doiError}
        label={
          <div className={css(styles.inputLabel)}>
            <div>
              {"DOI"}
              <span style={{ color: colors.BLUE(1) }}>{" * "}</span>
            </div>
            <div
              className={css(styles.pdfText)}
              onClick={(): void =>
                setUploaderContextValues({
                  ...uploaderContextValues,
                  wizardBodyType: "pdf_upload",
                })
              }
            >
              {"Upload a PDF"}
            </div>
          </div>
        }
        onChange={(value: null | string): void =>
          setFormValues({ ...formValues, doi: value ?? "" })
        }
        placeholder="Paste a doi to source"
        required
        value={doi}
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
            setUploaderContextValues({
              ...uploaderContextValues,
              doi,
              isWithDOI: true,
              wizardBodyType: "standby",
            });
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
)(PaperUploadWizardDOIBody);
