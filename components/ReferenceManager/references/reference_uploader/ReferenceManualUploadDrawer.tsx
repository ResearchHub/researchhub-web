import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import {
  fetchReferenceCitationSchema,
  ReferenceSchemaValueSet,
} from "../api/fetchReferenceCitationSchema";
import { fetchReferenceCitationTypes } from "../api/fetchReferenceCitationTypes";
import { LEFT_MAX_NAV_WIDTH as LOCAL_LEFT_NAV_WIDTH } from "../../basic_page_layout/BasicTogglableNavbarLeft";
import { LEFT_SIDEBAR_MIN_WIDTH } from "~/components/Home/sidebar/RootLeftSidebar";
import { NAVBAR_HEIGHT as ROOT_NAVBAR_HEIGHT } from "~/components/Navbar";
import { NullableString } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { snakeCaseToNormalCase, toTitleCase } from "~/config/utils/string";
import ReferenceItemFieldSelect from "../reference_item/ReferenceItemFieldSelect";

const APPLICABLE_LEFT_NAV_WIDTH =
  LOCAL_LEFT_NAV_WIDTH + LEFT_SIDEBAR_MIN_WIDTH - 34;

type Props = {
  drawerProps: {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (flag: boolean) => void;
  };
};

function initComponentStates({
  referenceSchemaValueSet,
  setIsDrawerOpen,
  setReferenceSchemaValueSet,
}): void {
  setIsDrawerOpen(false);
  const resettedSchema = {};
  for (const key in referenceSchemaValueSet.schema) {
    resettedSchema[key] = null;
  }
  setReferenceSchemaValueSet({
    schema: resettedSchema,
    required: referenceSchemaValueSet.required,
  });
}

function useEffectPrepSchemas({
  setIsLoading,
  setReferenceSchemaValueSet,
  setReferenceTypes,
  setSelectedReferenceType,
}): void {
  useEffect((): void => {
    setIsLoading(true);
    fetchReferenceCitationTypes({
      onError: (error) => {
        alert(error);
      },
      onSuccess: (result) => {
        setReferenceTypes(result);
        const selectedReferenceType = result[0];
        setSelectedReferenceType(selectedReferenceType);
        fetchReferenceCitationSchema({
          citation_type: selectedReferenceType,
          onError: emptyFncWithMsg,
          onSuccess: ({ schema, required }): void => {
            setIsLoading(false);
            setReferenceSchemaValueSet({ schema, required });
          },
        });
      },
    });
  }, []);
}

export default function ReferenceManualUploadDrawer({
  drawerProps: { isDrawerOpen, setIsDrawerOpen },
}: Props): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [referenceTypes, setReferenceTypes] = useState<string[]>([]);
  const [selectedReferenceType, setSelectedReferenceType] =
    useState<NullableString>(null);
  const [referenceSchemaValueSet, setReferenceSchemaValueSet] =
    useState<ReferenceSchemaValueSet>({
      schema: {},
      required: [],
    });

  useEffectPrepSchemas({
    setIsLoading,
    setReferenceSchemaValueSet,
    setReferenceTypes,
    setSelectedReferenceType,
  });

  const formattedMenuItemProps = referenceTypes.map((refType: string) => ({
    label: snakeCaseToNormalCase(refType),
    value: refType,
  }));

  return (
    <Drawer
      anchor="left"
      BackdropProps={{ invisible: true }}
      onBackdropClick={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      onClose={(event: SyntheticEvent): void => {
        event.preventDefault();
        initComponentStates({
          referenceSchemaValueSet,
          setIsDrawerOpen,
          setReferenceSchemaValueSet,
        });
      }}
      sx={{
        width: "0",
        zIndex: 3 /* AppTopBar zIndex is 3 */,
        height: "100%",
      }}
    >
      <Box
        sx={{
          background: "rgba(250, 250, 252, 1)",
          borderLeft: `1px solid #e8e8ef`,
          boxSizing: "border-box",
          height: "100%",
          marginLeft: `${APPLICABLE_LEFT_NAV_WIDTH}px`,
          marginTop: `${ROOT_NAVBAR_HEIGHT}px`,
          padding: "16px 24px",
          width: "472px",
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          mb="24px"
          spacing={1}
        >
          <Typography variant="h6">{"Add entry manually"}</Typography>
          <CloseOutlinedIcon
            fontSize="small"
            color="disabled"
            onClick={(): void => setIsDrawerOpen(false)}
            sx={{ cursor: "pointer" }}
          />
        </Stack>
        <Box display="flex" flexDirection="column">
          <ReferenceItemFieldSelect
            formID="ref-type"
            label="Reference type"
            menuItemProps={formattedMenuItemProps}
            onChange={setSelectedReferenceType}
            placeholder="Select reference type"
            required
            value={selectedReferenceType}
          />
        </Box>
      </Box>
    </Drawer>
  );
}
