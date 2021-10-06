import { useEffect, useState, Fragment } from "react";
import { fetchOrg } from "~/config/fetch";
import ManageOrgUsers from "./ManageOrgUsers";
import ManageOrgDetails from "./ManageOrgDetails";
import BaseModal from "~/components/Modals/BaseModal";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { isEmpty } from "~/config/utils/nullchecks";
import colors from "~/config/themes/colors";
import Loader from "~/components/Loader/Loader";

const ManageOrgModal = ({
  org,
  currentUser,
  closeModal,
  isOpen = false,
  onOrgChange,
}) => {
  const [_org, _setOrg] = useState(org);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isEmpty(org)) {
      _setOrg(org);
      setShowLoader(false);
    }
  }, [org]);

  const modalBody = (
    <div className={css(styles.body)}>
      {isEmpty(org) ? (
        <Loader key={"loader"} loading={true} size={25} color={colors.BLUE()} />
      ) : (
        <Fragment>
          <div className={css(styles.section)}>
            <ManageOrgDetails
              org={_org}
              onOrgChange={onOrgChange}
            />
          </div>
          <div className={css(styles.section)}>
            <ManageOrgUsers org={_org} />
          </div>
          <div>
            <div className={css(styles.subheader)}>Danger Zone</div>
            [Placeholder: Remove account]
          </div>
        </Fragment>
      )}
    </div>
  );

  return (
    <BaseModal
      children={modalBody}
      closeModal={closeModal}
      isOpen={isOpen}
      title={"Settings & Members"}
    />
  );
};

const styles = StyleSheet.create({
  body: {
    minWidth: 500,
    maxWidth: 800,
    minHeight: 100,
    marginTop: 40,
  },
  section: {
    marginBottom: 40,
  },
  subheader: {
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 20,
    color: "red",
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrgModal);