import { Context, createContext, useContext, useState } from "react";
import { ProjectValue } from "./ReferenceProjectsUpsertContext";

export type ReferenceActiveProjectContextValueType = {
  activeProject: ProjectValue | null;
  setActiveProject: (proj: ProjectValue) => void;
  currentOrgProjects: ProjectValue[];
  setCurrentOrgProjects: (projects: ProjectValue[]) => void;
  // lastFetchedTime: number;
};

export const DEFAULT_VALUE = {
  activeProject: null,
  setActiveProject: (): void => {},
  // lastFetchedTime: Date.now(),
};

export const ReferenceActiveProjectContext: Context<ReferenceActiveProjectContextValueType> =
  createContext<ReferenceActiveProjectContextValueType>(DEFAULT_VALUE);

export const useReferenceActiveProjectContext =
  (): ReferenceActiveProjectContextValueType => {
    return useContext(ReferenceActiveProjectContext);
  };

export function ReferenceActiveProjectContextProvider({ children }) {
  const [activeProject, setActiveProject] = useState<ProjectValue | null>(null);
  const [currentOrgProjects, setCurrentOrgProjects] = useState<ProjectValue[]>(
    []
  );
  // const [lastFetchedTime, ]
  return (
    <ReferenceActiveProjectContext.Provider
      value={{
        activeProject,
        setActiveProject,
        currentOrgProjects,
        setCurrentOrgProjects,
      }}
    >
      {children}
    </ReferenceActiveProjectContext.Provider>
  );
}
