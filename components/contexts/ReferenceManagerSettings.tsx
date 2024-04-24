import { createContext, useContext, useEffect, useState } from "react";
import { ID } from "~/config/types/root_types";

// Localstorage keys
const PROJ_ID_KEY = "referenceManager::lastUsedProjectId";
const ORG_ID_KEY = "referenceManager::lastUsedOrganizationId";


type ReferenceManagerSettingsContextType = {
  lastUsedProjectId: ID | null;
  lastUsedOrganizationId: ID | null;
  setLastUsedProjectId: (projectId: ID) => void;
  setLastUsedOrganizationId: (organizationId: ID) => void;
}

const ReferenceManagerSettingsContext = createContext<ReferenceManagerSettingsContextType>({
  lastUsedProjectId: null,
  lastUsedOrganizationId: null,
  setLastUsedProjectId: () => {
    throw new Error("setLastUsedProjectId() not implemented");
  },
  setLastUsedOrganizationId: () => {
    throw new Error("setLastUsedOrganizationId() not implemented");
  },
});

export const referenceManagerSettingsContext = () => useContext(ReferenceManagerSettingsContext);

export const ReferenceManagerSettingsProvider = ({ children }) => {

  const [lastUsedProjectId, _setLastUsedProjectId] = useState<ID | null>(null);
  const [lastUsedOrganizationId, _setLastUsedOrganizationId] = useState<ID | null>(null);

  const setLastUsedProjectId = (projectId: ID|null) => {
    if (projectId) {
      localStorage.setItem(PROJ_ID_KEY, projectId.toString());
      _setLastUsedProjectId(projectId);
    }
  }

  const setLastUsedOrganizationId = (organizationId: ID|null) => {
    if (organizationId) {
      localStorage.setItem(ORG_ID_KEY, organizationId.toString());
      _setLastUsedOrganizationId(organizationId);
    }
  }

  useEffect(() => {
    // Load from local storage
    const projectId = localStorage.getItem(PROJ_ID_KEY);
    if (projectId) {
      _setLastUsedProjectId(parseInt(projectId) as ID);
    }

    const organizationId = localStorage.getItem(ORG_ID_KEY);
    if (organizationId) {
      _setLastUsedOrganizationId(parseInt(organizationId) as ID);
    }
  }, []);

  return (
    <ReferenceManagerSettingsContext.Provider
      value={{
        lastUsedProjectId,
        lastUsedOrganizationId,
        setLastUsedProjectId,
        setLastUsedOrganizationId,
      }}
    >
      {children}
    </ReferenceManagerSettingsContext.Provider>
  )
}
