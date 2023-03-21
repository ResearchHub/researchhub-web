import { createContext, useContext, useState } from "react";
import type { Context } from "react";
import { ID, NullableString } from "~/config/types/root_types";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

export type ReferenceTableRowDataType = {
  // NOTE: Logical ordering for display reason
  // TODO: calvinhlee update this once BE is setup
  id: ID;
  citation_type: NullableString;
  title: NullableString;
  authors: NullableString;
  hubs: NullableString;
  last_author: NullableString;
  published_date: NullableString;
  published_year: NullableString;
};
export type ReferenceItem = any; // schema for ReferenceItem comes from the backend.

export type ReferencesTabContextValueType = {
  isTabOpen: boolean;
  referenceItem: ReferenceItem;
  referenceTableRowData: ReferenceTableRowDataType[];
  setIsTabOpen: (flag: boolean) => void;
  setReferenceItem: (data: ReferenceItem) => void;
  setReferenceTableRowData: (data: ReferenceTableRowDataType[]) => void;
};

export const DEFAULT_REFERENCE_ITEM_DATA: ReferenceTableRowDataType = {
  // NOTE: Logical ordering for display reason
  id: null,
  citation_type: null,
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
    referenceItem: DEFAULT_REFERENCE_ITEM_DATA,
    referenceTableRowData: [],
    setIsTabOpen: emptyFncWithMsg,
    setReferenceItem: emptyFncWithMsg,
    setReferenceTableRowData: emptyFncWithMsg,
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
  const [referenceItem, setReferenceItem] = useState<ReferenceItem>(
    DEFAULT_REFERENCE_ITEM_DATA
  );
  const [referenceTableRowData, setReferenceTableRowData] = useState<
    ReferenceTableRowDataType[]
  >([]);

  return (
    <ReferencesTabContext.Provider
      value={{
        isTabOpen,
        referenceItem,
        referenceTableRowData,
        setIsTabOpen,
        setReferenceItem,
        setReferenceTableRowData,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
