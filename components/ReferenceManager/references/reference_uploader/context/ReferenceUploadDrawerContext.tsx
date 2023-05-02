import { createContext, useContext, useState } from "react";
import { emptyFncWithMsg, silentEmptyFnc } from "~/config/utils/nullchecks";
import type { Context } from "react";
import { ID } from "~/config/types/root_types";

export type ReferenceSchemaValueSet = {
  attachment: File | null;
  schema: any;
  required: string[];
};

export type ReferenceUploadDrawerContextType = {
  isDrawerOpen: boolean;
  projectID?: ID;
  referenceSchemaValueSet: ReferenceSchemaValueSet;
  setIsDrawerOpen: (flag: boolean) => void;
  setReferenceSchemaValueSet: (data: ReferenceSchemaValueSet) => void;
};

export const DEFAULT_REF_SCHEMA_SET: ReferenceSchemaValueSet = {
  attachment: null,
  schema: {},
  required: [],
};

export const DEFAULT_UPLOAD_DRAWER_CONTEXT_VALUE: ReferenceUploadDrawerContextType =
  {
    isDrawerOpen: false,
    projectID: undefined,
    referenceSchemaValueSet: DEFAULT_REF_SCHEMA_SET,
    setIsDrawerOpen: silentEmptyFnc,
    setReferenceSchemaValueSet: silentEmptyFnc,
  };

export const ReferenceUploadDrawerContext: Context<ReferenceUploadDrawerContextType> =
  createContext<ReferenceUploadDrawerContextType>(
    DEFAULT_UPLOAD_DRAWER_CONTEXT_VALUE
  );

export const useReferenceTabContext = (): ReferenceUploadDrawerContextType => {
  return useContext(ReferenceUploadDrawerContext);
};

export function ReferenceUploadDrawerContextProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [referenceSchemaValueSet, setReferenceSchemaValueSet] =
    useState<ReferenceSchemaValueSet>(DEFAULT_REF_SCHEMA_SET);

  return (
    <ReferenceUploadDrawerContext.Provider
      value={{
        isDrawerOpen,
        referenceSchemaValueSet,
        setIsDrawerOpen,
        setReferenceSchemaValueSet,
      }}
    >
      {children}
    </ReferenceUploadDrawerContext.Provider>
  );
}
