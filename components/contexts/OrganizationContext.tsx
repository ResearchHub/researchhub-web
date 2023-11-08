import { useContext, createContext, useEffect, useState } from "react";
import numeral from "numeral";
import { fetchUserOrgs } from "~/config/fetch";
import { captureEvent } from "~/config/utils/events";
import { useRouter } from "next/router";
import { storeToCookieAndLocalStorage } from "~/config/utils/storeToCookieOrLocalStorage";

type ContextType = {
  orgs: Org[];
  currentOrg: Org | undefined;
  setCurrentOrg: null | ((org: Org) => void);
  fetchAndSetUserOrgs: null | (() => void);
  refetchOrgs: () => void;
  setOrgs: (orgs: Org[]) => void;
};

type Org = {
  id?: number;
  name?: string;
  slug?: string;
};

const OrganizationContext = createContext<ContextType>({
  orgs: [],
  setCurrentOrg: () => null,
  currentOrg: {},
  setOrgs: () => null,
  fetchAndSetUserOrgs: null,
  refetchOrgs: () => null,
});

export const useOrgs = () => useContext(OrganizationContext);

export const OrganizationContextProvider = ({ children, user }) => {
  const [orgs, setOrgs] = useState([]);
  const [currentOrg, setCurrentOrg] = useState({});
  const [fetchTime, setFetchTime] = useState(Date.now());
  const fetchAndSetUserOrgs = async () => {
    let userOrgs;

    try {
      userOrgs = await fetchUserOrgs({
        user,
        route: "get_user_organizations",
      });

      setOrgs(userOrgs);
    } catch (error) {
      captureEvent({
        error,
        msg: "Failed to fetch user orgs",
        data: { userId: user.id, page: "reference-manager" },
      });
    }
  };

  useEffect(() => {
    if (currentOrg?.id) {
      storeToCookieAndLocalStorage({
        key: "current-org-id",
        value: currentOrg.id,
      });
    }
  }, [currentOrg]);

  useEffect(() => {
    if (user?.id) {
      fetchAndSetUserOrgs();
    }
  }, [user, fetchTime]);

  return (
    <OrganizationContext.Provider
      value={{
        orgs,
        setOrgs,
        currentOrg,
        setCurrentOrg,
        fetchAndSetUserOrgs,
        refetchOrgs: (): void => setFetchTime(Date.now()),
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export function getCurrentUserCurrentOrg() {
  const router = useRouter();
  const { orgs, setCurrentOrg, currentOrg } = useOrgs();
  const { organization } = router.query;
  useEffect(() => {
    if (organization && orgs.length) {
      // @ts-ignore
      const curOrg = orgs.find((org) => org.slug === organization);
      // @ts-ignore
      setCurrentOrg(curOrg);
    }
  }, [organization, orgs]);
  return currentOrg;
}
export default OrganizationContextProvider;
