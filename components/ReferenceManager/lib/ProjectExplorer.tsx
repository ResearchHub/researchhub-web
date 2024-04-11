import { nullthrows } from "~/config/utils/nullchecks";
import NestedReferenceProjectsNavbarEl from "../references/reference_organizer/NestedReferenceProjectsNavbarEl";
import { useEffect, useState } from "react";
import { ID } from "~/config/types/root_types";

interface Props {
  currentOrg: any;
  currentOrgProjects: any[];
  selectedProjectIds?: ID[];
  handleClick?: Function;
  handleSelectProject?: Function;
  allowSelection?: boolean;
  allowManage?: boolean;
  canEdit?: boolean;
}

const ProjectExplorer = ({
  currentOrg,
  currentOrgProjects,
  selectedProjectIds,
  handleSelectProject,
  handleClick,
  allowSelection = false,
  allowManage = false,
  canEdit,
}: Props) => {
  const [childrenOpenMap, setChildrenOpenMap] = useState({});

  useEffect(() => {
    const idsOpen = window.localStorage.getItem("projectIdsOpenv2") || "{}";
    const childrenOpenMap = JSON.parse(idsOpen);
    setChildrenOpenMap(childrenOpenMap);
  }, []);

  const addChildrenOpen = ({ key, value }) => {
    const map = { ...childrenOpenMap };
    map[key] = value;
    setChildrenOpenMap(map);
  };

  const currentOrgSlug = currentOrg?.slug ?? null;
  const refProjectsNavbarEls = currentOrgProjects?.map((referenceProject) => {
    const projectEl = 
      <NestedReferenceProjectsNavbarEl
        currentOrgSlug={nullthrows(currentOrgSlug, "Org must be present")}
        referenceProject={referenceProject}
        addChildrenOpen={addChildrenOpen}
        childrenOpenMap={childrenOpenMap}
        handleSelectProject={handleSelectProject}
        handleClick={handleClick}
        allowSelection={allowSelection}
        allowManage={allowManage}
        selectedProjectIds={selectedProjectIds}
        canEdit={canEdit}
        slug={`${encodeURIComponent(referenceProject.slug)}`}
        setIsDeleteModalOpen={function (): void {
          throw new Error("Function not implemented.");
        } }
      />

    return <div key={`proj-${referenceProject.id}`}>{projectEl}</div>;
  });

  return <div>{refProjectsNavbarEls}</div>;
};

export default ProjectExplorer;
