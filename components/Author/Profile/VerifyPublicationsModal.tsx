import BaseModal from "~/components/Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import PendingBadge from "~/components/shared/PendingBadge";
import CheckBox from "~/components/Form/CheckBox";
import Button from "~/components/Form/Button";
import { useState } from "react";
import colors from "~/config/themes/colors";

const VerifyPublicationsModal = ({ isOpen, setIsOpen }) => {
  const [isStatement1Checked, setIsStatement1Checked] = useState(false);
  const [isStatement2Checked, setIsStatement2Checked] = useState(false);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        zIndex={1000000001}
        modalContentStyle={styles.modalStyle}
        title={"Verify publications"}
      >
        <div className={css(styles.subtitle)}>
          In order to remove the{" "}
          <div style={{ display: "inline-flex" }}>
            <PendingBadge />
          </div>{" "}
          we will need you to verify the following statements:
        </div>
        <div className={css(styles.statements)}>
          <div
            className={css(styles.statement)}
            onClick={() => setIsStatement1Checked(!isStatement1Checked)}
          >
            {/* @ts-ignore */}
            <CheckBox isSquare small active={isStatement1Checked} />
            <div>
              I assert that I have authored or co-authored every publication
              listed in the publications section.
            </div>
          </div>
          <div
            className={css(styles.statement)}
            onClick={() => setIsStatement2Checked(!isStatement2Checked)}
          >
            {/* @ts-ignore */}
            <CheckBox isSquare small active={isStatement2Checked} />
            <div>
              I understand that including publications that do not belong to me
              can result in a permanent ban.
            </div>
          </div>
          <div>
            <Button
              disabled={!(isStatement1Checked && isStatement2Checked)}
              fullWidth
            >
              Confirm statements
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    width: 500,
    padding: 20,
  },
  subtitle: {
    marginTop: 20,
    color: colors.MEDIUM_GREY(),
  },
  statements: {
    marginTop: 50,
  },
  statement: {
    display: "flex",
    alignItems: "flex-start",
    columnGap: "10px",
    fontSize: 14,
    marginBottom: 20,
    cursor: "pointer",
  },
});

export default VerifyPublicationsModal;
