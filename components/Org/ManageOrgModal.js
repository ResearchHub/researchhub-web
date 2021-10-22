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
import OrgAvatar from "~/components/Org/OrgAvatar";
import { breakpoints } from "~/config/themes/screen";

const ManageOrgModal = ({ org, closeModal, isOpen = false, onOrgChange }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [currentUserPerm, setCurrentUserPerm] = useState(
    org?.user_permission?.access_type
  );

  useEffect(() => {
    if (!isEmpty(org)) {
      setCurrentUserPerm(org?.user_permission?.access_type);
      setShowLoader(false);
    }
  }, [org]);

  const modalBody = (
    <div className={css(styles.body)}>
      {showLoader ? (
        <Loader key={"loader"} loading={true} size={25} color={colors.BLUE()} />
      ) : (
        <Fragment>
          <div className={css(styles.section)}>
            {currentUserPerm === "ADMIN" ? (
              <ManageOrgDetails org={org} onOrgChange={onOrgChange} />
            ) : (
              <div className={css(styles.mainDetails)}>
                <div>
                  <span className={css(styles.sectionTitle)}>
                    Organization Name:
                  </span>
                  <span className={css(styles.content)}>{org.name}</span>
                </div>
                <div className={css(styles.avatarWrapper)}>
                  <OrgAvatar org={org} size={80} fontSize={24} />
                </div>
              </div>
            )}
          </div>
          <div>
            <ManageOrgUsers org={org} />
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
  mainDetails: {
    display: "flex",
  },
  avatarWrapper: {
    marginLeft: "auto",
    marginTop: -10,
  },
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      minWidth: "unset",
      width: "100%",
      boxSizing: "border-box",
      padding: 15,
    },
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
