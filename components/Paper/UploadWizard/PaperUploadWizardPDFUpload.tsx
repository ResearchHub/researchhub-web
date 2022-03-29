import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import {
  customStyles,
  formGenericStyles,
} from "../Upload/styles/formGenericStyles";
import { defaultFormState } from "../Upload/types/UploadComponentTypes";
import { Fragment, SyntheticEvent, useState } from "react";
import { ID } from "~/config/types/root_types";
import {
  isEmpty,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import { MessageActions } from "~/redux/message";
import { PaperActions } from "~/redux/paper";
import { uploadNewPaper } from "../Upload/api/uploadNewPaper";
import { useEffectFetchSuggestedHubs } from "../Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import Dropzone from "react-dropzone";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import PaperMetaData from "~/components/SearchSuggestion/PaperMetaData.js";
import Ripples from "react-ripples";

type Props = {
  msgReduxActions: any;
  onExit: () => void;
  paperRedux?: any;
  paperReduxActions?: any;
};

type FormState = {
  doi: string | null;
  title: string | null;
  selectedHubs: any[];
};

function PaperUploadWizardPDFUpload({
  msgReduxActions,
  onExit,
  paperRedux,
  paperReduxActions,
}: Props) {
  const [isFileDragged, setIsFiledDragged] = useState<boolean>(false);
  const [isFileDropped, setIsFileDropped] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [formState, setFormState] = useState<FormState>({
    doi: null,
    title: null,
    selectedHubs: [],
  });
  const router = useRouter();

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const { doi, title, selectedHubs } = formState;
  const { uploadedPaperMeta } = paperRedux ?? {};

  const resetComponent = () => {
    paperReduxActions.removePaperFromState();
    setIsFileDropped(false);
    setIsFileDropped(false);
    setIsSubmitting(false);
    setFormState({
      doi: null,
      title: null,
      selectedHubs: [],
    });
  };

  const handleHubSelection = (_id: ID, selectedHubs: any): void => {
    if (isEmpty(selectedHubs)) {
      setFormState({ ...formState, selectedHubs: [] });
    } else {
      setFormState({ ...formState, selectedHubs });
    }
  };

  const handleFileDrop = async (acceptedFiles) => {
    if (acceptedFiles.length < 1) {
      setIsFileDropped(false);
      return;
    }

    const targetFile = acceptedFiles[0];
    const { name, type, path } = targetFile ?? {};
    const paperMetaData = {
      csl_item: {
        title: name,
        type,
        URL: !isEmpty(path) ? path : undefined,
        name: (name ?? "").split(".pdf")[0],
      },
      isFile: true,
      url_is_pdf: true,
    };

    paperReduxActions.uploadPaperToState(targetFile, paperMetaData);
    setIsFileDropped(true);
  };

  const onFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isNullOrUndefined(uploadedPaperMeta)) {
      return;
    }

    uploadNewPaper({
      onError: (respPayload: any): void => {
        // NOTE: calvinhlee - existing legacy logic
        const errorBody = respPayload.errorBody;
        if (!isNullOrUndefined(errorBody) && errorBody.status === 429) {
          msgReduxActions.showMessage({ show: false });
        } else if (errorBody.status === 413) {
          msgReduxActions.setMessage(
            errorBody
              ? errorBody.error
              : "The max file size is 55mb. Please upload a smaller file."
          );
          msgReduxActions.showMessage({ show: true, error: true });
          setTimeout(() => msgReduxActions.showMessage({ show: false }), 2000);
        } else {
          msgReduxActions.setMessage(
            errorBody ? errorBody.error : "You are not allowed to upload papers"
          );
          msgReduxActions.showMessage({ show: true, error: true });
          setTimeout(() => msgReduxActions.showMessage({ show: false }), 2000);
        }
      },
      onSuccess: ({ paperID, paperName }): void => {
        paperReduxActions.resetPaperState();
        resetComponent();
        onExit();
        router.push(
          "/paper/[paperId]/[paperName]",
          `/paper/${paperID}/${paperName}`
        );
      },
      paperActions: paperReduxActions,
      paperRedux,
      payload: {
        ...defaultFormState,
        ...formState,
        paper_title: nullthrows(title),
        title: nullthrows(title),
      },
    });
  };

  return (
    <form onSubmit={onFormSubmit}>
      {isFileDropped ? (
        <PaperMetaData
          metaData={uploadedPaperMeta}
          onRemove={(): void => {
            setIsFileDropped(false);
            paperReduxActions.removePaperFromState();
          }}
          onEdit
        />
      ) : (
        <Ripples className={css(styles.dropzoneContainer)}>
          <Dropzone
            accept="application/pdf"
            multiple={false}
            onDragEnter={(): void => setIsFiledDragged(true)}
            onDragLeave={(): void => setIsFiledDragged(false)}
            onDrop={handleFileDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <section className={css(styles.fullCanvas)}>
                <div
                  {...getRootProps()}
                  className={css(
                    styles.dropzone,
                    isFileDragged && styles.dragged
                  )}
                >
                  <input {...getInputProps()} required={true} />
                  <Fragment>
                    <img
                      className={css(styles.uploadImage)}
                      src={"/static/background/homepage-empty-state.png"}
                      alt="Drag N Drop Icon"
                    />
                    <div className={css(styles.instructions)}>
                      {"Drag & drop \n"}
                      <span className={css(styles.subtext)}>
                        {"your file here, or "}
                        <span className={css(styles.browse)} id={"browse"}>
                          {"browse"}
                        </span>
                      </span>
                    </div>
                  </Fragment>
                </div>
              </section>
            )}
          </Dropzone>
        </Ripples>
      )}
      <FormInput
        containerStyle={formGenericStyles.container}
        disabled={isSubmitting}
        id="title"
        label="Editorialized Title"
        labelStyle={formGenericStyles.labelStyle}
        onChange={(_id: ID, title: string): void =>
          setFormState({ ...formState, title: isEmpty(title) ? null : title })
        }
        placeholder="Jargon free version of the title that the average person would understand"
        required
        value={title}
      />
      <FormInput
        containerStyle={formGenericStyles.container}
        disabled={isSubmitting}
        id="doi"
        label="DOI"
        labelStyle={formGenericStyles.labelStyle}
        onChange={(_id: ID, doi: string): void =>
          setFormState({ ...formState, doi: isEmpty(doi) ? null : doi })
        }
        placeholder="DOI"
        required
        value={doi}
      />
      <FormSelect
        containerStyle={formGenericStyles.container}
        disabled={isSubmitting}
        id="hubs"
        isMulti
        label={
          <div>
            {"Hubs"}
            <span style={{ color: colors.BLUE(1) }}>{"* "}</span>
          </div>
        }
        inputStyle={
          (customStyles.input,
          selectedHubs.length > 0 && customStyles.capitalize)
        }
        labelStyle={formGenericStyles.labelStyle}
        onChange={handleHubSelection}
        options={suggestedHubs}
        placeholder="Search Hubs"
        required
        value={selectedHubs}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 0",
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
            onExit();
          }}
        />
        <Button
          customButtonStyle={verifStyles.buttonCustomStyle}
          disabled={isSubmitting}
          key="upload-wizard-button"
          label={
            !isSubmitting ? "Upload" : <Loader size={8} loading color="#fff" />
          }
          rippleClass={verifStyles.rippleClass}
          size="xxsmall"
          type="submit"
        />
      </div>
    </form>
  );
}

const styles = StyleSheet.create({
  dragged: {
    padding: "40px 0",
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px 0px",
    transition: "all ease-out 0.1s",
  },
  dropzoneContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    backgroundColor: "#F7F7FB",
    cursor: "pointer",
    borderRadius: 3,
    border: `1px dashed ${colors.BLUE()}`,
    outline: "none",
    ":hover": {
      borderStyle: "solid",
    },
    ":hover #browse": {
      textDecoration: "underline",
    },
  },
  uploadImage: {
    height: 80,
    paddingBottom: 10,
  },
  fullCanvas: {
    height: "100%",
    width: "100%",
  },
  instructions: {
    fontSize: 18,
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
  subtext: {
    color: "#757575",
    fontSize: 14,
    marginTop: 15,
  },
  browse: {
    color: colors.BLUE(),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  paperRedux: state.paper,
});

const mapDispatchToProps = (dispatch) => ({
  paperReduxActions: bindActionCreators(PaperActions, dispatch),
  msgReduxActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadWizardPDFUpload);
