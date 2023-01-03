import { useState } from "react";
import { AuthActions } from "~/redux/auth";
import { connect } from "react-redux";
import LoginModal from "./LoginModal";

type Props = {
  loginCallback?: Function,
  children?: any,
}

const Login = ({ children, loginCallback }: Props) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <div onClick={(e) => {
        e.stopPropagation();
        setIsOpen(true);
      }}>
        {children}
      </div>

      <LoginModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        loginCallback={loginCallback}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  login: AuthActions.orcidLogin,
  getUser: AuthActions.getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
