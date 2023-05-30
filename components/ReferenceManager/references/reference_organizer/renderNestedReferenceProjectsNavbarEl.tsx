import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import ReferenceProjectsNavbarEl from "./ReferenceProjectsNavbarEl";
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";
import { NullableString } from "~/config/types/root_types";
import { useState } from "react";

type Args = {
  currentOrgSlug: string;
  referenceProject: any;
  activeProjectName: NullableString | string[];
  child: boolean;
  depth: number;
  childrenOpen: boolean;
  addChildrenOpen: ({ key, value }) => void;
  childrenOpenMap: {};
};

export function renderNestedReferenceProjectsNavbarEl({
  currentOrgSlug,
  referenceProject,
  activeProjectName,
  child,
  childrenOpen,
  depth = 0,
  addChildrenOpen,
  childrenOpenMap,
}: Args) {
  const hasChildren = !isEmpty(referenceProject.children);
  const isActive = activeProjectName === referenceProject.project_name;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ReferenceProjectsNavbarEl
        key={`ref-project-${referenceProject?.id}`}
        collaborators={(referenceProject?.editors ?? []).map((rawUser: any) =>
          parseUserSuggestion(rawUser)
        )}
        active={isActive}
        orgSlug={currentOrgSlug}
        projectID={referenceProject?.id}
        projectName={referenceProject?.project_name}
        isCurrentUserAdmin={referenceProject?.current_user_is_admin ?? false}
        isPublic={referenceProject?.is_public}
        referenceProject={referenceProject}
        child={child}
        depth={depth}
        isOpen={childrenOpenMap[referenceProject?.id]}
        addChildrenOpen={addChildrenOpen}
      />
      {hasChildren && childrenOpenMap[referenceProject?.id] && (
        <div
          style={{ marginLeft: 8, display: "flex", flexDirection: "column" }}
        >
          {referenceProject.children.map((childReferenceProject) => {
            return renderNestedReferenceProjectsNavbarEl({
              currentOrgSlug,
              referenceProject: childReferenceProject,
              activeProjectName,
              child: true,
              depth: depth + 1,
              addChildrenOpen,
              childrenOpenMap,
            });
          })}
        </div>
      )}
    </div>
  );
}
