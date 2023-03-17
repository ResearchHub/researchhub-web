import { createContext, useContext, useState } from "react";
import type { Context } from "react";
import { ID, NullableString } from "~/config/types/root_types";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

export type ReferenceItemDataType = {
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
export type ReferencesTabContextValueType = {
  isTabOpen: boolean;
  referenceItemTabData: ReferenceItemDataType;
  referenceRowData: ReferenceItemDataType[];
  setIsTabOpen: (flag: boolean) => void;
  setReferenceItemTabData: (data: ReferenceItemDataType) => void;
  setReferenceRowData: (data: ReferenceItemDataType[]) => void;
};

export const DEFAULT_REFERENCE_ITEM_DATA: ReferenceItemDataType = {
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
    referenceItemTabData: DEFAULT_REFERENCE_ITEM_DATA,
    referenceRowData: [],
    setIsTabOpen: emptyFncWithMsg,
    setReferenceItemTabData: emptyFncWithMsg,
    setReferenceRowData: emptyFncWithMsg,
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
    useState<ReferenceItemDataType>(DEFAULT_REFERENCE_ITEM_DATA);
  const [referenceRowData, setReferenceRowData] = useState<
    ReferenceItemDataType[]
  >([]);

  return (
    <ReferencesTabContext.Provider
      value={{
        isTabOpen,
        referenceItemTabData,
        referenceRowData,
        setIsTabOpen,
        setReferenceItemTabData,
        setReferenceRowData,
      }}
    >
      {children}
    </ReferencesTabContext.Provider>
  );
}
