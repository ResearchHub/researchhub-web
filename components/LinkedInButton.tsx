import { useLinkedIn } from "react-linkedin-login-oauth2";
// You can use provided image shipped by this package or using your own
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { generateApiUrl } from "~/config/api";

const LinkedInButton = () => {
  const { linkedInLogin } = useLinkedIn({
    clientId: "86hbgsdaft8hz9",
    scope: "email+profile+openid",
    redirectUri: `${
      typeof window === "object" && window.location.origin
    }/linkedin-login`,
    onSuccess: (code) => {},
    onError: (error) => {
      if (error.error !== "user_closed_popup") {
        console.log(error);
      }
    },
  });

  return (
    <img
      onClick={linkedInLogin}
      src={linkedin.src}
      alt="Sign in with Linked In"
      style={{ maxWidth: "180px", cursor: "pointer" }}
    />
  );
};

export default LinkedInButton;
