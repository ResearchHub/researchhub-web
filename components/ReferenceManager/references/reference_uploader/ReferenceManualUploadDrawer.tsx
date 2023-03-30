import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { NAVBAR_HEIGHT as ROOT_NAVBAR_HEIGHT } from "~/components/Navbar";
import { LEFT_MAX_NAV_WIDTH as LOCAL_LEFT_NAV_WIDTH } from "../../basic_page_layout/BasicTogglableNavbarLeft";
import { LEFT_SIDEBAR_MIN_WIDTH } from "~/components/Home/sidebar/RootLeftSidebar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { NullableString } from "~/config/types/root_types";

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
  const resettedSchemaSet = {};
  for (const key in referenceSchemaValueSet) {
    resettedSchemaSet[key] = null;
  }
  setReferenceSchemaValueSet(resettedSchemaSet);
  console.warn("initComponentStates");
}

function useEffectPrepSchemas({
  setIsLoading,
  setReferenceSchemaValueSet,
  setReferenceTypes,
  setSelectedReferenceType,
}): void {
  useEffect((): void => {
    setIsLoading(true);

    console.warn("useEffectPrepSchemas");
  }, []);
}

export default function ReferenceManualUploadDrawer({
  drawerProps: { isDrawerOpen, setIsDrawerOpen },
}: Props): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [referenceTypes, setReferenceTypes] = useState<string[] | null>(null);
  const [selectedReferenceType, setSelectedReferenceType] =
    useState<NullableString>(null);
  const [referenceSchemaValueSet, setReferenceSchemaValueSet] = useState({});

  useEffectPrepSchemas({
    setIsLoading,
    setReferenceSchemaValueSet,
    setReferenceTypes,
    setSelectedReferenceType,
  });

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
      </Box>
    </Drawer>
  );
}
