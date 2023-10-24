import { createContext, useContext, useState } from "react";
import { ReferenceTableRowDataType } from "../utils/formatReferenceRowData";
import type { Context } from "react";
import { ID } from "~/config/types/root_types";
import { upsertReferenceProject } from "../../reference_organizer/api/upsertReferenceProject";
import { fetchReferenceOrgProjects } from "../../reference_organizer/api/fetchReferenceOrgProjects";
import { updateReferenceCitation } from "../../api/updateReferenceCitation";
import { useReferenceActiveProjectContext } from "../../reference_organizer/context/ReferenceActiveProjectContext";
import { useOrgs } from "~/components/contexts/OrganizationContext";

export type ReferencesTableContextType = {
  referenceTableRowData: ReferenceTableRowDataType[];
  setReferenceTableRowData: (data: ReferenceTableRowDataType[]) => void;
  referencesContextLoading: boolean;
  setReferencesContextLoading: (boolean: boolean) => void;
  addSingleReference: (entry: ReferenceTableRowDataType) => void;
  rowDraggedOver: ID;
  setRowDraggedOver: (dragged?: ID) => void;
  rowDragged: ID;
  setRowDragged: (draggedID?: ID) => void;
  moveCitationToFolder: ({ moveToFolderId }: { moveToFolderId: ID }) => void;
  moveFolderToFolder: ({ moveToFolderId }: { moveToFolderId: ID }) => void;
  rowDropped: ({ id }: { id: ID }) => void;
  openedTabs: any[];
  setOpenedTabs: (openedPdfs: any[]) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  openTabIndex: number | null | undefined;
  setOpenTabIndex: (index: number) => void;
  openTab: (tab: any) => void;
  removeTab: (tab: any) => void;
};

export const DEFAULT_CONTEXT: ReferencesTableContextType = {
  referenceTableRowData: [],
  setReferenceTableRowData: () => {},
  addSingleReference: () => {},
  referencesContextLoading: false,
  setReferencesContextLoading: () => {},
  rowDraggedOver: null,
  setRowDraggedOver: () => {},
  setRowDragged: () => {},
  rowDragged: null,
  moveCitationToFolder: ({}) => {},
  moveFolderToFolder: ({}) => {},
  rowDropped: ({ id }) => {},
  openedTabs: [],
  activeTab: "",
  setActiveTab: () => {},
  setOpenedTabs: () => {},
  openTabIndex: null,
  setOpenTabIndex: () => {},
  openTab: () => {},
  removeTab: () => {},
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

  const addSingleReference = (newEntry: ReferenceTableRowDataType) => {
    setReferenceTableRowData([newEntry, ...referenceTableRowData]);
  };

  const [rowDraggedOver, setRowDraggedOver] = useState<ID>();
  const [rowDragged, setRowDragged] = useState<ID>();
  const [openTabIndex, setOpenTabIndex] = useState<number>();
  const [openedTabs, setOpenedTabs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all-references");
  const { currentOrg } = useOrgs();

  const { activeProject, setActiveProject, setCurrentOrgProjects } =
    useReferenceActiveProjectContext();

  function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  const openTab = (tab) => {
    const parsedTab = tab;
    parsedTab["title"] = tab.fields.title;
    parsedTab["id"] = uuidv4();
    const newOpenTabs = [...openedTabs, parsedTab];
    setOpenedTabs(newOpenTabs);
    setActiveTab(tab.id);
    setOpenTabIndex(newOpenTabs.length - 1);
  };

  const removeTab = ({ index }) => {
    const newOpenTabs = [...openedTabs];
    newOpenTabs.splice(index, 1);
    setOpenedTabs(newOpenTabs);
    if (newOpenTabs.length) {
      if (openTabIndex >= newOpenTabs.length) {
        setActiveTab(newOpenTabs[openTabIndex - 1].id);
        setOpenTabIndex(openTabIndex - 1);
      } else {
        setActiveTab(newOpenTabs[openTabIndex].id);
      }
    }
  };

  const moveCitationToFolder = ({ moveToFolderId }) => {
    const newReferenceData = referenceTableRowData.filter((data) => {
      return data.id !== rowDragged;
    });
    setReferenceTableRowData(newReferenceData);
    updateReferenceCitation({
      payload: {
        citation_id: rowDragged,
        // TODO: calvinhlee - create utily functions to format these
        project: parseInt(moveToFolderId, 10),
      },
      onSuccess: () => {
        setRowDraggedOver(null);
      },
      onError: () => {},
    });
  };

  const rowDropped = ({ id }) => {
    if (rowDragged?.toString().includes("folder")) {
      moveFolderToFolder({ moveToFolderId: id });
    } else {
      moveCitationToFolder({
        moveToFolderId: id,
      });
    }
  };

  const moveFolderToFolder = ({ moveToFolderId }) => {
    const intId = parseInt(rowDragged?.split("-folder")[0], 10);
    const newChildren = activeProject?.children.filter((data) => {
      return data.id !== intId;
    });
    const newActiveProject = { ...activeProject };
    newActiveProject.children = newChildren;
    setActiveProject(newActiveProject);

    upsertReferenceProject({
      upsertPurpose: "update",
      onSuccess: () => {
        fetchReferenceOrgProjects({
          onSuccess: (payload) => {
            setCurrentOrgProjects(payload);
          },
          payload: {
            organization: currentOrg.id,
          },
        });
      },
      payload: {
        project: intId,
        parent: parseInt(moveToFolderId, 10),
      },
    });
  };

  return (
    <ReferencesTableContext.Provider
      value={{
        referenceTableRowData,
        setReferenceTableRowData,
        referencesContextLoading,
        setReferencesContextLoading,
        addSingleReference,
        rowDraggedOver,
        setRowDraggedOver,
        rowDragged,
        setRowDragged,
        moveCitationToFolder,
        moveFolderToFolder,
        rowDropped,
        openedTabs,
        setActiveTab,
        setOpenedTabs,
        activeTab,
        openTabIndex,
        setOpenTabIndex,
        openTab,
        removeTab,
      }}
    >
      {children}
    </ReferencesTableContext.Provider>
  );
}
