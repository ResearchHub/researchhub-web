import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import {
  customStyles,
  formGenericStyles,
} from "../Upload/styles/formGenericStyles";
import { Fragment, useState } from "react";
import { ID } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import { PaperActions } from "~/redux/paper";
import { useEffectFetchSuggestedHubs } from "../Upload/api/useEffectGetSuggestedHubs";
import colors from "~/config/themes/colors";
import Dropzone from "react-dropzone";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import PaperMetaData from "~/components/SearchSuggestion/PaperMetaData.js";
import Ripples from "react-ripples";

type Props = {
  paperRedux?: any;
  paperReduxActions?: any;
};

type FormState = {
  doi: string | null;
  title: string | null;
  selectedHubs: any[];
};

function PaperUploadWizardPDFUpload({ paperRedux, paperReduxActions }: Props) {
  const [isFileDragged, setIsFiledDragged] = useState<boolean>(false);
  const [isFileDropped, setIsFileDropped] = useState<boolean>(false);
  const [isFileLoading, setIsFiledLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [formState, setFormState] = useState<FormState>({
    doi: null,
    title: null,
    selectedHubs: [],
  });
  const { doi, title, selectedHubs } = formState;

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const { uploadedPaperMeta } = paperRedux ?? {};

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

  return (
    <form>
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
                  {isFileLoading ? (
                    <Loader loading={true} size={28} />
                  ) : (
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
                  )}
                </div>
              </section>
            )}
          </Dropzone>
        </Ripples>
      )}
      <FormSelect
        containerStyle={formGenericStyles.container}
        disabled={isSubmitting}
        // error={formErrors.selectedHubs}
        id="hubs"
        isMulti
        label="Hubs"
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
  paperRedux: state.paper,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  paperReduxActions: bindActionCreators(PaperActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadWizardPDFUpload);
