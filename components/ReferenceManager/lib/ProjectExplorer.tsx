import { nullthrows } from "~/config/utils/nullchecks";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { renderNestedReferenceProjectsNavbarEl } from "../references/reference_organizer/renderNestedReferenceProjectsNavbarEl";
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
    const projectEl = renderNestedReferenceProjectsNavbarEl({
      currentOrgSlug: nullthrows(currentOrgSlug, "Org must be present"),
      referenceProject,
      addChildrenOpen,
      childrenOpenMap,
      handleSelectProject,
      handleClick,
      allowSelection,
      allowManage,
      selectedProjectIds,
      canEdit,
      slug: `${encodeURIComponent(referenceProject.slug)}`,
    });

    return <div key={`proj-${referenceProject.id}`}>{projectEl}</div>;
  });

  return <div>{refProjectsNavbarEls}</div>;
};

export default ProjectExplorer;
