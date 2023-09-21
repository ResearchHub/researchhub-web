import { connect } from "react-redux";
import ReferencesRoot from "~/components/ReferenceManager/references/ReferencesRoot";
import nookies from "nookies";
import { useEffect, useState } from "react";

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
  const calloutOpen =
    cookies["callout_open"] === undefined ? null : cookies["callout_open"];
  return {
    props: {
      calloutOpen,
    },
  };
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

export default connect(mapStateToProps)(Index);
