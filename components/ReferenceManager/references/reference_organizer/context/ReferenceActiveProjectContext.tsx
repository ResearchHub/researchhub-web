import { Context, createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Types
import { ProjectValue } from "./ReferenceProjectsUpsertContext";

// Utils
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";
import {
  emptyFncWithMsg,
  isEmpty,
  isNullOrUndefined,
} from "~/config/utils/nullchecks";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { fetchReferenceOrgProjects } from "../api/fetchReferenceOrgProjects";

export type ReferenceActiveProjectContextValueType = {
  activeProject: ProjectValue | null;
  setActiveProject: (proj: ProjectValue) => void;
  currentOrgProjects: ProjectValue[];
  setCurrentOrgProjects: (projects: ProjectValue[]) => void;
  setIsFetchingProjects: (bool: boolean) => void;
  isFetchingProjects: boolean;
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
  const [isFetchingProjects, setIsFetchingProjects] = useState<boolean>(true);
  const { currentOrg, refetchOrgs } = useOrgs();

  const router = useRouter();
  const orgID = currentOrg?.id;

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

  useEffect((): void => {
    if (!isEmpty(orgID)) {
      setIsFetchingProjects(true);
      fetchReferenceOrgProjects({
        onError: emptyFncWithMsg,
        onSuccess: (payload): void => {
          setCurrentOrgProjects(payload ?? []);
          findActiveProjects(payload);
          setIsFetchingProjects(false);
        },
        payload: {
          organization: orgID,
        },
      });
    }
  }, [orgID]);

  const findActiveProjects = (allProjects) => {
    const activeSlugName = router.query.slug
      ? router.query.slug[router.query.slug.length - 1]
      : null;
    const activeProj = findNestedTargetProject(allProjects, activeSlugName);
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
      projectID: id,
      projectName: project_name,
      isPublic: is_public,
    });
  };

  useEffect(() => {
    findActiveProjects(currentOrgProjects);
  }, [router.query.slug, currentOrgProjects]);

  return (
    <ReferenceActiveProjectContext.Provider
      value={{
        activeProject,
        setActiveProject,
        currentOrgProjects,
        setCurrentOrgProjects,
        isFetchingProjects,
        setIsFetchingProjects,
      }}
    >
      {children}
    </ReferenceActiveProjectContext.Provider>
  );
}
