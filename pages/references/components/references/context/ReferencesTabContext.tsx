import { createContext, useContext, useState } from "react";
import type { Context } from "react";

export type ReferenceItemDataType = {
  // NOTE: Logical ordering for display reason
  // TODO: calvinhlee update this once BE is setup
  id: any;
  title: string;
  authors: string;
  hubs: string;
  last_author: string;
  published_date: string;
  published_year: number;
};
export type ReferencesTabContextValueType = {
  isTabOpen: boolean;
  referenceItemData: ReferenceItemDataType;
  setIsTabOpen?: (flag: boolean) => void;
  setReferenceItemData?: (data: ReferenceItemDataType) => void;
};

export const DEFAULT_REFERENCE_ITEM_DATA = {
  // NOTE: Logical ordering for display reason
  id: null,
  title: null,
  hubs: null,
  authors: null,
  last_author: null,
  published_date: null,
  published_year: null,
};

export const DEFAULT_REFERENCES_TAB_CONTEXT_VALUE: ReferencesTabContextValueType =
  {
    isTabOpen: true,
    referenceItemData: DEFAULT_REFERENCE_ITEM_DATA,
  };

export const ReferencesTabContext: Context<ReferencesTabContextValueType> =
  createContext<ReferencesTabContextValueType>(
    DEFAULT_REFERENCES_TAB_CONTEXT_VALUE
  );

export const useReferenceTabContext = (): ReferencesTabContextValueType => {
  return useContext(ReferencesTabContext);
};

export function ReferencesTabContextProvider({ children }) {
  const [isTabOpen, setIsTabOpen] = useState<boolean>(false);
  const [referenceItemData, setReferenceItemData] =
    useState<ReferenceItemDataType>(DEFAULT_REFERENCE_ITEM_DATA);

  return (
    <ReferencesTabContext.Provider
      value={{
        isTabOpen,
        referenceItemData,
        setIsTabOpen,
        setReferenceItemData,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
