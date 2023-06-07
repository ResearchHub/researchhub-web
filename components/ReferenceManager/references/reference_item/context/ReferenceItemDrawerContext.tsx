import { createContext, useContext, useState } from "react";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import type { Context } from "react";

export type referenceItemDatum = any; // schema for referenceItemDatum comes from the backend.

export type ReferenceItemDrawerContextValueType = {
  isDrawerOpen: boolean;
  referenceItemDatum: referenceItemDatum;
  referencesFetchTime: number;
  setIsDrawerOpen: (flag: boolean) => void;
  setReferenceItemDatum: (data: referenceItemDatum) => void;
  setReferencesFetchTime: (time: number) => void;
};

export const DEFAULT_REFERENCE_ITEM_DRAWER_DATA: referenceItemDatum = {};

export const DEFAULT_REFERENCE_ITEM_DRAWER_CONTEXT_VALUE: ReferenceItemDrawerContextValueType =
  {
    isDrawerOpen: false,
    referenceItemDatum: DEFAULT_REFERENCE_ITEM_DRAWER_DATA,
    setIsDrawerOpen: emptyFncWithMsg,
    setReferenceItemDatum: emptyFncWithMsg,
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
  const [referenceItemDatum, setReferenceItemDatum] =
    useState<referenceItemDatum>(DEFAULT_REFERENCE_ITEM_DRAWER_DATA);
  const [referencesFetchTime, setReferencesFetchTime] = useState(Date.now());

  return (
    <ReferencesTabContext.Provider
      value={{
        isDrawerOpen,
        referenceItemDatum,
        referencesFetchTime,
        setIsDrawerOpen,
        setReferenceItemDatum,
        setReferencesFetchTime,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
