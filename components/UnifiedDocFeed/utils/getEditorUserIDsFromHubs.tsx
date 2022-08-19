import { ID } from "~/config/types/root_types";
import { filterNull } from "~/config/utils/nullchecks";

export function getEditorUserIDsFromHubs(hubs: any[]): ID[] {
  const result: ID[] = [];
  hubs.forEach((hub: any) => {
    (hub.editor_permission_groups ?? []).forEach(
      (permission_group: any): void => {
        result.push(permission_group.user?.id ?? null);
      }
    );
  });
  return filterNull(result);
}

export function isUserEditorOfHubs({
  currUserID,
  hubs,
}: {
  currUserID: ID;
  hubs: any[];
}): boolean {
  return getEditorUserIDsFromHubs(hubs).includes(currUserID);
}
