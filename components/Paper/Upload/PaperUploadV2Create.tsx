import { AuthActions } from "../../../redux/auth";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  ComponentState,
  defaultComponentState,
  defaultFormErrorState,
  defaultFormState,
  FormErrorState,
  FormState,
} from "./types/UploadComponentTypes";
import { css, StyleSheet } from "aphrodite";
import { MessageActions } from "../../../redux/message";
import { ModalActions } from "../../../redux/modals";
import { PaperActions } from "../../../redux/paper";
import { useEffectFetchSuggestedHubs } from "./api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import FormDND from "../../Form/FormDND";
import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import colors from "../../../config/themes/colors";

type Props = {
  paperActions: any;
  paperRedux: any;
};

const useEffectHandleInit = ({
  paperActions,
  paperRedux,
  uploadPaperTitle,
}): void => {
  useEffect(() => {
    paperActions.resetPaperState();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }, [
    paperActions,
    uploadPaperTitle,
    paperRedux,
    paperRedux.uploadedPaper /* intentional explicit check */,
  ]);
};

function PaperuploadV2Create({
  paperActions,
  paperRedux,
}: Props): ReactElement<typeof Fragment> {
  const router = useRouter();
  const { uploadPaperTitle } = router.query;
  const [componentState, setComponentState] = useState<ComponentState>(
    defaultComponentState
  );
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const [formErrors, setFormErrors] = useState<FormErrorState>(
    defaultFormErrorState
  );
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);

  useEffectHandleInit({ paperActions, paperRedux, uploadPaperTitle });
  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const handlePDFUpload = useCallback((acceptedFiles, metaData): void => {
    // NOTE: calvinhlee - currently supporting only 1 upload
    paperActions.uploadPaperToState(acceptedFiles[0], metaData);
    setComponentState({
      ...componentState,
      isFormEdited: true,
      isFormDisabled: false,
    });
    setFormErrors({ ...formErrors, dnd: false });
  }, []);

  return (
    <Fragment>
      <div className={css(styles.header, styles.text)}>
        {"Add Paper"}
        <a
          className={css(styles.authorGuidelines)}
          href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
          target="_blank"
          rel="noreferrer noopener"
        >
          {"Submission Guidelines"}
        </a>
        <div className={css(styles.sidenote, styles.text)}>
          {"Up to 15MB (.pdf)"}
        </div>
      </div>
      <div className={css(styles.section)}>
        <div className={css(styles.paper)}>
          <div className={css(styles.label, styles.labelStyle)}>
            {componentState.isURLView ? `Link to Paper` : "Paper PDF"}
            <span className={css(styles.asterick)}>*</span>
          </div>
          <FormDND
            handleDrop={handlePDFUpload}
            onDrop={null}
            onDuplicate={(): void =>
              setComponentState({ ...componentState, isFormDisabled: true })
            }
            onValidUrl={(): void =>
              setComponentState({ ...componentState, isFormDisabled: false })
            }
            toggleFormatState={(): void => {
              setComponentState({
                ...componentState,
                isURLView: !componentState.isURLView,
              });
            }}
          />
        </div>
      </div>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  asterick: {
    color: colors.BLUE(1),
  },
  authorGuidelines: {
    fontSize: 14,
    letterSpacing: 0.3,
    textDecoration: "none",
    "@media only screen and (max-width: 665px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 10,
    },
  },
  header: {
    fontSize: 22,
    fontWeight: 500,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottom: `1px solid #EBEBEB`,
    "@media only screen and (max-width: 665px)": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
      paddingLeft: 9,
      paddingRight: 9,
      width: "calc(100% - 18px)",
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 14,
    },
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
  },
  labelStyle: {
    "@media only screen and (max-width: 665px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  paper: {
    width: 601,
    marginTop: 15,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  section: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  sidenote: {
    fontSize: 14,
    fontWeight: 400,
    color: "#7a7887",
    userSelect: "none",
    cursor: "default",
    display: "flex",
    alignItems: "flex-end",
    "@media only screen and (max-width: 665px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 10,
    },
  },
  text: {
    fontFamily: "Roboto",
  },
});

const mapStateToProps = (state: any) => ({
  modalsRedux: state.modals,
  paperRedux: state.paper,
  authRedux: state.auth,
  messageRedux: state.auth,
});

const mapDispatchToProps = (dispatch: any) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperuploadV2Create);
