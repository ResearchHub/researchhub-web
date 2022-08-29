import { getBEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { SelectedUrlFilters } from "./getSelectedUrlFilters";

type Args = {
  frontendFilters: SelectedUrlFilters;
};

export const convertToBackendFilters = ({
  frontendFilters,
}: Args): SelectedUrlFilters => {
  const backendFilters = { ...frontendFilters };
  backendFilters.type = getBEUnifiedDocType(frontendFilters.type);
  return backendFilters;
};
