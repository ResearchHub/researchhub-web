import colors from "~/config/themes/colors";
import Button from "../Form/Button";
import ALink from "../ALink";
import VerifiedBadge from "./VerifiedBadge";
import useCurrentUser from "~/config/hooks/useCurrentUser";

const VerificationFormSuccessStep = ({}) => {
  const currentUser = useCurrentUser();

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
      <VerifiedBadge width={100} height={100} showTooltipOnHover={false} />
      <div style={{ fontSize: 26, fontWeight: 500, marginTop: 20 }}>
        Your account is now verified
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        <ul style={{ marginTop: 40, textAlign: "left" }}>
          <li>
            Your account will be updated to reflect your academic reputation in
            a few minutes.
          </li>
          <li>
            You will be able to view the papers you authored in the{" "}
            <ALink
              theme="solidPrimary"
              href={`/user/${currentUser?.authorProfile.id}/authored-papers`}
            >
              Authored Papers
            </ALink>{" "}
            section.
          </li>
        </ul>
      </div>
      <div style={{ width: 250, marginTop: 75 }}>
        <Button fullWidth onClick={() => (window.location.href = "/")}>
          Back Home
        </Button>
      </div>
    </div>
  );
};

export default VerificationFormSuccessStep;
