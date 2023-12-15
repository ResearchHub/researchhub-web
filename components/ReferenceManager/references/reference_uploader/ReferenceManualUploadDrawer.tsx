import { Button } from "@mui/material";
import { ClipLoader } from "react-spinners";
import {
  handleSubmit,
  useEffectOnReferenceTypeChange,
  parseDoiSearchResultOntoValueSet,
} from "./reference_upload_utils";
import { isEmpty } from "~/config/utils/nullchecks";
import { NAVBAR_HEIGHT as ROOT_NAVBAR_HEIGHT } from "~/components/Navbar";
import {
  ReactElement,
  SyntheticEvent,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  resolveFieldKeyLabels,
  sortSchemaFieldKeys,
} from "../utils/resolveFieldKeyLabels";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useReferenceTabContext } from "../reference_item/context/ReferenceItemDrawerContext";
import { useReferenceUploadDrawerContext } from "./context/ReferenceUploadDrawerContext";
import Box from "@mui/material/Box";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Drawer from "@mui/material/Drawer";
import PrimaryButton from "../../form/PrimaryButton";
import ReferenceDoiSearchInput from "../../form/ReferenceDoiSearchInput";
import ReferenceItemFieldCreatorTagInput from "../../form/ReferenceItemFieldCreatorTagInput";
import ReferenceItemFieldInput from "../../form/ReferenceItemFieldInput";
import ReferenceTypeSelect from "../../form/ReferenceTypeSelect";
import ReferenceUploadAttachments from "../../form/ReferenceUploadAttachments";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useReferenceActiveProjectContext } from "../reference_organizer/context/ReferenceActiveProjectContext";
import { useReferencesTableContext } from "../reference_table/context/ReferencesTableContext";

