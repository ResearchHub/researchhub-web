import { createContext, useContext, useState } from "react";
import { ReferenceTableRowDataType } from "../utils/formatReferenceRowData";
import type { Context } from "react";

export type ReferencesTableContextType = {
  referenceTableRowData: ReferenceTableRowDataType[];
  setReferenceTableRowData: (data: ReferenceTableRowDataType[]) => void;
  referencesContextLoading: boolean;
  setReferencesContextLoading: (boolean: boolean) => void;
};

export const DEFAULT_CONTEXT: ReferencesTableContextType = {
  referenceTableRowData: [],
  setReferenceTableRowData: () => {},
};

export const ReferencesTableContext: Context<ReferencesTableContextType> =
  createContext<ReferencesTableContextType>(DEFAULT_CONTEXT);

export const useReferencesTableContext = (): ReferencesTableContextType => {
  return useContext(ReferencesTableContext);
};

export function ReferencesTableContextProvider({ children }) {
  const [referenceTableRowData, setReferenceTableRowData] = useState<
    ReferenceTableRowDataType[]
  >([]);

  const [referencesContextLoading, setReferencesContextLoading] =
    useState<boolean>(false);

  return (
    <ReferencesTableContext.Provider
      value={{
        referenceTableRowData,
        setReferenceTableRowData,
        referencesContextLoading,
        setReferencesContextLoading,
      }}
    >
      {children}
    </ReferencesTableContext.Provider>
  );
}
