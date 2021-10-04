import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { updateOrgDetails } from "~/config/fetch";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";

const ManageOrgDetails = ({ org, setMessage, showMessage, setCurrentOrganization }) => {

  const [updatedOrg, setUpdatedOrg] = useState(org);
  const [orgName, setOrgName] = useState(org.name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedOrg = await updateOrgDetails({ orgId: org.id, updatedName: orgName });
      setUpdatedOrg(updatedOrg);
      showMessage({ show: true, error: false });

      if (typeof(setCurrentOrganization) === "function") {
        setCurrentOrganization(updatedOrg);
      }
    }
    catch(err) {
      setMessage("Failed to update org.");
      showMessage({ show: true, error: true });
    }
  }


  return (
    <form className={css(styles.form)} onSubmit={(e) => handleSubmit(e)}>
      <FormInput
        label="Organization Name"
        id="org-name-input"
        required={true}
        onChange={(id, val) => setOrgName(val)}
        containerStyle={styles.inputContainer}
        value={orgName}
        inputStyle={styles.inputStyle}
      />
      <Button
        type="submit"
        customButtonStyle={styles.button}
        label="Update Organization"
        rippleClass={styles.buttonWrapper}
        size={"small"}
      >
      </Button>
    </form>    
  )
}

const styles = StyleSheet.create({
  button: {
    width: "auto",
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputContainer: {
    width: "100%"
  },
  buttonWrapper: {
    display: "flex",
  },
  inputStyle: {
    textAlign: "left"
  },
});

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageOrgDetails);