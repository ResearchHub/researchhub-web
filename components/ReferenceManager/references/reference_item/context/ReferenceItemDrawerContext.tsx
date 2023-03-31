import { createContext, useContext, useState } from "react";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import type { Context } from "react";

export type ReferenceItemDrawerData = any; // schema for ReferenceItemDrawerData comes from the backend.

export type ReferenceItemDrawerContextValueType = {
  isDrawerOpen: boolean;
  referenceItemDrawerData: ReferenceItemDrawerData;
  referencesFetchTime: number;
  setIsDrawerOpen: (flag: boolean) => void;
  setReferenceItemDrawerData: (data: ReferenceItemDrawerData) => void;
  setReferencesFetchTime: (time: number) => void;
};

export const DEFAULT_REFERENCE_ITEM_DRAWER_DATA: ReferenceItemDrawerData = {};

export const DEFAULT_REFERENCE_ITEM_DRAWER_CONTEXT_VALUE: ReferenceItemDrawerContextValueType =
  {
    isDrawerOpen: false,
    referenceItemDrawerData: DEFAULT_REFERENCE_ITEM_DRAWER_DATA,
    setIsDrawerOpen: emptyFncWithMsg,
    setReferenceItemDrawerData: emptyFncWithMsg,
    referencesFetchTime: Date.now(),
    setReferencesFetchTime: emptyFncWithMsg,
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
  const [referencesFetchTime, setReferencesFetchTime] = useState(Date.now());

  return (
    <ReferencesTabContext.Provider
      value={{
        isDrawerOpen,
        referenceItemDrawerData,
        referencesFetchTime,
        setIsDrawerOpen,
        setReferenceItemDrawerData,
        setReferencesFetchTime,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
