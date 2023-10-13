import { useEffect } from "react";
import { useLinkedIn } from "react-linkedin-login-oauth2";
// You can use provided image shipped by this package or using your own
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { generateApiUrl } from "~/config/api";

interface Props {
  children: React.ReactElement[];
  onSuccess: Function;
  onFailure: Function;
}

const LinkedInButton = ({ children, onSuccess, onFailure }: Props) => {
  const { linkedInLogin } = useLinkedIn({
    clientId: "86hbgsdaft8hz9",
    scope: "email+profile+openid",
    redirectUri: `${
      typeof window === "object" && window.location.origin
    }/linkedin-login`,
    onSuccess: (code) => {},
    onError: (error) => {},
  });

  useEffect(() => {
    window.addEventListener(
      "message",
      function (event) {
        const jsonData = event.data;

        if (jsonData.provider === "LINKEDIN") {
          onSuccess(jsonData);
        }
      },
      false
    );
  }, []);

  return <div onClick={linkedInLogin}>{children}</div>;
};

export default LinkedInButton;
