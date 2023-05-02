import { AUTH_TOKEN } from "~/config/constants";
import { connect } from "react-redux";
import { fetchUserOrgs } from "~/config/fetch";
import { generateApiUrl } from "~/config/api";
import nookies from "nookies";
import ReferencesRoot from "~/components/ReferenceManager/references/ReferencesRoot";

function Index(props) {
  const { isLoggedIn, authChecked } = props;

  return <ReferencesRoot authChecked={authChecked} isLoggedIn={isLoggedIn} />;
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
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
  const org = orgResponse[0];

  return {
    redirect: {
      destination: `/reference-manager/${org.slug}/`,
      permanent: false,
    },
  };
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

export default connect(mapStateToProps)(Index);
