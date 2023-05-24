import { createContext, useContext, useState } from "react";
import { ID, NullableString } from "~/config/types/root_types";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import type { Context } from "react";

export type UpsertPurpose = "create" | "create_sub_project" | "update";
export type ProjectValue = {
  collaborators: SuggestedUser[];
  isPublic: boolean;
  projectID: ID;
  projectName: NullableString;
};
export type ReferenceProjectsUpsertContextValueType = {
  isModalOpen: boolean;
  projectValue: ProjectValue;
  projectsFetchTime: number;
  resetContext: () => void;
  setIsModalOpen: (flag: boolean) => void;
  setProjectValue: (value: ProjectValue) => void;
  setUpsertPurpose: (value: UpsertPurpose) => void;
  resetProjectsFetchTime: () => void;
  upsertPurpose: UpsertPurpose;
};
export const DEFAULT_PROJECT_VALUES = {
  collaborators: [],
  isPublic: true,
  projectID: undefined,
  projectName: undefined,
};
export const DEFAULT_REFERENCE_PROJECT_UPSERT_CONTEXT_VALUE: ReferenceProjectsUpsertContextValueType =
  {
    isModalOpen: false,
    projectsFetchTime: Date.now(),
    projectValue: DEFAULT_PROJECT_VALUES,
    resetContext: silentEmptyFnc,
    resetProjectsFetchTime: silentEmptyFnc,
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
  const [upsertPurpose, setUpsertPurpose] = useState<UpsertPurpose>("create");
  const [projectValue, setProjectValue] = useState<ProjectValue>(
    DEFAULT_PROJECT_VALUES
  );
  const [projectsFetchTime, setProjectsFetchTime] = useState<number>(
    Date.now()
  );
  const resetProjectsFetchTime = () => setProjectsFetchTime(Date.now());
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
        resetProjectsFetchTime,
        setIsModalOpen,
        setProjectValue,
        setUpsertPurpose,
        upsertPurpose,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
