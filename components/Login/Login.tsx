import { AuthActions } from "~/redux/auth";
import { connect } from "react-redux";
import { useGoogleOneTapLogin } from "~/config/utils/useGoogleOneTapLogin";
import { useState } from "react";
import LoginModal from "./LoginModal";

type Props = {
  loginCallback?: Function;
  children?: any;
  persistent?: boolean;
  title?: string;
};

const Login = ({
  children,
  loginCallback,
  title,
  persistent = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(persistent);
  useGoogleOneTapLogin(); // triggers Google OneTap

  return (
    <div style={{ width: "100%" }}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (persistent) return;
          else setIsOpen(true);
        }}
      >
        {children}
      </div>

      <LoginModal
        persistent={persistent}
        isOpen={isOpen}
        title={title}
        handleClose={() => {
          if (persistent) return;
          else setIsOpen(false);
        }}
        loginCallback={loginCallback}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  login: AuthActions.orcidLogin,
  getUser: AuthActions.getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
