import { css, StyleSheet } from "aphrodite";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

import sharedOnboardingStyles from "./sharedOnboardingStyles";
import colors from "~/config/themes/colors";
import FormInput from "~/components/Form/FormInput";
import { MessageActions } from "~/redux/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import UploadFileDragAndDrop from "~/components/UploadFileDragAndDrop";
import { updateUser } from "./api";

type ImportReferencesProps = {
  user: {
    id: number;
  };
};

function ImportReferences({ user }: ImportReferencesProps) {
  const [loading, setLoading] = useState(false);
  const [numEmails, setNumEmails] = useState(3);
  const [emailsToInvite, setEmailsToInvite] = useState({});
  const [inputsHovered, setInputsHovered] = useState({});
  const router = useRouter();

  const emailChange = (id, value) => {
    const emailsToInv = { ...emailsToInvite };
    emailsToInv[id] = value;
    setEmailsToInvite(emailsToInv);
  };

  const fin = async (e) => {
    e.preventDefault();

    await updateUser({
      userID: user.id,
      params: { reference_manager_onboarding_complete: true },
    });

    router.push("/reference-manager");
  };

  const emailInputs = useMemo(() => {
    return (
      <>
        {new Array(numEmails).fill(0).map((_, index) => {
          return (
            <div
              className={css(
                styles.formInputRow,
                inputsHovered[index] && styles.inlineRow
              )}
              onMouseEnter={() => {
                const _inputsHovered = { ...inputsHovered };
                if (index < 3) {
                  return null;
                }
                _inputsHovered[index] = true;
                setInputsHovered(_inputsHovered);
              }}
              onMouseLeave={() => {
                setInputsHovered({});
              }}
            >
              {index > 2 && (
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={() => {
                    setNumEmails(numEmails - 1);
                  }}
                  className={css(
                    styles.removeEmail,
                    inputsHovered[index] && styles.show
                  )}
                />
              )}
              <FormInput
                inputStyle={sharedOnboardingStyles.input}
                containerStyle={styles.input}
                onChange={emailChange}
                id={`email_${index}`}
                placeholder={"Email address"}
                type="email"
              />
            </div>
          );
        })}
      </>
    );
  }, [numEmails, inputsHovered]);

  return (
    <div>
      <h1 className={css(sharedOnboardingStyles.h1)}>Import Your References</h1>
      <p className={css(sharedOnboardingStyles.subtext)}>
        You can import your references from other reference managers <br />
        (use BibTex, JSON, or CSV format)
      </p>
      <UploadFileDragAndDrop />

      <div className={css(sharedOnboardingStyles.spacer)}></div>
      <button
        className={css(sharedOnboardingStyles.continueButton)}
        onClick={fin}
      >
        {loading ? <FontAwesomeIcon icon={faSpinnerThird} spin /> : "Continue"}
      </button>
    </div>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 0,
    minHeight: "unset",
    marginTop: 0,
    // marginLeft: -24,
    // paddingRight: 48,
  },
  miniTitle: {
    fontWeight: 500,
  },
  actionRow: {
    textAlign: "left",
  },
  actionText: {
    marginTop: 16,
    color: colors.NEW_BLUE(),
    cursor: "pointer",
  },
  formInputRow: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,

    // paddingLeft: 24,
  },
  inlineRow: {
    marginLeft: -28,
  },
  removeEmail: {
    // position: "absolute",
    // left: -24,
    // top: "50%",
    color: colors.VOTE_ARRROW,
    padding: 8,
    cursor: "pointer",
    // transform: "translateY(-50%)",
    display: "none",
  },
  show: {
    display: "block",
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportReferences);
