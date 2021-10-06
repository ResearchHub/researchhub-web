import Router from "next/router";
import killswitch from "~/config/killswitch/killswitch";
import ELNEditor from "~/components/CKEditor/ELNEditor";
import { ReactElement } from "react";
import { connect } from "react-redux";

const isServer = () => typeof window === "undefined";

function Index(props): ReactElement<"div"> | null {
  if (!killswitch("ELN") && !isServer()) {
    Router.push("/");
  }
  return props.user.id ? <ELNEditor {...props} /> : null;
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Index);
