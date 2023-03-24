import { getBEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { scopeOptions } from "../constants/UnifiedDocFilters";
import { SelectedUrlFilters } from "./getSelectedUrlFilters";

type Args = {
  frontendFilters: SelectedUrlFilters;
};

export const convertToBackendFilters = ({
  frontendFilters,
}: Args): SelectedUrlFilters => {
  return {
    ...frontendFilters,
    type: getBEUnifiedDocType(frontendFilters.type),
    ...(frontendFilters.time && { time: scopeOptions[frontendFilters.time].valueForApi }),
  }
};
