import { Context, createContext, useContext, useEffect, useState } from "react";
import {
  emptyFncWithMsg,
  isEmpty,
  isNullOrUndefined,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { fetchReferenceOrgProjects } from "../api/fetchReferenceOrgProjects";
import { NullableString } from "~/config/types/root_types";
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";
import { ProjectValue } from "./ReferenceProjectsUpsertContext";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useRouter } from "next/router";

export type ReferenceActiveProjectContextValueType = {
  activeProject: ProjectValue | null;
  currentOrgProjects: ProjectValue[];
  isFetchingProjects: boolean;
  resetProjectsFetchTime: () => void;
  setActiveProject: (proj: ProjectValue) => void;
  setCurrentOrgProjects: (projects: ProjectValue[]) => void;
  setIsFetchingProjects: (bool: boolean) => void;
};

export const DEFAULT_VALUE = {
  activeProject: null,
  currentOrgProjects: [],
  isFetchingProjects: false,
  resetProjectsFetchTime: silentEmptyFnc,
  setActiveProject: silentEmptyFnc,
  setCurrentOrgProjects: silentEmptyFnc,
  setIsFetchingProjects: silentEmptyFnc,
};

export const ReferenceActiveProjectContext: Context<ReferenceActiveProjectContextValueType> =
  createContext<ReferenceActiveProjectContextValueType>(DEFAULT_VALUE);

export const useReferenceActiveProjectContext =
  (): ReferenceActiveProjectContextValueType => {
    return useContext(ReferenceActiveProjectContext);
  };

const findNestedTargetProject = (
  allProjects: any[],
  targetProjectName: NullableString
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

export function ReferenceActiveProjectContextProvider({ children }) {
  const [activeProject, setActiveProject] = useState<ProjectValue | null>(null);
  const [currentOrgProjects, setCurrentOrgProjects] = useState<ProjectValue[]>(
    []
  );
  const [isFetchingProjects, setIsFetchingProjects] = useState<boolean>(true);
  const [projectsFetchTime, setProjectsFetchTime] = useState<number>(
    Date.now()
  );

  const { currentOrg } = useOrgs();
  const router = useRouter();
  const orgID = currentOrg?.id;

  const activeSlugName = router.query.slug
    ? router.query.slug[router.query.slug.length - 1]
    : null;

  const findAndSetActiveProjects = (allProjects) => {
    const activeProj = findNestedTargetProject(allProjects, activeSlugName);
    const { collaborators, id, project_name, is_public } = activeProj ?? {
      collaborators: { editors: [], viewers: [] },
    };
    const flattenedCollaborators = [
      ...collaborators.editors.map((rawUser: any) => {
        return {
          ...parseUserSuggestion(rawUser),
          role: "EDITOR",
        };
      }),
      ...collaborators.viewers.map((rawUser: any) => {
        return {
          ...parseUserSuggestion(rawUser),
          role: "VIEWER",
        };
      }),
    ];
    setActiveProject({
      ...activeProj,
      collaborators: flattenedCollaborators,
      isPublic: is_public,
      projectID: id,
      projectName: project_name,
    });
  };

  // Initialize
  useEffect((): void => {
    if (!isEmpty(orgID)) {
      setIsFetchingProjects(true);
      fetchReferenceOrgProjects({
        onError: emptyFncWithMsg,
        onSuccess: (payload): void => {
          setCurrentOrgProjects(payload ?? []);
          findAndSetActiveProjects(payload);
          setIsFetchingProjects(false);
        },
        payload: {
          organization: orgID,
        },
      });
    } else {
      findAndSetActiveProjects(currentOrgProjects);
    }
  }, [activeSlugName, orgID, projectsFetchTime]);
  console.warn("activeProject: ", activeProject);

  return (
    <ReferenceActiveProjectContext.Provider
      value={{
        activeProject,
        currentOrgProjects,
        isFetchingProjects,
        resetProjectsFetchTime: (): void => setProjectsFetchTime(Date.now()),
        setActiveProject,
        setCurrentOrgProjects,
        setIsFetchingProjects,
      }}
    >
      {children}
    </ReferenceActiveProjectContext.Provider>
  );
}
