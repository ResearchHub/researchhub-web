import { ENV_AUTH_TOKEN } from "~/config/utils/auth";
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
  const authToken = cookies[ENV_AUTH_TOKEN];
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
  let org: any = null;
  let folderSlug = "my-library";
  try {
    const orgResponse = await fetchUserOrgs({ url }, authToken);
    const orgId = cookies["current-org-id"];
    folderSlug =
      cookies["current-org-id"] === cookies["current-folder-org"] &&
      cookies["current-folder-slug"]
        ? cookies["current-folder-slug"]
        : "my-library";
    org = orgResponse[0];
    if (orgId) {
      const foundOrg = orgResponse.find((org) => {
        return org.id === parseInt(orgId, 10);
      });

      if (foundOrg) {
        org = foundOrg;
      }
    }
  } catch (error) {
    // it's probably failing because the user is not logged in
    // so we can just ignore this error
    // since we will redirect to the login page in `ReferencesRoot`
  }

  return {
    props: {
      calloutOpen,
    },
    redirect:
      org && org.slug
        ? {
            destination: `/reference-manager/${org.slug}/${folderSlug}`,
            permanent: false,
          }
        : {
            // we need a non-null `redirect` prop.
            // the /login doesn't really do anything, but it's descriptive to the user
            // since if !org || !org.slug, then the user is not logged in so the login modal will show.
            // and just /reference-manager will do an infinite redirect loop
            destination: `/reference-manager/login`,
            permanent: false,
          },
  };
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

export default connect(mapStateToProps)(Index);
