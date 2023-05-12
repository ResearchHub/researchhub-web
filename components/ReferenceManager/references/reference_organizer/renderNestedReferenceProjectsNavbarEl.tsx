import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import ReferenceProjectsNavbarEl from "./ReferenceProjectsNavbarEl";
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";

type Args = {
  currentOrgSlug: string;
  referenceProject: any;
};

export function renderNestedReferenceProjectsNavbarEl({
  currentOrgSlug,
  referenceProject,
}: Args) {
  const hasChildren = !isEmpty(referenceProject.children);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ReferenceProjectsNavbarEl
        key={`ref-project-${referenceProject?.id}`}
        admins={(referenceProject?.admins ?? []).map((rawUser: any) =>
          parseUserSuggestion(rawUser)
        )}
        collaborators={(referenceProject?.editors ?? []).map((rawUser: any) =>
          parseUserSuggestion(rawUser)
        )}
        orgSlug={currentOrgSlug}
        projectID={referenceProject?.id}
        projectName={referenceProject?.project_name}
        isPublic={referenceProject?.is_public}
      />
      {hasChildren && (
        <div
          style={{ marginLeft: 8, display: "flex", flexDirection: "column" }}
        >
          {referenceProject.children.map((childReferenceProject) => {
            return renderNestedReferenceProjectsNavbarEl({
              currentOrgSlug,
              referenceProject: childReferenceProject,
            });
          })}
        </div>
      )}
    </div>
  );
}
