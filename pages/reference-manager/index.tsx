import nookies from "nookies";
import { connect } from "react-redux";

import { ReferenceItemDrawerContextProvider } from "~/components/ReferenceManager/references/reference_item/context/ReferenceItemDrawerContext";
import HeadComponent from "~/components/Head";
import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";
import killswitch from "~/config/killswitch/killswitch";
import LoginModal from "~/components/Login/LoginModal";
import { fetchUserOrgs } from "~/config/fetch";
import { AUTH_TOKEN } from "~/config/constants";
import { generateApiUrl } from "~/config/api";

function Index(props) {
  const { isLoggedIn, authChecked } = props;
  if (!killswitch("reference-manager")) {
    return null;
  } else
    return (
      <ReferenceItemDrawerContextProvider>
        <HeadComponent title={"ResearchHub Reference Manager"}></HeadComponent>
        {isLoggedIn || !authChecked ? (
          <ReferencesContainer {...props} />
        ) : (
          <LoginModal isOpen={true} />
        )}
      </ReferenceItemDrawerContextProvider>
    );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
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
