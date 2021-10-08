import { useState } from "react";
import Link from "next/link";
import BaseModal from "~/components/Modals/BaseModal";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { createOrg } from "~/config/fetch";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import ManageOrgUsers from "./ManageOrgUsers";

const NewOrgModal = ({
  closeModal,
  showMessage,
  setMessage,
  onOrgChange,
  isOpen = false,
}) => {
  const [orgName, setOrgName] = useState("");
  const [flowStep, setFlowStep] = useState("ORG_CREATE");
  const [org, setOrg] = useState(null);

  const handleCloseModal = () => {
    setFlowStep("ORG_CREATE");
    setOrg(null);
    setOrgName("");
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let org;
    try {
      org = await createOrg({ name: orgName });
      setOrg(org);
      setFlowStep("INVITE");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create org. Please try again.");
      showMessage({ show: true, error: true });
    }

    onOrgChange(org, "CREATE");
  };

  const modalBody = (
    <div
      className={css(
        styles.body,
        flowStep === "INVITE" && styles.bodyForInvite
      )}
    >
      {flowStep === "ORG_CREATE" ? (
        <form className={css(styles.form)} onSubmit={(e) => handleSubmit(e)}>
          <FormInput
            label="Organization Name"
            id="org-name-input"
            required={true}
            onChange={(id, val) => setOrgName(val)}
            containerStyle={null}
            value={orgName}
            inputStyle={styles.inputStyle}
          />
          <Button
            type="submit"
            customButtonStyle={styles.button}
            label="Create Organization"
            rippleClass={styles.buttonContainer}
          ></Button>
        </form>
      ) : flowStep === "INVITE" ? (
        <div>
          <p className={css(styles.text)}>
            Invite users to join{" "}
            <Link href={`/${org.slug}/notebook`}>
              <a target="_blank" className={styles.link}>
                {org.name}
              </a>
            </Link>{" "}
            organization.
          </p>
          <div className={css(styles.manageUsersContainer)}>
            <ManageOrgUsers org={org} />
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <BaseModal
      children={modalBody}
      closeModal={handleCloseModal}
      isOpen={isOpen}
      title={
        flowStep === "ORG_CREATE" ? "Set up a new organization" : "Invite Users"
      }
    />
  );
};

const styles = StyleSheet.create({
  body: {
    minWidth: 500,
    maxWidth: 800,
    marginTop: 40,
  },
  bodyForInvite: {
    marginTop: 20,
  },
  text: {
    textAlign: "center",
  },
  button: {
    width: "auto",
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  manageUsersContainer: {
    marginTop: 40,
  },
  inputStyle: {
    textAlign: "left",
  },
});

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewOrgModal);
