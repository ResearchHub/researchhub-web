import colors from "~/config/themes/colors";
import Button from "../Form/Button";
import { faEnvelopeCircleCheck } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VerificationFormEmailSentStep = ({ onClose }: { onClose: Function }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: 15,
      }}
    >
      <FontAwesomeIcon
        icon={faEnvelopeCircleCheck}
        color={colors.NEW_BLUE()}
        size={"5x"}
      />
      <div style={{ fontSize: 26, fontWeight: 500, marginTop: 20 }}>
        Check your email
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        <p>
          Visit your inbox click the link to verify ownership of the email
          address provided.
        </p>
      </div>
      <div style={{ width: 200, marginTop: 50 }}>
        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default VerificationFormEmailSentStep;
