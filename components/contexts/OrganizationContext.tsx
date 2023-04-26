import { useContext, createContext, useEffect, useState } from "react";
import numeral from "numeral";
import { fetchUserOrgs } from "~/config/fetch";
import { captureEvent } from "~/config/utils/events";

type ContextType = {
  orgs: Org[];
  currentOrg: Org | undefined;
  setCurrentOrg: null | ((org: Org) => void);
  fetchAndSetUserOrgs: null | (() => void);
};

type Org = {
  id?: number;
  name?: string;
};

const OrganizationContext = createContext<ContextType>({
  orgs: [],
  setCurrentOrg: () => null,
  currentOrg: {},
  fetchAndSetUserOrgs: null,
});

export const useOrgs = () => useContext(OrganizationContext);

export const OrganizationContextProvider = ({ children, user }) => {
  const [orgs, setOrgs] = useState([]);
  const [currentOrg, setCurrentOrg] = useState({});

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
    if (user?.id) {
      fetchAndSetUserOrgs();
    }
  }, [user]);

  return (
    <OrganizationContext.Provider
      value={{
        orgs,
        currentOrg,
        setCurrentOrg,
        fetchAndSetUserOrgs,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContextProvider;
