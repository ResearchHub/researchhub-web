import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "../utils/authRoutes";
import {
  AUTH_TOKEN,
  generateApiUrl,
  POST_CONFIG,
  saveToLocalStorage,
} from "../utils/fetch";

const Context = createContext({
  isLoggedIn: false,
  user: null,
  loginChecked: false,
  login: ({}) => {},
  loginWithGoogle: (resp) => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginChecked, setLoginChecked] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const asyncFetch = async () => {
      const resp = await getUser();
      setIsLoggedIn(resp.isLoggedIn);
      setUser(resp.user);
      setLoginChecked(true);

      if (resp.isLoggedIn) {
        router.push("/references");
      } else {
        router.push("/login");
      }
    };

    if (!loginChecked) {
      asyncFetch();
    }
  }, [loginChecked, isLoggedIn]);

  const login = async ({ email, password }) => {
    const url = generateApiUrl({ pathName: "auth/login/" });
    const resp = await fetch(url, POST_CONFIG({ data: { email, password } }));
    if (resp.ok) {
      const json = await resp.json();
      const { key } = json;
      saveToLocalStorage(AUTH_TOKEN, key);
      setLoginChecked(true);
      const { user } = await getUser();

      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        if (router.pathname.includes("login")) {
          router.push("/references");
        }
      }
    }
  };

  const loginWithGoogle = async (response) => {
    const url = generateApiUrl({ pathName: "auth/google/login/" });
    const resp = await fetch(url, POST_CONFIG({ data: response }));
    if (resp.ok) {
      const json = await resp.json();
      const { key } = json;
      saveToLocalStorage(AUTH_TOKEN, key);
      setLoginChecked(true);
      const { user } = await getUser();

      console.log(user);

      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        if (router.pathname.includes("login")) {
          router.push("/references");
        }
      }
    }
  };

  return (
    <Context.Provider
      value={{ loginChecked, isLoggedIn, user, login, loginWithGoogle }}
    >
      {loginChecked ? children : null}
    </Context.Provider>
  );
}

export function useAuthContext() {
  return useContext(Context);
}
