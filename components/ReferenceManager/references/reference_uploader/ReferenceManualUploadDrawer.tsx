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

const APPLICABLE_LEFT_NAV_WIDTH =
  LOCAL_LEFT_NAV_WIDTH + LEFT_SIDEBAR_MIN_WIDTH - 36;

type Props = {
  drawerProps: {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (flag: boolean) => void;
  };
};

export default function ReferenceManualUploadDrawer({
  drawerProps: { isDrawerOpen, setIsDrawerOpen },
}: Props): ReactElement {
  const [reference, setReference] = useState({});

  return (
    <Drawer
      anchor="left"
      BackdropProps={{ invisible: true }}
      onBackdropClick={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      sx={{
        width: "0",
        zIndex: 3 /* AppTopBar zIndex is 3 */,
        height: "100%",
      }}
    >
      <Box
        sx={{
          background: "rgba(250, 250, 252, 1)",
          width: "472px",
          height: "100%",
          marginTop: `${ROOT_NAVBAR_HEIGHT}px`,
          borderLeft: `1px solid #e8e8ef`,
          marginLeft: `${APPLICABLE_LEFT_NAV_WIDTH}px`,
        }}
      >
        HIHIHIHI
      </Box>
    </Drawer>
  );
}
