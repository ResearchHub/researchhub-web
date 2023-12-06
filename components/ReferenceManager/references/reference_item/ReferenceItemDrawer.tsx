import { Button, Typography } from "@mui/material";
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
import { datePartsToDateString } from "../utils/formatCSLDate";
import { snakeCaseToNormalCase, toTitleCase } from "~/config/utils/string";
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
import dayjs from "dayjs";
import { useReferencesTableContext } from "../reference_table/context/ReferencesTableContext";
import ReferenceItemFieldAttachment from "../../form/ReferenceItemFieldAttachment";
import ReferenceTypeSelect from "../../form/ReferenceTypeSelect";

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
    setReferenceItemDatum,
  } = useReferenceTabContext();

  const { citation_type, id: citation_id } = referenceItemDatum ?? {};
  const [localReferenceFields, setLocalReferenceFields] = useState(
    referenceItemDatum?.fields ?? {}
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [attachmentURL, setAttachmentURL] = useState<string | null>(
    referenceItemDatum?.attachment ?? null
  );
  const { setReferenceTableRowData, referenceTableRowData } =
    useReferencesTableContext();

  const { currentOrg } = useOrgs();
  useEffect((): void => {
    if (isEmpty(referenceItemDatum?.id) || !isDrawerOpen) {
      setLocalReferenceFields({});
    } else {
      setLocalReferenceFields(
        {
          ...referenceItemDatum?.fields,
          author: referenceItemDatum?.fields?.author
            .map((creator): string => {
              return `${creator.given || ""} ${creator.family || ""}`.trim();
            })
            .join(", "),
        } ?? {}
      );
      setAttachmentURL(referenceItemDatum?.attachment ?? null);
    }
  }, [referenceItemDatum?.id, isDrawerOpen]);

  const sortedSchemaKeys = sortSchemaFieldKeys(
    Object.keys(localReferenceFields)
  );

  const tabInputItems = filterNull(
    sortedSchemaKeys.map(
      (field_key): ReactElement<typeof ReferenceItemFieldInput> | null => {
        let issued;
        const label = resolveFieldKeyLabels(field_key),
          value =
            field_key === "issued"
              ? (issued = dayjs(
                  datePartsToDateString(localReferenceFields[field_key])
                ).format("M-D-YYYY")) === "Invalid Date"
                ? null
                : issued
              : localReferenceFields[field_key],
          isRequired = false;
        // isRequired = requiredFieldsSet.has(field_key);
        if (field_key === "type") {
          return (
            <ReferenceTypeSelect
              formID="ref-type"
              key="ref-type"
              label="Reference type"
              onChange={(val) => {
                const newReferenceFields = { ...localReferenceFields };
                newReferenceFields["type"] = val;
                setLocalReferenceFields(newReferenceFields);
                const newReferenceItemDatum = {
                  ...referenceItemDatum,
                  citation_type: val,
                  fields: newReferenceFields,
                };
                setReferenceItemDatum(newReferenceItemDatum);
              }}
              required
              value={referenceItemDatum.citation_type}
            />
          );
        }
        if (field_key === "pdf_url" || field_key === "custom") {
          return null;
        }

        if (field_key === "author") {
          return (
            <ReferenceItemFieldCreatorTagInput
              formID={field_key}
              key={`reference-item-tab-input-${field_key}`}
              label={label}
              onChange={(newValue: string[]): void => {
                const updatedFields = {
                  ...localReferenceFields,
                  [field_key]: newValue.join(", "),
                };
                setLocalReferenceFields(updatedFields);
                const newReferenceItemDatum = {
                  ...referenceItemDatum,
                  fields: updatedFields,
                };
                setReferenceItemDatum(newReferenceItemDatum);
              }}
              placeholder={label}
              required={isRequired}
              value={value && !!value.length && value?.split(", ")}
            />
          );
        } else {
          return TAB_ITEM_FILTER_KEYS.has(field_key) ? null : (
            <ReferenceItemFieldInput
              formID={field_key}
              key={`reference-item-tab-input-${field_key}`}
              label={label}
              multiline={field_key === "abstract"}
              onChange={(newValue: string): void => {
                const updatedFields = {
                  ...localReferenceFields,
                  [field_key]: newValue,
                };
                setLocalReferenceFields(updatedFields);
                const newReferenceItemDatum = {
                  ...referenceItemDatum,
                  fields: updatedFields,
                };
                setReferenceItemDatum(newReferenceItemDatum);
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
        zIndex: 6 /* AppTopBar zIndex is 3 */,
        height: "100%",
      }}
    >
      <Box
        className={"reference-item-drawer"}
        sx={{
          padding: "32px 24px 0",
          background: "rgb(250 250 252)",
          boxSizing: "border-box",
          width: "472px",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* <Stack direction="row" alignItems="center" spacing={1}>
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
          </Stack> */}
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            width="100%"
            position="absolute"
            top="24px"
            right="24px"
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
        <ReferenceItemFieldAttachment
          attachmentURL={attachmentURL}
          onRemoveAttachment={() => {
            updateReferenceCitation({
              orgId: currentOrg?.id,
              payload: {
                fields: {
                  // use existing reference fields (since we don't want to update them in this request)
                  ...referenceItemDatum?.fields,
                  author: referenceItemDatum?.fields.author ?? [],
                  // set fields.attachment to null
                  attachment: null,
                },
                // set attachment to null
                attachment: null,
                citation_id,
                citation_type,
                organization: currentOrg?.id,
              },
              onSuccess: (res) => {
                const newReferenceTableRowData = [...referenceTableRowData].map(
                  (reference) => {
                    if (reference.id === referenceItemDatum.id) {
                      return res;
                    } else {
                      return reference;
                    }
                  }
                );
                setReferenceTableRowData(newReferenceTableRowData);
                setAttachmentURL(null);
              },
              onError: emptyFncWithMsg,
            });
          }}
        />
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
          zIndex: 7,
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
                orgId: currentOrg?.id,
                payload: {
                  // TODO: calvinhlee - create utily functions to format these
                  fields: {
                    ...localReferenceFields,
                    author:
                      localReferenceFields.author
                        ?.split(", ")
                        ?.map((creatorName) => {
                          const splittedName = creatorName.split(" ");
                          return {
                            given: splittedName[0],
                            family: splittedName.slice(1).join(" "),
                          };
                        }) ?? [],
                  },
                  citation_id,
                  citation_type,
                  organization: currentOrg?.id,
                },
                onSuccess: (res) => {
                  const newReferenceTableRowData = [
                    ...referenceTableRowData,
                  ].map((reference, index) => {
                    if (reference.id === referenceItemDatum.id) {
                      return res;
                    } else {
                      return reference;
                    }
                  });
                  setReferenceTableRowData(newReferenceTableRowData);
                  setIsSubmitting(false);
                  setIsDrawerOpen(false);
                },
                onError: emptyFncWithMsg,
              });
            }}
            size="large"
          >
            <Typography fontSize="14px" fontWeight="400">
              {isSubmitting ? <ClipLoader color="#fff" size={14} /> : "Update"}
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
