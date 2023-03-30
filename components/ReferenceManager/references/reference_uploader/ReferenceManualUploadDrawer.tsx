import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Drawer from "@mui/material/Drawer";

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
        zIndex: 4 /* AppTopBar zIndex is 3 */,
        background: "red",
      }}
    >
      "hihihi"
    </Drawer>
  );
}
