import { nullthrows } from "~/config/utils/nullchecks";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { renderNestedReferenceProjectsNavbarEl } from "../references/reference_organizer/renderNestedReferenceProjectsNavbarEl";
import { useEffect, useState } from "react";

interface Props {
  currentOrgProjects: any[];
  handleClick?: Function;
}

const ProjectExplorer = ({ currentOrgProjects, handleClick }: Props) => {
  const currentOrg = getCurrentUserCurrentOrg();
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
    return renderNestedReferenceProjectsNavbarEl({
      currentOrgSlug: nullthrows(currentOrgSlug, "Org must be present"),
      referenceProject,
      addChildrenOpen,
      childrenOpenMap,
      handleClick,
      slug: `${encodeURIComponent(referenceProject.slug)}`,
    });
  });

  return <div>{refProjectsNavbarEls}</div>;
};

export default ProjectExplorer;
