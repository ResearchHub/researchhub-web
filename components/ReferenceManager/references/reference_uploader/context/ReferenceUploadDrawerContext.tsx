import { createContext, useContext, useState } from "react";
import { emptyFncWithMsg, silentEmptyFnc } from "~/config/utils/nullchecks";
import type { Context } from "react";
import { ID, NullableString } from "~/config/types/root_types";

export type ReferenceSchemaValueSet = {
  attachment: File | null;
  schema: any;
  signedUrl?: string;
  required: string[];
};

export type ReferenceUploadDrawerContextType = {
  isDrawerOpen: boolean;
  projectID?: ID;
  referenceSchemaValueSet: ReferenceSchemaValueSet;
  selectedReferenceType: NullableString;
  setIsDrawerOpen: (flag: boolean) => void;
  setProjectID: (id: ID) => void;
  setReferenceSchemaValueSet: (data: ReferenceSchemaValueSet) => void;
  setSelectedReferenceType: (str: NullableString) => void;
};

export const DEFAULT_REF_SCHEMA_SET: ReferenceSchemaValueSet = {
  attachment: null,
  schema: {},
  required: [],
  signedUrl: "",
};

export const DEFAULT_UPLOAD_DRAWER_CONTEXT_VALUE: ReferenceUploadDrawerContextType =
  {
    isDrawerOpen: false,
    projectID: undefined,
    referenceSchemaValueSet: DEFAULT_REF_SCHEMA_SET,
    selectedReferenceType: null,
    setIsDrawerOpen: silentEmptyFnc,
    setReferenceSchemaValueSet: silentEmptyFnc,
    setProjectID: silentEmptyFnc,
    setSelectedReferenceType: silentEmptyFnc,
  };

export const ReferenceUploadDrawerContext: Context<ReferenceUploadDrawerContextType> =
  createContext<ReferenceUploadDrawerContextType>(
    DEFAULT_UPLOAD_DRAWER_CONTEXT_VALUE
  );

export const useReferenceUploadDrawerContext =
  (): ReferenceUploadDrawerContextType => {
    return useContext(ReferenceUploadDrawerContext);
  };

export function ReferenceUploadDrawerContextProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [projectID, setProjectID] = useState<ID>(undefined);
  const [selectedReferenceType, setSelectedReferenceType] =
    useState<NullableString>(null);
  const [referenceSchemaValueSet, setReferenceSchemaValueSet] =
    useState<ReferenceSchemaValueSet>(DEFAULT_REF_SCHEMA_SET);

  return (
    <ReferenceUploadDrawerContext.Provider
      value={{
        isDrawerOpen,
        projectID,
        referenceSchemaValueSet,
        selectedReferenceType,
        setIsDrawerOpen,
        setProjectID,
        setReferenceSchemaValueSet,
        setSelectedReferenceType,
      }}
    >
      {children}
    </ReferenceUploadDrawerContext.Provider>
  );
}
