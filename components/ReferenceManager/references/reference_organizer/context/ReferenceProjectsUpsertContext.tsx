import { createContext, useContext, useState } from "react";
import { ID, NullableString } from "~/config/types/root_types";
import { LookupSuggestedUser } from "~/components/ReferenceManager/form/ReferenceItemRhUserLookupInputTag";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import type { Context } from "react";

export type UpsertPurpose = "create" | "create_sub_project" | "update";
export type ProjectValue = {
  children: ProjectValue[];
  collaborators: LookupSuggestedUser[];
  flattenedCollaborators: LookupSuggestedUser[];
  isPublic: boolean;
  projectID: ID;
  projectName: NullableString;
  status: string;
  slug: string;
  organization: ID;
};
export type ReferenceProjectsUpsertContextValueType = {
  isModalOpen: boolean;
  projectsFetchTime: number;
  projectValue: ProjectValue;
  resetContext: () => void;
  setIsModalOpen: (flag: boolean) => void;
  setProjectValue: (value: ProjectValue) => void;
  setUpsertPurpose: (value: UpsertPurpose) => void;
  upsertPurpose: UpsertPurpose;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (val: boolean) => void;
  deleteProject: any;
  setDeleteProject: (value) => void;
};
export const DEFAULT_PROJECT_VALUES: ProjectValue = {
  children: [],
  collaborators: [],
  flattenedCollaborators: [],
  isPublic: true,
  projectID: undefined,
  projectName: undefined,
  status: "full_access",
};
export const DEFAULT_REFERENCE_PROJECT_UPSERT_CONTEXT_VALUE: ReferenceProjectsUpsertContextValueType =
  {
    isModalOpen: false,
    projectsFetchTime: Date.now(),
    projectValue: DEFAULT_PROJECT_VALUES,
    resetContext: silentEmptyFnc,
    setIsModalOpen: silentEmptyFnc,
    setProjectValue: silentEmptyFnc,
    setUpsertPurpose: silentEmptyFnc,
    upsertPurpose: "create",
  };

export const ReferencesTabContext: Context<ReferenceProjectsUpsertContextValueType> =
  createContext<ReferenceProjectsUpsertContextValueType>(
    DEFAULT_REFERENCE_PROJECT_UPSERT_CONTEXT_VALUE
  );

export const useReferenceProjectUpsertContext =
  (): ReferenceProjectsUpsertContextValueType => {
    return useContext(ReferencesTabContext);
  };

export function ReferenceProjectsUpsertContextProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteProject, setDeleteProject] = useState<any>();
  const [upsertPurpose, setUpsertPurpose] = useState<UpsertPurpose>("create");
  const [projectValue, setProjectValue] = useState<ProjectValue>(
    DEFAULT_PROJECT_VALUES
  );

  const [projectsFetchTime, setProjectsFetchTime] = useState<number>(
    Date.now()
  );
  const resetContext = (): void => {
    setIsModalOpen(false);
    setProjectValue(DEFAULT_PROJECT_VALUES);
    setUpsertPurpose("create");
  };

  return (
    <ReferencesTabContext.Provider
      value={{
        isModalOpen,
        projectsFetchTime,
        projectValue,
        resetContext,
        setIsModalOpen,
        setProjectValue,
        setUpsertPurpose,
        upsertPurpose,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteProject,
        setDeleteProject,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
