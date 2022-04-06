import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createPaperSubmissionWithDOI } from "./api/createPaperSubmissionWithDOI";
import { createPaperSubmissionWithURL } from "./api/createPaperSubmissionWithURL";
import { css, StyleSheet } from "aphrodite";
import { isStringDOI } from "~/config/utils/isStringDOI";
import { isStringURL } from "~/config/utils/isStringURL";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import PaperUploadWizardInput from "./shared/PaperUploadWizardInput";
import Loader from "~/components/Loader/Loader";
import { isString } from "~/config/utils/string";

type Props = {
  messageActions: any /* redux */;
  modalActions: any /* redux */;
  onExit: () => void;
};
type FormErrors = { urlOrDOI: boolean };
type FormValues = { urlOrDOI: string };

function PaperUploadWizardURLBody({
  messageActions,
  modalActions,
  onExit,
}: Props) {
  const { values: uploaderContextValues, setValues: setUploaderContextValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);

  const [formErrors, setFormErrors] = useState<FormErrors>({ urlOrDOI: false });
  const [formValues, setFormValues] = useState<FormValues>({ urlOrDOI: "" });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { urlOrDOI: urlOrDOIError } = formErrors;
  const { urlOrDOI } = formValues;
  const resetComponent = (): void => {
    setFormErrors({ urlOrDOI: false });
    setFormValues({ urlOrDOI: "" });
    setIsSubmitting(false);
  };

  useEffect(() => {
    return (): void => resetComponent();
  }, []);

  const onSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    const isStringUrl = isStringURL(urlOrDOI);
    const isStringDoi = isStringDOI(urlOrDOI);
    setIsSubmitting(true);
    if (!isStringUrl && !isStringDoi) {
      setFormErrors({ urlOrDOI: true });
      setIsSubmitting(false);
      return;
    }
    if (isStringUrl) {
      await createPaperSubmissionWithURL({
        onError: (error: any): void => {
          const { response } = error;
          switch (response?.status) {
            case 403 /* Duplicate error */:
              onExit();
              modalActions.openUploadPaperModal(true, error.message?.data);
              break;
            default:
              messageActions.setMessage("Please provide valid URL source");
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
        url: urlOrDOI,
      });
    } else if (isStringDoi) {
      createPaperSubmissionWithDOI({
        onError: (error: any): void => {
          resetComponent();
          const { response } = error;
          switch (response.status) {
            case 403 /* Duplicate error */:
              const { data } = response;
              onExit();
              modalActions.openUploadPaperModal(true, error.message?.data);
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
        doi: urlOrDOI,
      });
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ paddingTop: 32 }}>
      <PaperUploadWizardInput
        error={urlOrDOIError}
        label={
          <div className={css(styles.inputLabel)}>
            <div>
              {"Enter DOI or a Paper URL"}
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
          setFormValues({ ...formValues, urlOrDOI: value ?? "" })
        }
        required
        value={urlOrDOI}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 0 0",
          width: "100%",
        }}
      >
        <Button
          customButtonStyle={verifStyles.buttonSecondary}
          disabled={isSubmitting}
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
              wizardBodyType: "url_or_doi_upload",
            });
            onExit();
          }}
        />
        <Button
          customButtonStyle={verifStyles.buttonCustomStyle}
          disabled={isSubmitting}
          key="upload-wizard-button"
          label={
            isSubmitting ? <Loader size={8} loading color="#fff" /> : "Import"
          }
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
