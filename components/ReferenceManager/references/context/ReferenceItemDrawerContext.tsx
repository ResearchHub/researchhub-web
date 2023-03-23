import { createContext, useContext, useState } from "react";
import type { Context } from "react";
import { ID, NullableString } from "~/config/types/root_types";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

export type ReferenceItemDrawerData = any; // schema for ReferenceItemDrawerData comes from the backend.

export type ReferencesTabContextValueType = {
  isDrawerOpen: boolean;
  referenceItemDrawerData: ReferenceItemDrawerData;
  setIsDrawerOpen: (flag: boolean) => void;
  setReferenceItemDrawerData: (data: ReferenceItemDrawerData) => void;
};

export const DEFAULT_REFERENCE_ITEM_TAB_DATA: ReferenceItemDrawerData = {};

export const DEFAULT_REFERENCES_TAB_CONTEXT_VALUE: ReferencesTabContextValueType =
  {
    isDrawerOpen: true,
    referenceItemDrawerData: DEFAULT_REFERENCE_ITEM_TAB_DATA,
    setIsDrawerOpen: emptyFncWithMsg,
    setReferenceItemDrawerData: emptyFncWithMsg,
  };

export const ReferencesTabContext: Context<ReferencesTabContextValueType> =
  createContext<ReferencesTabContextValueType>(
    DEFAULT_REFERENCES_TAB_CONTEXT_VALUE
  );

export const useReferenceTabContext = (): ReferencesTabContextValueType => {
  return useContext(ReferencesTabContext);
};

export function ReferencesTabContextProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [referenceItemDrawerData, setReferenceItemDrawerData] =
    useState<ReferenceItemDrawerData>(DEFAULT_REFERENCE_ITEM_TAB_DATA);

  return (
    <ReferencesTabContext.Provider
      value={{
        isDrawerOpen,
        referenceItemDrawerData,
        setIsDrawerOpen,
        setReferenceItemDrawerData,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
