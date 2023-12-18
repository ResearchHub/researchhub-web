import { faCircleXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import colors from "~/config/themes/colors";
import Button from "../Form/Button";
import ALink from "../ALink";

const VerificationFormErrorStep = ({ onPrevClick, error }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: 50,
      }}
    >
      <FontAwesomeIcon icon={faCircleXmark} color={colors.RED()} size={"5x"} />
      <div style={{ fontSize: 26, fontWeight: 500, marginTop: 50 }}>
        Could not verify
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        {error?.status === 404 ? (
          <>
            Your Orcid profile was not found. Please ensure that your Orcid
            profile has at least one paper associated with it. Orcid may take a
            few days to accurately reflect changes.
          </>
        ) : (
          <>
            An error occurred while verifying your authorship. Please try a
            different verification method.
          </>
        )}
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        If this error persists, contact us at{" "}
        <ALink theme="solidPrimary" href="mailto:verification@researchhub.com">
          verification@researchhub.com
        </ALink>
        .
      </div>
      <div style={{ width: 250, marginTop: 100 }}>
        <Button fullWidth onClick={onPrevClick}>
          Try again
        </Button>
      </div>
    </div>
  );
};

export default VerificationFormErrorStep;
