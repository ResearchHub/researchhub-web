import { Inter } from "@next/font/google";
import LoginContainer from "../components/login/LoginContainer";

export default function Login() {
  return <LoginContainer />;
}

Login.getLayout = function getLayout(page: ReactElement) {
  return page;
};
