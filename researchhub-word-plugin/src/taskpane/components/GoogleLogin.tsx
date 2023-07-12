// @ts-nocheck
import { FunctionComponent, ReactElement } from "react";

// Reference:
// https://gist.github.com/pmckee11/13b1dffbf1d271a782ed7f65480b978f

export interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleButtonParams {
  onCredentialResponse: (response: GoogleCredentialResponse) => null;
  login: (data: any) => null;
  render: (render: any) => ReactElement;
}

const GOOGLE_CLIENT_ID = "192509748493-5sevdn2gk34kb6i9ehiges3vioui5drm.apps.googleusercontent.com";

const GoogleLogin: FunctionComponent<GoogleButtonParams> = ({ login, render }) => {
  function getAuthCode() {
    const client = (window as any).google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope:
        "https://www.googleapis.com/auth/userinfo.email \
              https://www.googleapis.com/auth/userinfo.profile",
      ux_mode: "popup",
      callback: login,
    });

    client.requestCode();
  }

  return render({ onClick: getAuthCode });
};

export default GoogleLogin;
