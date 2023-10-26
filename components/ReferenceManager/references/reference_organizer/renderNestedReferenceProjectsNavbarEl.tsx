import { isEmpty } from "~/config/utils/nullchecks";
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";
import ReferenceProjectsNavbarEl from "./ReferenceProjectsNavbarEl";
import { useRouter } from "next/router";
import { useReferenceActiveProjectContext } from "./context/ReferenceActiveProjectContext";

type Args = {
  addChildrenOpen: ({ key, value }) => void;
  child?: boolean;
  childrenOpenMap: {};
  currentOrgSlug: string;
  depth?: number;
  referenceProject: any;
  slug: string;
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
  slug,
}: Args) {
  const router = useRouter();
  const hasChildren = !isEmpty(referenceProject.children);
  const { activeProject, currentOrgProjects } =
    useReferenceActiveProjectContext();
  const isActive = router.query.slug?.slice(-1)[0] === referenceProject.slug;

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      key={`ref-project-${referenceProject?.id}-wrap`}
    >
      <ReferenceProjectsNavbarEl
        key={`ref-project-${referenceProject?.id}`}
        active={isActive}
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
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
      {hasChildren && childrenOpenMap[referenceProject?.id] && (
        <div
          style={{ marginLeft: 8, display: "flex", flexDirection: "column" }}
        >
          {referenceProject.children.map((childReferenceProject) => {
            return renderNestedReferenceProjectsNavbarEl({
              currentOrgSlug,
              referenceProject: childReferenceProject,
              child: true,
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
