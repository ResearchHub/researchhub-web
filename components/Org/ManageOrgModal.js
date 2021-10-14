import { useEffect, useState, Fragment } from "react";
import { fetchOrg } from "~/config/fetch";
import ManageOrgUsers from "./ManageOrgUsers";
import ManageOrgDetails from "./ManageOrgDetails";
import BaseModal from "~/components/Modals/BaseModal";
import { MessageActions } from "~/redux/message";
import { StyleSheet, css } from "aphrodite";
import { isEmpty } from "~/config/utils/nullchecks";
import colors from "~/config/themes/colors";
import Loader from "~/components/Loader/Loader";

const ManageOrgModal = ({ org, closeModal, isOpen = false, onOrgChange }) => {
  const [_org, _setOrg] = useState(org);
  const [showLoader, setShowLoader] = useState(true);
  const [currentUserPerm, setCurrentUserPerm] = useState(
    org?.user_permission?.access_type
  );

  useEffect(() => {
    if (!isEmpty(org)) {
      _setOrg(org);
      setCurrentUserPerm(org?.user_permission?.access_type);
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
            {currentUserPerm === "ADMIN" ? (
              <ManageOrgDetails org={_org} onOrgChange={onOrgChange} />
            ) : (
              <div>
                <span className={css(styles.sectionTitle)}>
                  Organization Name:
                </span>
                <span className={css(styles.content)}>{org.name}</span>
              </div>
            )}
          </div>
          <div className={css(styles.section)}>
            <ManageOrgUsers org={_org} />
          </div>
          {/* <div>
            <div className={css(styles.subheader)}>Danger Zone</div>
            [Placeholder: Remove account]
          </div> */}
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
  sectionTitle: {
    fontWeight: 500,
    marginBottom: 20,
    display: "block",
  },
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

export default ManageOrgModal;
