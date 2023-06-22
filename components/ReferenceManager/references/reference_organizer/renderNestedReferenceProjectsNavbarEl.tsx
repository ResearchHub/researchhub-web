import { isEmpty } from "~/config/utils/nullchecks";
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";
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
};

export function renderNestedReferenceProjectsNavbarEl({
  addChildrenOpen,
  child,
  childrenOpenMap,
  currentOrgSlug,
  depth = 0,
  referenceProject,
  slug,
}: Args) {
  const router = useRouter();
  const hasChildren = !isEmpty(referenceProject.children);
  const isActive =
    parseInt(router.query.root_project, 10) === referenceProject.id;

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      key={`ref-project-${referenceProject?.id}-wrap`}
    >
      <ReferenceProjectsNavbarEl
        key={`ref-project-${referenceProject?.id}`}
        collaborators={[
          // TODO: calvinhlee - clean this up from backend
          ...(referenceProject?.collaborators ?? []).editors.map(
            (rawUser: any) => {
              return { ...parseUserSuggestion(rawUser), role: "EDITOR" };
            }
          ),
          ...(referenceProject?.collaborators ?? []).viewers.map(
            (rawUser: any) => {
              return { ...parseUserSuggestion(rawUser), role: "VIEWER" };
            }
          ),
        ]}
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
              slug: `${slug}/${encodeURIComponent(
                childReferenceProject.project_name
              )}`,
            });
          })}
        </div>
      )}
    </div>
  );
}
