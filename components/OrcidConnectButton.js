import React from "react";
import { ORCID_CLIENT_ID } from "~/config/constants";

const OrcidConnectButton = ({ children, onSuccess, onFailure }) => {
  const buildRedirectUri = () => {
    let hostname = window.location.host;
    let scheme = "https";

    // Orcid callback does not work with localhost. We need to use IP address to get callback working.
    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      return "http://127.0.0.1:3000/orcid/connect";
    }

    return scheme + "://" + hostname + "/orcid/connect";
  };

  const initiateOAuth = () => {
    const redirectUri = buildRedirectUri();
    const oauthUrl =
      "https://orcid.org/oauth/authorize?" +
      "response_type=token" +
      "&redirect_uri=" +
      redirectUri +
      "&client_id=" +
      ORCID_CLIENT_ID +
      "&scope=openid" +
      "&nonce=11235";

    // This approach is for localhost only. We are posting a message from the window to the child to avoid CORS issues which exists only in development.
    const newWindow = window.open(oauthUrl, "_blank", "width=600,height=400");
    window.addEventListener("message", (event) => {
      if (event.data === "success") {
        clearInterval(interval);
        newWindow.close();
        onSuccess({ provider: "ORCID" });
      }
    });

    const interval = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(interval);
        console.log("OAuth window closed by user");
      } else {
        let currentUrl;
        try {
          currentUrl = newWindow.location.href;
        } catch (e) {
          console.log(e);
          // Due to same-origin policy, we may not be able to directly read the location.href property.
          // Just ignore this error for now.
        }

        if (currentUrl) {
          const searchParams = new URL(currentUrl).searchParams;
          const success = searchParams.get("success");

          if (success) {
            clearInterval(interval);
            newWindow.close();
            onSuccess({ provider: "ORCID" });
          }
        }
      }
    }, 1500);
  };

  return (
    <div onClick={initiateOAuth} style={{ width: "100%" }}>
      {children}
    </div>
  );
};

export default OrcidConnectButton;
