import React, { FunctionComponent, useEffect, useState } from 'react';
import { Helmet, HelmetProvider, HelmetTags } from 'react-helmet-async';

import { AuthActions } from "../redux/auth";
import { GOOGLE_CLIENT_ID } from "~/config/constants";

const googleUrl = 'https://accounts.google.com/gsi/client';

export interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleButtonParams {
  onCredentialResponse: (response: GoogleCredentialResponse) => void;
  login: (data: any) => void;
}


const GoogleButton: FunctionComponent<GoogleButtonParams> = ({
  onCredentialResponse,
  login
}) => {
  const[client, setClient] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(
    typeof window !== 'undefined' && typeof (window as any).google !== 'undefined'
  );
  const divRef = React.createRef<HTMLDivElement>();

  // Helmet does not support the onLoad property of the script tag, so we have to manually add it like so
  const handleChangeClientState = (newState: any, addedTags: HelmetTags) => {
    if (addedTags && addedTags.scriptTags) {
      const foundScript = addedTags.scriptTags.find(
        ({ src }) => src === googleUrl
      );
      if (foundScript) {
        foundScript.addEventListener('load', () => setScriptLoaded(true), {
          once: true,
        });
      }
    }
  };

  function getAuthCode() {
    // Request authorization code and obtain user consent
      let code = client.requestCode();
  }

  useEffect(() => {
    // "501049108069-3gg2ef4jg5odm5fjmitcgs0291srt5v4.apps.googleusercontent.com"
    if (scriptLoaded) {
      setClient(
        (window as any).google.accounts.oauth2.initCodeClient({
          client_id: "501049108069-3gg2ef4jg5odm5fjmitcgs0291srt5v4.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/userinfo.email \
                  https://www.googleapis.com/auth/userinfo.profile",
          ux_mode: "popup",
          callback: login
          // callback: login,
        })
      );
      // (window as any).google.accounts.id.initialize({
      //   client_id: GOOGLE_CLIENT_ID,
      //   callback: getAuthCode
      // });
      // // (window as any).google.accounts.id.initialize({
      // //   client_id: GOOGLE_CLIENT_ID,
      // //   callback: login,
      // //   login_uri: "http://localhost:8000/auth/google/login/callback"
      // // });
      // (window as any).google.accounts.id.renderButton(divRef.current, {
      //   theme: 'outline',
      //   size: 'large',
      //   width: divRef.current.clientWidth,
      //   callback: getAuthCode,
      // });
    }
  }, [scriptLoaded]);

  return (
    <>
      <button onClick={getAuthCode}>Sign In</button>
      <HelmetProvider>
        <Helmet onChangeClientState={handleChangeClientState}>
          <script src={googleUrl} async defer />
        </Helmet>
      </HelmetProvider>
      <div ref={divRef} />
    </>
  );
};

export default GoogleButton;
