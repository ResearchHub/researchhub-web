import { GoogleLogin, GoogleLogout } from "react-google-login";
import { StyleSheet } from "aphrodite";

import Button from "~/components/Form/Button";

const GoogleLoginButton = (props) => {
  const responseGoogle = (response) => {
    let { googleLogin, getUser } = props;
    response["access_token"] = response["accessToken"];
    googleLogin(response).then((_) => {
      getUser().then((_) => {});
    });
  };

  return (
    <GoogleLogin
      clientId={
        "192509748493-amjlt30mbpo9lq5gppn7bfd5c52i0ioe.apps.googleusercontent.com"
      }
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => (
        <Button
          disabled={renderProps.disabled}
          onClick={renderProps.onClick}
          customButtonStyle={styles.button}
          icon={"/static/icons/google.png"}
          customIconStyle={styles.iconStyle}
          label={"Log in with Google"}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    height: 33,
    width: 33,
  },
  button: {
    height: 55,
    width: 230,
    marginTop: 10,
    marginBottom: 0,
  },
});

export default GoogleLoginButton;
