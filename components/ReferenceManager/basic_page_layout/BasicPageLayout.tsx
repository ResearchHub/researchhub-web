import { ReactNode, useState } from "react";
import { useTheme } from "@mui/material/styles";
import AppTopBar, { APP_PADDING_LEFT, TOP_BAR_HEIGHT } from "./AppTopBar";
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

type Props = { children: ReactNode };

export default function BasicPageLayout({ children }: Props) {
  const theme = useTheme();
  const [isLeftNavOpen, setIsLeftNavOpen] = useState(true);

  const leftNavWidth = isLeftNavOpen ? LEFT_MAX_NAV_WIDTH : LEFT_MIN_NAV_WIDTH;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppTopBar
        appPaddingLeft={APP_PADDING_LEFT}
        isLeftNavOpen={isLeftNavOpen}
        navNavWidth={leftNavWidth}
        position="fixed"
        theme={theme}
      >
        <Box
          className="TopBarRightSection"
          sx={{
            alignItems: "center",
            display: "flex",
            height: 40,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            color="black"
            fontSize={16}
            fontWeight={600}
            noWrap
            textAlign="center"
          >
            {/* {"Crispr Therapeutics Inc."} */}
          </Typography>
          <Box
            className="TopBarRightSection"
            sx={{
              alignItems: "center",
              color: "rgba(124, 121, 137, 1)",
              display: "flex",
              height: 40,
              justifyContent: "space-between",
              opacity: ".9",
              width: 220,
            }}
          >
            <Person2Icon fontSize="small" />
            <Typography noWrap fontSize={13} fontWeight={500}>
              {"Share"}
            </Typography>
            <ChatOutlinedIcon fontSize="small" />
            <HistoryIcon fontSize="small" />
            <MoreHorizIcon fontSize="small" />
          </Box>
        </Box>
      </AppTopBar>
      {/* <BasicTogglableNavbarLeft
        isOpen={isLeftNavOpen}
        navWidth={leftNavWidth}
        setIsOpen={setIsLeftNavOpen}
        theme={theme}
      /> */}
      <BasicAppMain
        appPaddingLeft={APP_PADDING_LEFT}
        isLeftNavOpen={isLeftNavOpen}
        leftNavWidth={leftNavWidth}
        theme={theme}
        topBarHeight={TOP_BAR_HEIGHT}
      >
        {children}
      </BasicAppMain>
    </Box>
  );
}
