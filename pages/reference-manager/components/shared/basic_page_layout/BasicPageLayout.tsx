import { ReactNode, useState } from "react";
import { useTheme } from "@mui/material/styles";
import BasicAppMain from "./BasicAppMain";
import BasicTogglableNavbarLeft, {
  LEFT_MAX_NAV_WIDTH,
  LEFT_MIN_NAV_WIDTH,
} from "./BasicTogglableNavbarLeft";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HistoryIcon from "@mui/icons-material/History";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Person2Icon from "@mui/icons-material/Person2";
import Container from "@mui/material/Container"

type Props = { children: ReactNode };

export default function BasicPageLayout({ children }: Props) {
  const theme = useTheme();
  const [isLeftNavOpen, setIsLeftNavOpen] = useState(true);

  const leftNavWidth = isLeftNavOpen ? LEFT_MAX_NAV_WIDTH : LEFT_MIN_NAV_WIDTH;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <BasicTogglableNavbarLeft
        isOpen={isLeftNavOpen}
        navWidth={leftNavWidth}
        setIsOpen={setIsLeftNavOpen}
        theme={theme}
      />
      <BasicAppMain
        appPaddingLeft={"24px"}
        isLeftNavOpen={isLeftNavOpen}
        leftNavWidth={leftNavWidth}
        theme={theme}
      >
        {children}
      </BasicAppMain>
    </Box>
  );
}
