import {
  DEFAULT_REF_SCHEMA_SET,
  ReferenceSchemaValueSet,
} from "./reference_default_schemas";
import { Button } from "@mui/material";
import { ClipLoader } from "react-spinners";
import {
  handleSubmit,
  useEffectOnReferenceTypeChange,
  parseDoiSearchResultOntoValueSet,
} from "./reference_upload_utils";
import { isEmpty } from "~/config/utils/nullchecks";
import { LEFT_MAX_NAV_WIDTH as LOCAL_LEFT_NAV_WIDTH } from "../../basic_page_layout/BasicTogglableNavbarLeft";
import { LEFT_SIDEBAR_MIN_WIDTH } from "~/components/Home/sidebar/RootLeftSidebar";
import { NAVBAR_HEIGHT as ROOT_NAVBAR_HEIGHT } from "~/components/Navbar";
import { NullableString } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState, useCallback } from "react";
import {
  resolveFieldKeyLabels,
  sortSchemaFieldKeys,
} from "../utils/resolveFieldKeyLabels";
import { snakeCaseToNormalCase } from "~/config/utils/string";
import { useReferenceTabContext } from "../reference_item/context/ReferenceItemDrawerContext";
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
import { useOrgs } from "~/components/contexts/OrganizationContext";

const CALCULATED_LEFT_MARGIN =
  LOCAL_LEFT_NAV_WIDTH /* Reference Manager left nav */ +
  LEFT_SIDEBAR_MIN_WIDTH /* Researchhub web left nav*/ +
  2; /* arbitrary border "breather" */

type Props = {
  drawerProps: {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (flag: boolean) => void;
  };
};

export default function ReferenceManualUploadDrawer({
  drawerProps: { isDrawerOpen, setIsDrawerOpen },
}: Props): ReactElement {
  const { setReferencesFetchTime } = useReferenceTabContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedReferenceType, setSelectedReferenceType] =
    useState<NullableString>("");
  const [referenceSchemaValueSet, setReferenceSchemaValueSet] =
    useState<ReferenceSchemaValueSet>(DEFAULT_REF_SCHEMA_SET);

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
    setSelectedReferenceType("");
  }, [
    referenceSchemaValueSet,
    referenceSchemaValueSet.schema,
    referenceSchemaValueSet.required,
  ]);

  useEffectOnReferenceTypeChange({
    prevRefSchemaValueSet: referenceSchemaValueSet,
    selectedReferenceType,
    setIsLoading,
    setReferenceSchemaValueSet,
  });

  const formattedSchemaInputs = [
    <ReferenceTypeSelect
      formID="ref-type"
      key="ref-type"
      label="Reference type"
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
        if (schemaField === "creators") {
          return (
            <ReferenceItemFieldCreatorTagInput
              disabled={isSubmitting || isLoading}
              formID={schemaField}
              key={`reference-manual-upload-field-${schemaField}`}
              label={label}
              onChange={onChange}
              placeholder={label}
              required={isRequired}
              value={schemaFieldValue}
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
          borderLeft: "1px solid #E9EAEF",
          boxSizing: "border-box",
          marginLeft: `${CALCULATED_LEFT_MARGIN}px`,
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
          <Typography variant="h6">{"Upload reference"}</Typography>
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
            overflow: "scroll",
            marginBottom: "100px",
          }}
        >
          <Box sx={{ borderBottom: `1px solid #E9EAEF` }} mb="14px">
            <ReferenceDoiSearchInput
              onSearchSuccess={(doiMetaData: any): void => {
                setSelectedReferenceType(
                  // ReferenceTypeSelect will sanity check for us
                  doiMetaData?.type.replace("-", "_")?.toUpperCase()
                );
                parseDoiSearchResultOntoValueSet({
                  doiMetaData,
                  setReferenceSchemaValueSet,
                  referenceSchemaValueSet,
                });
              }}
            />
            <ReferenceUploadAttachments
              onFileSelect={(attachment: File | null): void =>
                setReferenceSchemaValueSet({
                  attachment,
                  schema: {
                    ...referenceSchemaValueSet.schema,
                    title: isEmpty(referenceSchemaValueSet.schema.title)
                      ? attachment?.name?.split(".pdf")[0] ?? ""
                      : referenceSchemaValueSet.schema.title,
                  },
                  required: referenceSchemaValueSet.required,
                })
              }
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
                  event,
                  referenceSchemaValueSet,
                  resetComponentState,
                  selectedReferenceType,
                  setIsSubmitting,
                  setReferencesFetchTime,
                  organizationId: currentOrg.id,
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
