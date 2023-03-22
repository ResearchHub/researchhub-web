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
export type ReferenceItemTabData = any; // schema for ReferenceItemTabData comes from the backend.

export type ReferencesTabContextValueType = {
  isTabOpen: boolean;
  referenceItemTabData: ReferenceItemTabData;
  referenceTableRowData: ReferenceTableRowDataType[];
  setIsTabOpen: (flag: boolean) => void;
  setReferenceItemTabData: (data: ReferenceItemTabData) => void;
  setReferenceTableRowData: (data: ReferenceTableRowDataType[]) => void;
};

export const DEFAULT_REFERENCE_ITEM_TAB_DATA: ReferenceItemTabData = {};

export const DEFAULT_REFERENCES_TAB_CONTEXT_VALUE: ReferencesTabContextValueType =
  {
    isTabOpen: true,
    referenceItemTabData: DEFAULT_REFERENCE_ITEM_TAB_DATA,
    referenceTableRowData: [],
    setIsTabOpen: emptyFncWithMsg,
    setReferenceItemTabData: emptyFncWithMsg,
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
  const [referenceItemTabData, setReferenceItemTabData] =
    useState<ReferenceItemTabData>(DEFAULT_REFERENCE_ITEM_TAB_DATA);
  const [referenceTableRowData, setReferenceTableRowData] = useState<
    ReferenceTableRowDataType[]
  >([]);

  return (
    <ReferencesTabContext.Provider
      value={{
        isTabOpen,
        referenceItemTabData,
        referenceTableRowData,
        setIsTabOpen,
        setReferenceItemTabData,
        setReferenceTableRowData,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
