import { ReactElement, SyntheticEvent } from "react";
import {
  ReferenceItemDataType,
  useReferenceTabContext,
} from "../context/ReferencesTabContext";
import Box from "@mui/material/Box";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Drawer from "@mui/material/Drawer";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ReferenceItemFieldInput from "./ReferenceItemFieldInput";
import Stack from "@mui/material/Stack";
import { KeyOf } from "~/config/types/root_types";

type Props = {};
type ReferenceItemDataTypeKey = KeyOf<ReferenceItemDataType>;

const TAB_ITEM_FILTER_KEYS = new Set(["id"]);
const TAB_ITEM_LABELS: {
  [K in ReferenceItemDataTypeKey]: string;
} = {
  id: "",
  title: "Title",
  hubs: "Hubs",
  authors: "Authors",
  last_author: "Last Author",
  published_date: "Published Date",
  published_year: "Published Year",
};

const ReferenceItemTabIconButton = ({
  children,
  onClick,
}: {
  children: any;
  onClick?: (event: SyntheticEvent) => void;
}) => {
  return (
    <IconButton
      size="small"
      sx={{ maxWidth: "24px", maxHeight: "24px", padding: "16px" }}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
};

export default function ReferenceItemTab({}: Props): ReactElement {
  const { isTabOpen, referenceItemData, setIsTabOpen, setReferenceItemData } =
    useReferenceTabContext();
  const tabInputItems = Object.keys(referenceItemData).map(
    (field_key): ReactElement<typeof ReferenceItemFieldInput> | null => {
      const label = TAB_ITEM_LABELS[field_key];
      return TAB_ITEM_FILTER_KEYS.has(field_key) ? null : (
        <ReferenceItemFieldInput
          formID={field_key}
          key={`reference-item-tab-input-${field_key}`}
          label={label}
          onChange={(value: string): void => {
            setReferenceItemData({ ...referenceItemData, [field_key]: value });
          }}
          value={referenceItemData[field_key]}
        />
      );
    }
  );

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      onBackdropClick={() => setIsTabOpen(false)}
      open={isTabOpen}
      // onClose={(event: SyntheticEvent): void => setIsTabOpen(false)}
      sx={{
        width: "0",
        zIndex: 3 /* AppTopBar zIndex is 3 */,
      }}
    >
      <Box
        padding="32px"
        sx={{
          background: "rgb(243 243 246)",
          height: "100%",
          width: "472px",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb="24px">
          <Stack direction="row" alignItems="center" spacing={1}>
            <ReferenceItemTabIconButton>
              <InfoOutlinedIcon fontSize="inherit" />
            </ReferenceItemTabIconButton>
            <ReferenceItemTabIconButton>
              <ChatOutlinedIcon fontSize="inherit" />
            </ReferenceItemTabIconButton>
            <ReferenceItemTabIconButton>
              <HistoryOutlinedIcon fontSize="inherit" />
            </ReferenceItemTabIconButton>
            <ReferenceItemTabIconButton>
              <LockOutlinedIcon fontSize="inherit" />
            </ReferenceItemTabIconButton>
            <ReferenceItemTabIconButton>
              <FileUploadOutlinedIcon fontSize="inherit" />
            </ReferenceItemTabIconButton>
            <ReferenceItemTabIconButton>
              <MoreHorizOutlinedIcon fontSize="inherit" />
            </ReferenceItemTabIconButton>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            width="100%"
          >
            <ReferenceItemTabIconButton
              onClick={() => {
                setIsTabOpen(false);
              }}
            >
              <CloseOutlinedIcon fontSize="inherit" />
            </ReferenceItemTabIconButton>
          </Stack>
        </Stack>
        <Box>{tabInputItems}</Box>
      </Box>
    </Drawer>
  );
}
