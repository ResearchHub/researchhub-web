import { ReactElement, SyntheticEvent } from "react";
import {
  ReferenceItemDataType,
  useReferenceTabContext,
} from "../context/ReferencesTabContext";
import { filterNull } from "~/config/utils/nullchecks";
import { KeyOf } from "~/config/types/root_types";
import { toTitleCase } from "~/config/utils/string";
import { Typography } from "@mui/material";
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

type Props = {};
type ReferenceItemDataTypeKey = KeyOf<ReferenceItemDataType>;

const TAB_ITEM_FILTER_KEYS = new Set(["id"]);
const TAB_ITEM_LABELS: {
  [K in ReferenceItemDataTypeKey]: string;
} = {
  id: "", // columnVisibilityModel: hidden
  citation_type: "", // columnVisibilityModel: hidden
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
  const {
    isTabOpen,
    referenceItemTabData,
    setIsTabOpen,
    setReferenceItemTabData,
  } = useReferenceTabContext();

  const tabInputItems = filterNull(
    Object.keys(referenceItemTabData).map(
      (field_key): ReactElement<typeof ReferenceItemFieldInput> | null => {
        if (field_key === "citation_type") {
          return null;
        }
        const label = TAB_ITEM_LABELS[field_key];
        return TAB_ITEM_FILTER_KEYS.has(field_key) ? null : (
          <ReferenceItemFieldInput
            formID={field_key}
            key={`reference-item-tab-input-${field_key}`}
            label={label}
            onChange={(value: string): void => {
              setReferenceItemTabData({
                ...referenceItemTabData,
                [field_key]: value,
              });
            }}
            value={referenceItemTabData[field_key]}
          />
        );
      }
    )
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
        zIndex: 4 /* AppTopBar zIndex is 3 */,
      }}
    >
      <Box
        padding="32px"
        sx={{
          background: "rgb(250 250 252)",
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
        <Stack direction="row" alignItems="center" spacing={1} mb="24px">
          <Typography variant="h5" fontWeight="bold">
            {toTitleCase(referenceItemTabData?.citation_type ?? "")}
          </Typography>
        </Stack>
        <Box>{tabInputItems}</Box>
      </Box>
    </Drawer>
  );
}
