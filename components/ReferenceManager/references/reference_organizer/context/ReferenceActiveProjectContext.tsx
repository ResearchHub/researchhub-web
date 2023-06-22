import { Context, createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Types
import { ProjectValue } from "./ReferenceProjectsUpsertContext";

// Utils
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";

export type ReferenceActiveProjectContextValueType = {
  activeProject: ProjectValue | null;
  setActiveProject: (proj: ProjectValue) => void;
  currentOrgProjects: ProjectValue[];
  setCurrentOrgProjects: (projects: ProjectValue[]) => void;
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

  const router = useRouter();

  const findNestedTargetProject = (
    allProjects: any[],
    targetProjectName: ID
  ) => {
    for (const project of allProjects) {
      if (project.project_name === targetProjectName) {
        return project;
      }
      const projectChildren = project.children;
      if (!isEmpty(projectChildren)) {
        const childTarget = findNestedTargetProject(
          projectChildren,
          targetProjectName
        );
        if (!isNullOrUndefined(childTarget)) {
          return childTarget;
        }
      }
    }
  };

  useEffect(() => {
    const activeSlugName = router.query.slug
      ? router.query.slug[router.query.slug.length - 1]
      : null;
    const activeProj = findNestedTargetProject(
      currentOrgProjects,
      activeSlugName
    );
    const {
      collaborators: { editors, viewers },
      id,
      project_name,
      is_public,
    } = activeProj ?? {
      collaborators: { editors: [], viewers: [] },
    };

    setActiveProject({
      ...activeProj,
      collaborators: [
        ...editors.map((rawUser: any) => {
          return {
            ...parseUserSuggestion(rawUser),
            role: "EDITOR",
          };
        }),
        ...viewers.map((rawUser: any) => {
          return {
            ...parseUserSuggestion(rawUser),
            role: "VIEWER",
          };
        }),
      ],
      projectID: id,
      projectName: project_name,
      isPublic: is_public,
    });
  }, [router.query.slug]);

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
