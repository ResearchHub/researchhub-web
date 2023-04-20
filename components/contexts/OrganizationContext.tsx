import { useContext, createContext, useEffect, useState } from "react";
import numeral from "numeral";
import { fetchUserOrgs } from "~/config/fetch";
import { captureEvent } from "~/config/utils/events";

type ContextType = {
  orgs: [];
};

const OrganizationContext = createContext<ContextType>({
  orgs: [],
});

export const useOrgs = () => useContext(OrganizationContext);

export const OrganizationContextProvider = ({ children, user }) => {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    const _fetchAndSetUserOrgs = async () => {
      let userOrgs;
      let currOrg;

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

    if (user?.id) {
      _fetchAndSetUserOrgs();
    }
  }, [user]);

  return (
    <OrganizationContext.Provider
      value={{
        orgs,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContextProvider;
