import Router from "next/router";
import killswitch from "../../../config/killswitch/killswitch";
import { ELNEditor } from "../../../components/CKEditor/ELNEditor";
import { ReactElement } from "react";
import { connect } from "react-redux";

const isServer = () => typeof window === "undefined";

function Index(props): ReactElement<"div"> {
  if (!killswitch("ELN") && !isServer()) {
    Router.push("/");
  }
  return <ELNEditor {...props} />;
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Index);
