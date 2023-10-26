import { useEffect } from "react";
import { useLinkedIn } from "react-linkedin-login-oauth2";
// You can use provided image shipped by this package or using your own
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { generateApiUrl } from "~/config/api";
import { parseUser } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import { useSelector, useDispatch } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { RootState } from "~/redux";

interface Props {
  children: React.ReactElement;
  onSuccess: Function;
  onFailure: Function;
}

const LinkedInButton = ({ children, onSuccess, onFailure }: Props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

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

  const handleClick = () => {
    if (currentUser) {
      linkedInLogin();
    } else {
      dispatch(ModalActions.openLoginModal(true, `Please sign in first`));
    }
  };

  return (
    <div style={{ width: "100%" }} onClick={handleClick}>
      {children}
    </div>
  );
};

export default LinkedInButton;
