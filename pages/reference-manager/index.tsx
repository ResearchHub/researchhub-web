import { AUTH_TOKEN } from "~/config/constants";
import { connect } from "react-redux";
import { fetchUserOrgs } from "~/config/fetch";
import { generateApiUrl } from "~/config/api";
import nookies from "nookies";
import ReferencesRoot from "~/components/ReferenceManager/references/ReferencesRoot";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getCookieOrLocalStorageValue } from "~/config/utils/storeToCookieOrLocalStorage";

function Index(props) {
  const { isLoggedIn, authChecked, calloutOpen } = props;
  const [calloutIsOpen, setCalloutIsOpen] = useState(calloutOpen);

  useEffect(() => {
    const calloutOpenStorage = window.localStorage.getItem("callout_open");

    if (calloutOpenStorage && calloutOpenStorage === "false") {
      setCalloutIsOpen(false);
    }
  }, []);

  return (
    <ReferencesRoot
      authChecked={authChecked}
      isLoggedIn={isLoggedIn}
      calloutOpen={calloutIsOpen}
    />
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
  const calloutOpen =
    cookies["callout_open"] === undefined ? null : cookies["callout_open"];

  // const userURL = generateApiUrl("user");
  // const userResponse = await fetch(userURL, api.GET_CONFIG(authToken));
  // const userJson = await userResponse.json();

  // if (!userJson.results[0].reference_manager_onboarding_complete) {
  //   return {
  //     redirect: {
  //       destination: `/reference-manager/onboarding/welcome`,
  //       permanent: false,
  //     },
  //   };
  // }
  const url = generateApiUrl(`organization/0/get_user_organizations`);
  const orgResponse = await fetchUserOrgs({ url }, authToken);
  const orgId = cookies["current-org-id"];
  let org = orgResponse[0];
  if (orgId) {
    org = orgResponse.find((org) => {
      return org.id === parseInt(orgId, 10);
    });
  }

  return {
    props: {
      calloutOpen,
    },
    redirect: {
      destination: `/reference-manager/${org.slug}/?org_refs=true`,
      permanent: false,
    },
  };
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

export default connect(mapStateToProps)(Index);
