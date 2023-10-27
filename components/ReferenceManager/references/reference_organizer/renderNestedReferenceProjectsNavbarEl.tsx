import { isEmpty } from "~/config/utils/nullchecks";
import ReferenceProjectsNavbarEl from "./ReferenceProjectsNavbarEl";
import { useRouter } from "next/router";

type Args = {
  addChildrenOpen: ({ key, value }) => void;
  child?: boolean;
  childrenOpenMap: {};
  currentOrgSlug: string;
  depth?: number;
  referenceProject: any;
  slug: string;
  handleClick?: Function;
  setIsDeleteModalOpen: () => void;
};

export function renderNestedReferenceProjectsNavbarEl({
  addChildrenOpen,
  child,
  childrenOpenMap,
  currentOrgSlug,
  depth = 0,
  referenceProject,
  setIsDeleteModalOpen,
  setActiveTab,
  slug,
  handleClick,
}: Args) {
  const router = useRouter();
  const hasChildren = !isEmpty(referenceProject.children);
  const isActive = router.query.slug?.slice(-1)[0] === referenceProject.slug;

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      key={`ref-project-${referenceProject?.id}-wrap`}
    >
      <ReferenceProjectsNavbarEl
        key={`ref-project-${referenceProject?.id}`}
        active={isActive}
        handleClick={handleClick}
        orgSlug={currentOrgSlug}
        projectID={referenceProject?.id}
        projectName={referenceProject?.project_name}
        isCurrentUserAdmin={referenceProject?.current_user_is_admin ?? false}
        isPublic={referenceProject?.is_public}
        referenceProject={referenceProject}
        child={Boolean(child)}
        depth={depth}
        isOpen={childrenOpenMap[referenceProject?.id]}
        addChildrenOpen={addChildrenOpen}
        slug={slug}
        setActiveTab={setActiveTab}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
      {hasChildren && childrenOpenMap[referenceProject?.id] && (
        <div
          style={{ marginLeft: 8, display: "flex", flexDirection: "column" }}
        >
          {referenceProject.children.map((childReferenceProject) => {
            return renderNestedReferenceProjectsNavbarEl({
              setActiveTab,
              setIsDeleteModalOpen,
              currentOrgSlug,
              referenceProject: childReferenceProject,
              child: true,
              handleClick,
              depth: depth + 1,
              addChildrenOpen,
              childrenOpenMap,
              slug: `${slug}/${encodeURIComponent(childReferenceProject.slug)}`,
            });
          })}
        </div>
      )}
    </div>
  );
}
