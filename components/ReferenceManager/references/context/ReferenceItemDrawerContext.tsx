import { createContext, useContext, useState } from "react";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import type { Context } from "react";

export type ReferenceItemDrawerData = any; // schema for ReferenceItemDrawerData comes from the backend.

export type ReferenceItemDrawerContextValueType = {
  isDrawerOpen: boolean;
  referenceItemDrawerData: ReferenceItemDrawerData;
  setIsDrawerOpen: (flag: boolean) => void;
  setReferenceItemDrawerData: (data: ReferenceItemDrawerData) => void;
};

export const DEFAULT_REFERENCE_ITEM_DRAWER_DATA: ReferenceItemDrawerData = {};

export const DEFAULT_REFERENCE_ITEM_DRAWER_CONTEXT_VALUE: ReferenceItemDrawerContextValueType =
  {
    isDrawerOpen: true,
    referenceItemDrawerData: DEFAULT_REFERENCE_ITEM_DRAWER_DATA,
    setIsDrawerOpen: emptyFncWithMsg,
    setReferenceItemDrawerData: emptyFncWithMsg,
  };

export const ReferencesTabContext: Context<ReferenceItemDrawerContextValueType> =
  createContext<ReferenceItemDrawerContextValueType>(
    DEFAULT_REFERENCE_ITEM_DRAWER_CONTEXT_VALUE
  );

export const useReferenceTabContext =
  (): ReferenceItemDrawerContextValueType => {
    return useContext(ReferencesTabContext);
  };

export function ReferenceItemDrawerContextProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [referenceItemDrawerData, setReferenceItemDrawerData] =
    useState<ReferenceItemDrawerData>(DEFAULT_REFERENCE_ITEM_DRAWER_DATA);

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
