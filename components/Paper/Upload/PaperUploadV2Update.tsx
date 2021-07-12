import { addNewUser } from "./api/authorModalAddNewUser";
import { AuthActions } from "../../../redux/auth";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { MessageActions } from "../../../redux/message";
import { ModalActions } from "../../../redux/modals";
import { PaperActions } from "../../../redux/paper";
import AddAuthorModal from "../../Modals/AddAuthorModal";
import React, { Fragment, ReactElement, useEffect } from "react";

type Props = {
  modals: any;
};

function PaperUploadV2Update({ modals }: Props) {
  return (
    <div>
      <AddAuthorModal
        isOpen={modals.openAddAuthorModal}
        addNewUser={addNewUser}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  modals: state.modals,
  paper: state.paper,
  auth: state.auth,
  message: state.auth,
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
)(PaperUploadV2Update);
