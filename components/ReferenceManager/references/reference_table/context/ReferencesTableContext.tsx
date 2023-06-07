import { createContext, useContext, useState } from "react";
import { ReferenceTableRowDataType } from "../utils/formatReferenceRowData";
import type { Context } from "react";

export type ReferencesTableContextType = {
  referenceTableRowData: ReferenceTableRowDataType[];
  setReferenceTableRowData: (data: ReferenceTableRowDataType[]) => void;
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

  return (
    <ReferencesTableContext.Provider
      value={{
        referenceTableRowData,
        setReferenceTableRowData,
      }}
    >
      {children}
    </ReferencesTableContext.Provider>
  );
}
