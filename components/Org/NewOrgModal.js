import { useState } from "react";
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
  isOpen = false,
}) => {
  const [orgName, setOrgName] = useState("");
  const [flowStep, setFlowStep] = useState("ORG_CREATE");
  const [org, setOrg] = useState(org);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const org = await createOrg({ name: orgName });
      setOrg(org);
      showMessage({ show: true, error: false });
      setFlowStep("INVITE");
    } catch (err) {
      setMessage("Failed to create org. Please try again.");
      showMessage({ show: true, error: true });
    }
  };

  const modalBody = (
    <div className={css(styles.body)}>
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
            rippleClass={styles.buttonWrapper}
          ></Button>
        </form>
      ) : flowStep === "INVITE" ? (
        <ManageOrgUsers org={org} />
      ) : null}
    </div>
  );

  return (
    <BaseModal
      children={modalBody}
      closeModal={closeModal}
      isOpen={isOpen}
      title={flowStep === "ORG_CREATE" ? "Create Organization" : "Invite users"}
    />
  );
};

const styles = StyleSheet.create({
  body: {
    minWidth: 500,
    maxWidth: 800,
    marginTop: 40,
  },
  button: {
    width: "auto",
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    textAlign: "center",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
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
