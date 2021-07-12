import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { useEffectFetchSuggestedHubs } from "./api/useEffectGetSuggestedHubs";
import { AuthActions } from "../../../redux/auth";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MessageActions } from "../../../redux/message";
import { ModalActions } from "../../../redux/modals";
import { PaperActions } from "../../../redux/paper";
import {
  ComponentState,
  defaultComponentState,
  defaultFormErrorState,
  defaultFormState,
  FormErrorState,
  FormState,
} from "./types/UploadComponentTypes";

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
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);
  const [componentState, setComponentState] = useState<ComponentState>(
    defaultComponentState
  );

  useEffectHandleInit({ paperActions, paperRedux, uploadPaperTitle });
  useEffectFetchSuggestedHubs({ setSuggestedHubs });

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
            handleDrop={this.uploadPaper}
            onDrop={null}
            onValidUrl={() => this.setState({ disabled: false })}
            toggleFormatState={() => {
              this.setState({
                urlView: !componentState.isURLView,
              });
            }}
            onDuplicate={() => this.setState({ disabled: true })}
          />
        </div>
      </div>
    </Fragment>
  );
}

const styles = StyleSheet.create({
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
