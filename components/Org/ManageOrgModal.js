import { useEffect, useState } from "react";
import { fetchOrg } from "~/config/fetch";
import ManageUsers from "./ManageUsers";
import BaseModal from "~/components/Modals/BaseModal";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

const ManageOrgModal = ({ org, currentUser, closeModal, showMessage, setMessage, isOpen = false }) => {
  const [_org, _setOrg] = useState(org);

  useEffect(() => {
    if (!isNullOrUndefined(org) || org?.id !== _org?.id) {
      _setOrg(org);
    }
  }, [org]);

  const modalBody = (
    <div className={css(styles.body)}>
      <ManageUsers org={_org} />  
    </div>
  )

  return (
    <BaseModal
      children={modalBody}
      closeModal={closeModal}
      isOpen={isOpen}
      title={"Manage Organization"}
    />        
  )
}

const styles = StyleSheet.create({
  body: {
    minWidth: 500,
    maxWidth: 800,
    marginTop: 40,
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
})
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageOrgModal);