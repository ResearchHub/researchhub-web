import { Context, createContext, useContext, useEffect, useState } from "react";
import {
  emptyFncWithMsg,
  isEmpty,
  isNullOrUndefined,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { fetchReferenceOrgProjects } from "../api/fetchReferenceOrgProjects";
import { ProjectValue } from "./ReferenceProjectsUpsertContext";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";

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
  currentOrgProjects: [],
  isFetchingProjects: false,
  lastFetchedTime: 0,
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
