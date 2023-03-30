import {
  emptyFncWithMsg,
  filterNull,
  isEmpty,
} from "~/config/utils/nullchecks";
import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toTitleCase } from "~/config/utils/string";
import { Typography } from "@mui/material";
import { updateReferenceCitation } from "../api/updateReferenceCitation";
import { useReferenceTabContext } from "./context/ReferenceItemDrawerContext";
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
import PrimaryButton from "../../form/PrimaryButton";
import ReferenceItemFieldInput from "./ReferenceItemFieldInput";
import Stack from "@mui/material/Stack";

type Props = {};

const TAB_ITEM_FILTER_KEYS = new Set(["id", "citation_type"]);

const ReferenceItemDrawerButton = ({
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

export default function ReferenceItemDrawer({}: Props): ReactElement {
  const { isDrawerOpen, referenceItemDrawerData, setIsDrawerOpen } =
    useReferenceTabContext();

  const [localReferenceFields, setLocalReferenceFields] = useState(
    referenceItemDrawerData?.fields ?? {}
  );

  const requiredFieldsSet = useMemo(
    // NOTE: calvinhlee - this needs to be improved from BE
    () => new Set(referenceItemDrawerData?.required_fields ?? []),
    [referenceItemDrawerData?.id]
  );
  useEffect((): void => {
    if (isEmpty(referenceItemDrawerData?.id) || !isDrawerOpen) {
      setLocalReferenceFields({});
    } else {
      setLocalReferenceFields(referenceItemDrawerData?.fields ?? {});
    }
  }, [referenceItemDrawerData?.id, isDrawerOpen]);

  const tabInputItems = isDrawerOpen
    ? filterNull(
        // TODO: calvinhlee - we need better ways to sort these fields
        Object.keys(localReferenceFields)
          .sort()
          .map(
            (
              field_key
            ): ReactElement<typeof ReferenceItemFieldInput> | null => {
              const label = field_key,
                value = localReferenceFields[field_key],
                isRequired = requiredFieldsSet.has(field_key);
              return TAB_ITEM_FILTER_KEYS.has(field_key) ? null : (
                <ReferenceItemFieldInput
                  formID={field_key}
                  key={`reference-item-tab-input-${field_key}`}
                  label={label}
                  onChange={(newValue: string): void => {
                    setLocalReferenceFields({
                      ...localReferenceFields,
                      [field_key]: newValue,
                    });
                  }}
                  placeholder={label}
                  required={isRequired}
                  value={value}
                />
              );
            }
          )
      )
    : [];

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      onBackdropClick={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      // onClose={(event: SyntheticEvent): void => setIsDrawerOpen(false)}
      sx={{
        width: "0",
        zIndex: 4 /* AppTopBar zIndex is 3 */,
      }}
    >
      <Box
        padding="32px"
        sx={{
          background: "rgb(250 250 252)",
          width: "472px",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb="24px">
          <Stack direction="row" alignItems="center" spacing={1}>
            <ReferenceItemDrawerButton>
              <InfoOutlinedIcon fontSize="inherit" />
            </ReferenceItemDrawerButton>
            <ReferenceItemDrawerButton>
              <ChatOutlinedIcon fontSize="inherit" />
            </ReferenceItemDrawerButton>
            <ReferenceItemDrawerButton>
              <HistoryOutlinedIcon fontSize="inherit" />
            </ReferenceItemDrawerButton>
            <ReferenceItemDrawerButton>
              <LockOutlinedIcon fontSize="inherit" />
            </ReferenceItemDrawerButton>
            <ReferenceItemDrawerButton>
              <FileUploadOutlinedIcon fontSize="inherit" />
            </ReferenceItemDrawerButton>
            <ReferenceItemDrawerButton>
              <MoreHorizOutlinedIcon fontSize="inherit" />
            </ReferenceItemDrawerButton>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            width="100%"
          >
            <ReferenceItemDrawerButton
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <CloseOutlinedIcon fontSize="inherit" />
            </ReferenceItemDrawerButton>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mb="24px">
          <Typography variant="h5" fontWeight="bold">
            {toTitleCase(referenceItemDrawerData?.citation_type ?? "")}
          </Typography>
        </Stack>

        {tabInputItems}
        <Box alignItems="center" display="flex" justifyContent="center">
          <PrimaryButton
            margin="0 0 32px 0"
            onClick={(event: SyntheticEvent): void => {
              event.preventDefault();
              updateReferenceCitation({
                payload: localReferenceFields,
                onSuccess: emptyFncWithMsg,
                onError: emptyFncWithMsg,
              });
            }}
            size="large"
          >
            {"Update"}
          </PrimaryButton>
        </Box>
      </Box>
    </Drawer>
  );
}
