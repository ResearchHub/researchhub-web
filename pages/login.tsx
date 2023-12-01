import Login from "~/components/Login/Login";
import { NextPage } from 'next';
import { useRouter } from "next/router";
import Head from "~/components/Head";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const hasRedirect = router.query.redirect;

  const loginCallback = () => {
    if (hasRedirect) {
      router.push(router.query.redirect as string);
    };
  }

  return (
    <div>
      <Head
        title={"Login to ResearchHub"}
      />      
      <Login
        title={hasRedirect ? "Login to continue" : undefined}
        persistent={true}
        loginCallback={loginCallback}
      />
    </div>
  );
};

export default LoginPage;
