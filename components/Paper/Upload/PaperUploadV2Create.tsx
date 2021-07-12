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
    paperActions.resresetPaperState();
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

  useEffectFetchSuggestedHubs({ setSuggestedHubs });
  useEffectHandleInit({ paperActions, paperRedux, uploadPaperTitle });

  return <Fragment>Hi this is Create</Fragment>;
}

const mapStateToProps = (state) => ({
  modalsRedux: state.modals,
  paperRedux: state.paper,
  authRedux: state.auth,
  messageRedux: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperuploadV2Create);
