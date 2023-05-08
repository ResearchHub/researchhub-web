import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import ReferenceProjectsNavbarEl from "./ReferenceProjectsNavbarEl";

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
        orgSlug={currentOrgSlug}
        projectID={referenceProject?.id}
        projectName={referenceProject?.project_name}
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
