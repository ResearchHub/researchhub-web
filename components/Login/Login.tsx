import { useState } from "react";
import { AuthActions } from "~/redux/auth";
import { connect } from "react-redux";
import LoginModal from "./LoginModal";

const Login = ({ children, loginCallback }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
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
