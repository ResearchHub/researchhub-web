import { Button } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { convertHttpToHttps } from "~/config/utils/routing";
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
import {
  resolveFieldKeyLabels,
  sortSchemaFieldKeys,
} from "../utils/resolveFieldKeyLabels";
import { snakeCaseToNormalCase, toTitleCase } from "~/config/utils/string";
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
import ReferenceItemFieldInput from "../../form/ReferenceItemFieldInput";
import Stack from "@mui/material/Stack";
import ReferenceItemFieldCreatorTagInput from "../../form/ReferenceItemFieldCreatorTagInput";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import colors from "~/config/themes/colors";

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
  const {
    isDrawerOpen,
    referenceItemDatum,
    setIsDrawerOpen,
    setReferencesFetchTime,
  } = useReferenceTabContext();
  const { citation_type, id: citation_id } = referenceItemDatum ?? {};
  const [localReferenceFields, setLocalReferenceFields] = useState(
    referenceItemDatum?.fields ?? {}
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const hasAttachment = !isEmpty(referenceItemDatum?.attachment);
  const _requiredFieldsSet = useMemo(
    // NOTE: calvinhlee - this needs to be improved from BE
    () => new Set(referenceItemDatum?.required_fields ?? []),
    [referenceItemDatum?.id]
  );

  const { currentOrg } = useOrgs();
  useEffect((): void => {
    if (isEmpty(referenceItemDatum?.id) || !isDrawerOpen) {
      setLocalReferenceFields({});
    } else {
      setLocalReferenceFields(
        {
          ...referenceItemDatum?.fields,
          creators: referenceItemDatum?.fields?.creators
            .map((creator): string => {
              return `${creator.first_name} ${creator.last_name}`;
            })
            .join(", "),
        } ?? {}
      );
    }
  }, [referenceItemDatum?.id, isDrawerOpen]);

  const tabInputItems = filterNull(
    sortSchemaFieldKeys(Object.keys(localReferenceFields)).map(
      (field_key): ReactElement<typeof ReferenceItemFieldInput> | null => {
        let label = resolveFieldKeyLabels(field_key),
          value = localReferenceFields[field_key],
          isRequired = false;
        // isRequired = requiredFieldsSet.has(field_key);
        if (field_key === "raw_oa_json") {
          return null;
        }
        if (field_key === "creators") {
          return (
            <ReferenceItemFieldCreatorTagInput
              formID={field_key}
              key={`reference-item-tab-input-${field_key}`}
              label={label}
              onChange={(newValue: string[]): void => {
                setLocalReferenceFields({
                  ...localReferenceFields,
                  [field_key]: newValue.join(", "),
                });
              }}
              placeholder={label}
              required={isRequired}
              value={value.split(", ")}
            />
          );
        } else {
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
      }
    )
  );

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      onBackdropClick={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      sx={{
        width: "0",
        zIndex: 4 /* AppTopBar zIndex is 3 */,
        height: "100%",
      }}
    >
      <Box
        sx={{
          padding: "32px 24px 0",
          background: "rgb(250 250 252)",
          boxSizing: "border-box",
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
            {toTitleCase(snakeCaseToNormalCase(citation_type ?? ""))}
          </Typography>
        </Stack>
        {tabInputItems}
        {hasAttachment ? (
          <div
            style={{
              height: "20%",
              maxHeight: "20%",
              marginBottom: "440px",
            }}
          >
            <iframe
              height={"100%"}
              src={convertHttpToHttps(referenceItemDatum?.attachment)}
              width={"100%"}
            />
          </div>
        ) : null}
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        sx={{
          background: "rgb(250, 250, 252)",
          borderTop: "1px solid #E9EAEF",
          bottom: 0,
          boxSizing: "border-box",
          left: 0,
          minHeight: 60,
          padding: "0 24px",
          position: "sticky",
          width: "100%",
        }}
      >
        <div style={{ width: "88px" }}>
          <PrimaryButton
            disabled={isSubmitting}
            onClick={(event: SyntheticEvent): void => {
              event.preventDefault();
              setIsSubmitting(true);
              updateReferenceCitation({
                payload: {
                  // TODO: calvinhlee - create utily functions to format these
                  fields: {
                    ...localReferenceFields,
                    creators:
                      localReferenceFields.creators
                        ?.split(", ")
                        ?.map((creatorName) => {
                          const splittedName = creatorName.split(" ");
                          return {
                            first_name: splittedName[0],
                            last_name: splittedName.slice(1).join(" "),
                          };
                        }) ?? [],
                  },
                  citation_id,
                  citation_type,
                  organization: currentOrg.id,
                },
                onSuccess: () => {
                  setReferencesFetchTime(Date.now());
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setIsDrawerOpen(false);
                  }, 1000);
                },
                onError: emptyFncWithMsg,
              });
            }}
            size="large"
          >
            <Typography fontSize="14px" fontWeight="400">
              {isSubmitting ? (
                <ClipLoader color={colors.WHITE()} size={14} />
              ) : (
                "Update"
              )}
            </Typography>
          </PrimaryButton>
        </div>
        <div style={{ width: "88px", marginLeft: "16px" }}>
          <Button
            onClick={(event: SyntheticEvent): void => {
              event.preventDefault();
              setIsDrawerOpen(false);
            }}
            size="large"
            sx={{ textTransform: "none" }}
          >
            <Typography fontSize="14px" fontWeight="400">
              {"Cancel"}
            </Typography>
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
