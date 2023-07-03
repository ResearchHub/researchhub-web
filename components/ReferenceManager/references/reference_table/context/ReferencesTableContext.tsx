import { createContext, useContext, useState } from "react";
import { ReferenceTableRowDataType } from "../utils/formatReferenceRowData";
import type { Context } from "react";
import { ID } from "~/config/types/root_types";
import { updateReferenceCitation } from "../../api/updateReferenceCitation";
import { upsertReferenceProject } from "../../reference_organizer/api/upsertReferenceProject";
import { useReferenceActiveProjectContext } from "../../reference_organizer/context/ReferenceActiveProjectContext";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { fetchReferenceOrgProjects } from "../../reference_organizer/api/fetchReferenceOrgProjects";

export type ReferencesTableContextType = {
  referenceTableRowData: ReferenceTableRowDataType[];
  setReferenceTableRowData: (data: ReferenceTableRowDataType[]) => void;
  rowDraggedOver: ID;
  setRowDraggedOver: (dragged?: ID) => void;
  rowDragged: ID;
  setRowDragged: (draggedID?: ID) => void;
  moveCitationToFolder: ({ moveToFolderId }: { moveToFolderId: ID }) => void;
  moveFolderToFolder: ({ moveToFolderId }: { moveToFolderId: ID }) => void;
  rowDropped: ({ id }: { id: ID }) => void;
};

export const DEFAULT_CONTEXT: ReferencesTableContextType = {
  referenceTableRowData: [],
  setReferenceTableRowData: () => {},
  rowDraggedOver: null,
  setRowDraggedOver: () => {},
  setRowDragged: () => {},
  rowDragged: null,
  moveCitationToFolder: ({}) => {},
  moveFolderToFolder: ({}) => {},
  rowDropped: ({ id }) => {},
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

  const [rowDraggedOver, setRowDraggedOver] = useState<ID>();
  const [rowDragged, setRowDragged] = useState<ID>();
  const { currentOrg } = useOrgs();

  const { activeProject, setActiveProject, setCurrentOrgProjects } =
    useReferenceActiveProjectContext();

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
        rowDraggedOver,
        setRowDraggedOver,
        rowDragged,
        setRowDragged,
        moveCitationToFolder,
        moveFolderToFolder,
        rowDropped,
      }}
    >
      {children}
    </ReferencesTableContext.Provider>
  );
}