export default function ReferenceManualUploadDrawer(): ReactElement {
  const { setReferencesFetchTime } = useReferenceTabContext();
  const {
    isDrawerOpen,
    projectID,
    referenceSchemaValueSet,
    selectedReferenceType,
    setIsDrawerOpen,
    setProjectID,
    setReferenceSchemaValueSet,
    setSelectedReferenceType,
  } = useReferenceUploadDrawerContext();
  const { addSingleReference } = useReferencesTableContext();
  const { projectID: activeProjectID } =
    useReferenceActiveProjectContext()?.activeProject ?? {};
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [calculatedLeftMargin, setCalculatedLeftMargin] = useState<number>(0);
  const { currentOrg } = useOrgs();

  const resetComponentState = useCallback((): void => {
    setIsLoading(false);
    setIsSubmitting(false);
    const resettedSchema = {};
    // NOTE: preserving schema like this saves a BE call.
    for (const key in referenceSchemaValueSet.schema) {
      resettedSchema[key] = "";
    }
    setReferenceSchemaValueSet({
      attachment: null,
      schema: resettedSchema,
      required: referenceSchemaValueSet.required,
    });
    setIsDrawerOpen(false);
    setProjectID(null);
    setSelectedReferenceType("");
  }, [isDrawerOpen]);

  useEffectOnReferenceTypeChange({
    prevRefSchemaValueSet: referenceSchemaValueSet,
    selectedReferenceType,
    setIsLoading,
    setReferenceSchemaValueSet,
  });

  useEffect(() => {
    const rootLeftSidebarWidth =
      document.querySelector(".root-left-sidebar")?.clientWidth || 0;
    const refManagerNavbarWidth =
      document.querySelector(".ToggleableNavbarLeft")?.clientWidth || 0;
    setCalculatedLeftMargin(rootLeftSidebarWidth + refManagerNavbarWidth + 2);
  }, [isDrawerOpen]);

  const formattedSchemaInputs = [
    <ReferenceTypeSelect
      formID="ref-type"
      key="ref-type"
      label="Reference type"
      fireOnChangeOnLoad
      onChange={setSelectedReferenceType}
      required
      value={selectedReferenceType}
    />,
    ...sortSchemaFieldKeys(Object.keys(referenceSchemaValueSet.schema)).map(
      (schemaField: string) => {
        const label = resolveFieldKeyLabels(schemaField),
          schemaFieldValue = referenceSchemaValueSet.schema[schemaField],
          isRequired = false;

        const onChange = (newValue: string): void => {
          setReferenceSchemaValueSet({
            attachment: referenceSchemaValueSet.attachment,
            schema: {
              ...referenceSchemaValueSet.schema,
              [schemaField]: newValue,
            },
            required: referenceSchemaValueSet.required,
          });
        };
        if (
          schemaField === "pdf_url" ||
          schemaField === "custom" ||
          schemaField === "signed_pdf_url"
        ) {
          return null;
        }
        if (schemaField === "author") {
          return (
            <ReferenceItemFieldCreatorTagInput
              disabled={isSubmitting || isLoading}
              formID={schemaField}
              key={`reference-manual-upload-field-${schemaField}`}
              label={label}
              onChange={onChange}
              placeholder={label}
              required={isRequired}
              value={isEmpty(schemaFieldValue) ? [] : schemaFieldValue}
            />
          );
        } else {
          return (
            <ReferenceItemFieldInput
              disabled={isSubmitting || isLoading}
              formID={schemaField}
              key={`reference-manual-upload-field-${schemaField}`}
              label={label}
              onChange={onChange}
              multiline={schemaField === "abstract"}
              placeholder={label}
              required={isRequired}
              value={schemaFieldValue}
            />
          );
        }
      }
    ),
  ];

  return (
    <Drawer
      anchor="left"
      BackdropProps={{ invisible: true }}
      onBackdropClick={(event: SyntheticEvent): void => {
        event.preventDefault();
        resetComponentState();
      }}
      open={isDrawerOpen}
      onClose={(event: SyntheticEvent): void => {
        event.preventDefault();
        resetComponentState();
      }}
      sx={{
        width: "0",
        zIndex: 3 /* AppTopBar zIndex is 5 */,
        height: "100%",
      }}
    >
      <Box
        sx={{
          background: "rgba(250, 250, 252, 1)",
          boxSizing: "border-box",
          marginLeft: `${calculatedLeftMargin}px`,
          marginTop: `${ROOT_NAVBAR_HEIGHT}px`,
          paddingBottom: "0px",
          position: "relative",
          width: "472px",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={1}
          sx={{
            background: "rgba(250, 250, 252, 1)",
            borderBottom: "1px solid #E9EAEF",
            height: "40px",
            padding: "16px 24px",
            position: "sticky",
            top: `0px`,
            zIndex: 4,
          }}
        >
          <Typography variant="h6">{"Manual Entry"}</Typography>
          <CloseOutlinedIcon
            fontSize="small"
            color="disabled"
            onClick={(): void => resetComponentState()}
            sx={{ cursor: "pointer" }}
          />
        </Stack>
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            height: "calc(88% - 70px) " /* 70 is the height of footer */,
            padding: "16px 24px",
            overflow: "auto",
            marginBottom: "100px",
          }}
        >
          <Box sx={{ borderBottom: `1px solid #E9EAEF` }} mb="14px">
            <ReferenceDoiSearchInput
              onSearchSuccess={(doiMetaData: any): void => {
                // setSelectedReferenceType(
                //   // ReferenceTypeSelect will sanity check for us
                //   doiMetaData?.type.replace("-", "_")?.toUpperCase()
                // );
                parseDoiSearchResultOntoValueSet({
                  doiMetaData,
                  setReferenceSchemaValueSet,
                  referenceSchemaValueSet,
                });
              }}
            />
            <ReferenceUploadAttachments
              onFileSelect={(attachment: File | null): void => {
                setReferenceSchemaValueSet({
                  attachment,
                  schema: {
                    ...referenceSchemaValueSet.schema,
                    title: isEmpty(referenceSchemaValueSet.schema.title)
                      ? attachment?.name?.split(".pdf")[0] ?? ""
                      : referenceSchemaValueSet.schema.title,
                  },
                  required: referenceSchemaValueSet.required,
                });
              }}
              fileURL={referenceSchemaValueSet.signedUrl}
              selectedFile={referenceSchemaValueSet.attachment}
            />
          </Box>
          {formattedSchemaInputs}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          position="sticky"
          bottom="0px"
          padding="16px 24px"
          width="100%"
          sx={{
            background: "rgb(250, 250, 252)",
            borderTop: "1px solid #E9EAEF",
            left: 0,
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: "88px" }}>
            <PrimaryButton
              onClick={(event: SyntheticEvent): void =>
                handleSubmit({
                  addSingleReference,
                  event,
                  referenceSchemaValueSet,
                  resetComponentState,
                  selectedReferenceType,
                  setIsSubmitting,
                  setReferencesFetchTime,
                  organizationID: currentOrg?.id,
                  projectID: projectID ?? activeProjectID,
                })
              }
              size="large"
              disabled={false}
            >
              <Typography fontSize="14px" fontWeight="400">
                {isSubmitting ? (
                  <ClipLoader color="#fff" size={14} />
                ) : (
                  "Add entry"
                )}
              </Typography>
            </PrimaryButton>
          </div>
          <div style={{ width: "88px", marginLeft: "16px" }}>
            <Button
              onClick={(event: SyntheticEvent): void => {
                event.preventDefault();
                resetComponentState();
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
      </Box>
    </Drawer>
  );
}
