import Login from "~/components/Login/Login";
import { NextPage } from 'next';
import { useRouter } from "next/router";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const hasRedirect = router.query.redirect;

  const loginCallback = () => {
    if (hasRedirect) {
      router.push(router.query.redirect as string)
    };
  }

  return (
    <div>
      <Login
        title={hasRedirect ? "Login to continue" : undefined}
        persistent={true}
        loginCallback={loginCallback}
      />
    </div>
  );
};

export default LoginPage;
