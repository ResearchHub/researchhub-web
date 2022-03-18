import React, { FunctionComponent, useEffect, useState } from 'react';

import { AuthActions } from "../redux/auth";
import { GOOGLE_CLIENT_ID } from "~/config/constants";

// Reference:
// https://gist.github.com/pmckee11/13b1dffbf1d271a782ed7f65480b978f

const googleUrl = 'https://accounts.google.com/gsi/client';

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
  const[client, setClient] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(
    typeof window !== 'undefined' && typeof (window as any).google !== 'undefined'
  );

  function getAuthCode() {  
    let code = client.requestCode();
  }

  useEffect(() => {
    if (scriptLoaded) {
      setClient(
        (window as any).google.accounts.oauth2.initCodeClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/userinfo.email \
                  https://www.googleapis.com/auth/userinfo.profile",
          ux_mode: "popup",
          callback: login
        })
      );
    }
  }, [scriptLoaded]);

  return render({onClick: getAuthCode});
};

export default GoogleLogin;
