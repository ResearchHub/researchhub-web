import { FunctionComponent } from 'react';

import { GOOGLE_CLIENT_ID } from "~/config/constants";

// Reference:
// https://gist.github.com/pmckee11/13b1dffbf1d271a782ed7f65480b978f

export interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleButtonParams {
  onCredentialResponse: (response: GoogleCredentialResponse) => void;
  login: (data: any) => void;
  render: (render: any) => void;
}


const GoogleLogin: FunctionComponent<GoogleButtonParams> = ({
  onCredentialResponse,
  login,
  render,
}) => {
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
