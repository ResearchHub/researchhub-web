import { isEmpty } from "~/config/utils/nullchecks";
import ReferenceProjectsNavbarEl from "./ReferenceProjectsNavbarEl";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";

type Args = {
  addChildrenOpen: ({ key, value }) => void;
  child?: boolean;
  childrenOpenMap: {};
  currentOrgSlug: string;
  depth?: number;
  referenceProject: any;
  slug: string;
  selectedProjectIds?: ID[];
  handleClick?: Function;
  handleSelectProject?: Function;
  allowSelection?: boolean;
  allowManage?: boolean;
  setIsDeleteModalOpen: () => void;
  setActiveTab?: (tab) => void;
  canEdit?: boolean;
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
  handleSelectProject,
  handleClick,
  allowManage,
  allowSelection,
  selectedProjectIds,
  canEdit,
}: Args) {
  const router = useRouter();
  const hasChildren = !isEmpty(referenceProject.children);
  const isActive = router.query.slug?.slice(-1)[0] === referenceProject.slug;

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={"ref-project-wrap"}
      key={`ref-project-${referenceProject?.id}-wrap`}
    >
      <ReferenceProjectsNavbarEl
        key={`ref-project-${referenceProject?.id}`}
        active={isActive}
        handleClick={handleClick}
        selectedProjectIds={selectedProjectIds}
        handleSelectProject={handleSelectProject}
        allowSelection={allowSelection}
        orgSlug={currentOrgSlug}
        allowManage={allowManage}
        projectID={referenceProject?.id}
        projectName={referenceProject?.project_name}
        isCurrentUserAdmin={referenceProject?.current_user_is_admin ?? false}
        isPublic={referenceProject?.is_public}
        referenceProject={referenceProject}
        child={Boolean(child)}
        depth={depth}
        canEdit={canEdit}
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
              handleSelectProject,
              allowManage,
              handleClick,
              allowSelection,
              selectedProjectIds,
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
