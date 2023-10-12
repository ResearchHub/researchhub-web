import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Loader from "~/components/Loader/Loader";


import api, { generateApiUrl } from "~/config/api";

function LinkedInLogin() {
  const router = useRouter();
  const loader = useRef();
  const completeLinkedInLogin = async () => {
    const { code, state } = router.query;
    const url = generateApiUrl("auth/linkedin_oauth2/login/callback");
    const params = {
      code,
      state,
    };
    const resp = await fetch(url, api.POST_CONFIG(params));
    const json = await resp.json();
    if (resp.ok) {
      close();
    }
  };
  useEffect(() => {
    loader.current = require("@lottiefiles/react-lottie-player").Player;
    completeLinkedInLogin();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Loader loading={true} Component={loader.current} size={80} />
    </div>
  );
}

export default LinkedInLogin;
