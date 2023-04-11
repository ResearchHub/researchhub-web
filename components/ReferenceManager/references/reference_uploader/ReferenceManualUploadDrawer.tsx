import {
  DEFAULT_REF_SCHEMA_SET,
  ReferenceSchemaValueSet,
} from "./reference_default_schemas";
import { Button } from "@mui/material";
import { createReferenceCitation } from "../api/createReferenceCitation";
import {
  emptyFncWithMsg,
  isEmpty,
  nullthrows,
} from "~/config/utils/nullchecks";
import { fetchReferenceCitationSchema } from "../api/fetchReferenceCitationSchema";
import { fetchReferenceCitationTypes } from "../api/fetchReferenceCitationTypes";
import { LEFT_MAX_NAV_WIDTH as LOCAL_LEFT_NAV_WIDTH } from "../../basic_page_layout/BasicTogglableNavbarLeft";
import { LEFT_SIDEBAR_MIN_WIDTH } from "~/components/Home/sidebar/RootLeftSidebar";
import { NAVBAR_HEIGHT as ROOT_NAVBAR_HEIGHT } from "~/components/Navbar";
import { NullableString } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { snakeCaseToNormalCase } from "~/config/utils/string";
import { useReferenceTabContext } from "../reference_item/context/ReferenceItemDrawerContext";
import Box from "@mui/material/Box";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Drawer from "@mui/material/Drawer";
import moment from "moment";
import PrimaryButton from "../../form/PrimaryButton";
import ReferenceDoiSearchInput from "./ReferenceDoiSearchInput";
import ReferenceItemFieldInput from "../../form/ReferenceItemFieldInput";
import ReferenceItemFieldSelect from "../../form/ReferenceItemFieldSelect";
import ReferenceUploadAttachments from "./ReferenceUploadAttachments";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const APPLICABLE_LEFT_NAV_WIDTH =
  LOCAL_LEFT_NAV_WIDTH + LEFT_SIDEBAR_MIN_WIDTH - 34;

type Props = {
  drawerProps: {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (flag: boolean) => void;
  };
};

function initComponentStates({
  referenceSchemaValueSet,
  setIsDrawerOpen,
  setReferenceSchemaValueSet,
}): void {
  setIsDrawerOpen(false);
  const resettedSchema = {};
  for (const key in referenceSchemaValueSet.schema) {
    resettedSchema[key] = "";
  }
  setReferenceSchemaValueSet({
    attachment: null,
    schema: resettedSchema,
    required: referenceSchemaValueSet.required,
  });
}

function useEffectPrepSchemas({
  selectedReferenceType,
  setIsLoading,
  setReferenceSchemaValueSet,
  setReferenceTypes,
  setSelectedReferenceType,
}): void {
  useEffect((): void => {
    setIsLoading(true);
    if (!isEmpty(selectedReferenceType) && selectedReferenceType) {
      fetchReferenceCitationSchema({
        citation_type: selectedReferenceType,
        onError: emptyFncWithMsg,
        onSuccess: ({ schema, required }): void => {
          setIsLoading(false);
          setReferenceSchemaValueSet({ schema, required });
        },
      });
    } else {
      fetchReferenceCitationTypes({
        onError: (error) => {
          alert(error);
        },
        onSuccess: (result) => {
          setReferenceTypes(result);
          const selectedReferenceType = result[0];
          setSelectedReferenceType(selectedReferenceType);
          fetchReferenceCitationSchema({
            citation_type: selectedReferenceType,
            onError: emptyFncWithMsg,
            onSuccess: ({ schema, required }): void => {
              setIsLoading(false);
              setReferenceSchemaValueSet({ schema, required });
            },
          });
        },
      });
    }
  }, [selectedReferenceType]);
}

export default function ReferenceManualUploadDrawer({
  drawerProps: { isDrawerOpen, setIsDrawerOpen },
}: Props): ReactElement {
  const { setReferencesFetchTime } = useReferenceTabContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [referenceTypes, setReferenceTypes] = useState<string[]>([]);
  const [selectedReferenceType, setSelectedReferenceType] =
    useState<NullableString>(null);
  const [referenceSchemaValueSet, setReferenceSchemaValueSet] =
    useState<ReferenceSchemaValueSet>(DEFAULT_REF_SCHEMA_SET);

  useEffectPrepSchemas({
    selectedReferenceType,
    setIsLoading,
    setReferenceSchemaValueSet,
    setReferenceTypes,
    setSelectedReferenceType,
  });

  const formattedMenuItemProps = referenceTypes.map((refType: string) => ({
    label: snakeCaseToNormalCase(refType),
    value: refType,
  }));

  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    setIsSubmitting(true);

    const formattedCreators =
      referenceSchemaValueSet?.schema?.creators
        ?.split(", ")
        ?.map((creatorName) => {
          const splittedName = creatorName.split(" ");
          return {
            first_name: splittedName[0],
            last_name: splittedName.slice(1).join(" "),
          };
        }) ?? [];

    const payload = {
      fields: {
        ...referenceSchemaValueSet.schema,
        creators: formattedCreators,
      },
      citation_type: selectedReferenceType,
      organization: 1,
    };
    // Need to prep attachment as Base64 for Django support
    const attachment = referenceSchemaValueSet.attachment;
    if (!isEmpty(attachment)) {
      const reader = new FileReader();
      reader.readAsBinaryString(nullthrows(attachment));
      reader.onload = () => {
        const attachmentStr64 = reader.result;
        // @ts-ignore unnecessary type checking
        payload.attachment_src = attachmentStr64;
        // @ts-ignore unnecessary type checking
        payload.attachment_name = attachment?.name ?? "";

        createReferenceCitation({
          onError: emptyFncWithMsg,
          onSuccess: () => {
            setIsSubmitting(false);
            setReferencesFetchTime(Date.now());
            setIsDrawerOpen(false);
          },
          payload,
        });
      };
    } else {
      createReferenceCitation({
        onError: emptyFncWithMsg,
        onSuccess: () => {
          setIsSubmitting(false);
          setReferencesFetchTime(Date.now());
          setIsDrawerOpen(false);
        },
        payload,
      });
    }
  };

  const formattedSchemaInputs = Object.keys(referenceSchemaValueSet.schema)
    .sort((a, _b): number => {
      if (a === "title") {
        return -1;
      } else if (a === "creators") {
        return 0;
      }
      return 1;
    })
    .map((schemaField: string) => {
      let label = snakeCaseToNormalCase(schemaField);
      const schemaFieldValue = referenceSchemaValueSet.schema[schemaField];
      if (schemaField === "creators") {
        // TODO: calvinhlee - make separate creators input fields
        label = "Authors / Creators (comma separated)";
      }
      if (schemaField === "date") {
        // TODO: calvinhlee - make separate date input fields
        label = "Date (MM-DD-YYYY)";
      }
      return (
        <ReferenceItemFieldInput
          disabled={isSubmitting}
          formID={schemaField}
          key={`reference-manual-upload-field-${schemaField}`}
          label={label}
          onChange={(newValue: string): void => {
            setReferenceSchemaValueSet({
              attachment: referenceSchemaValueSet.attachment,
              schema: {
                ...referenceSchemaValueSet.schema,
                [schemaField]: newValue,
              },
              required: referenceSchemaValueSet.required,
            });
          }}
          placeholder={label}
          value={schemaFieldValue}
        />
      );
    });

  return (
    <Drawer
      anchor="left"
      BackdropProps={{ invisible: true }}
      onBackdropClick={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      onClose={(event: SyntheticEvent): void => {
        event.preventDefault();
        initComponentStates({
          referenceSchemaValueSet,
          setIsDrawerOpen,
          setReferenceSchemaValueSet,
        });
      }}
      sx={{
        width: "0",
        zIndex: 3 /* AppTopBar zIndex is 3 */,
        height: "100%",
      }}
    >
      <Box
        sx={{
          background: "rgba(250, 250, 252, 1)",
          borderLeft: `1px solid #e8e8ef`,
          boxSizing: "border-box",
          height: "500%",
          marginLeft: `${APPLICABLE_LEFT_NAV_WIDTH}px`,
          marginTop: `${ROOT_NAVBAR_HEIGHT}px`,
          padding: "16px 24px",
          width: "472px",
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          mb="24px"
          spacing={1}
          sx={{
            background: "rgba(250, 250, 252, 1)",
            height: "40px",
            position: "sticky",
            top: `${ROOT_NAVBAR_HEIGHT}px`,
            zIndex: 4,
            margin: "-16px 0 0",
            padding: "16px 0",
          }}
        >
          <Typography variant="h6">{"Upload reference"}</Typography>
          <CloseOutlinedIcon
            fontSize="small"
            color="disabled"
            onClick={(): void =>
              initComponentStates({
                referenceSchemaValueSet,
                setIsDrawerOpen,
                setReferenceSchemaValueSet,
              })
            }
            sx={{ cursor: "pointer" }}
          />
        </Stack>
        <Box display="flex" flexDirection="column">
          <Box sx={{ borderBottom: `1px solid #E9EAEF` }} mb="14px">
            <ReferenceItemFieldSelect
              formID="ref-type"
              label="Reference type"
              menuItemProps={formattedMenuItemProps}
              onChange={setSelectedReferenceType}
              required
              value={selectedReferenceType}
            />
            <ReferenceDoiSearchInput
              onSearchSuccess={(doiMetaData: any): void => {
                const {
                  title,
                  doi,
                  display_name,
                  authorships,
                  publication_date,
                } = doiMetaData ?? {};
                const formattedTitle = title ?? display_name ?? "";
                setReferenceSchemaValueSet({
                  attachment: referenceSchemaValueSet.attachment,
                  schema: {
                    ...referenceSchemaValueSet.schema,
                    access_date: moment().format("MM-DD-YYYY"),
                    creators: (authorships ?? [])
                      .map(
                        (authorship) => authorship.author?.display_name ?? ""
                      )
                      .join(", "),
                    date: !isEmpty(publication_date)
                      ? moment(publication_date).format("MM-DD-YYYY")
                      : "",
                    doi,
                    title: formattedTitle,
                    publication_title: formattedTitle,
                  },
                  required: referenceSchemaValueSet.required,
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
          <Box display="flex" flexDirection="row" mb="36px">
            <div style={{ width: "88px" }}>
              <PrimaryButton
                onClick={handleSubmit}
                size="medium"
                disabled={false}
              >
                <Typography fontSize="14px" fontWeight="400">
                  {"Add entry"}
                </Typography>
              </PrimaryButton>
            </div>
            <div style={{ width: "88px", marginLeft: "16px" }}>
              <Button
                onClick={(event: SyntheticEvent): void => {
                  event.preventDefault();
                  initComponentStates({
                    referenceSchemaValueSet,
                    setIsDrawerOpen,
                    setReferenceSchemaValueSet,
                  });
                }}
                size="medium"
                sx={{ textTransform: "none" }}
              >
                <Typography fontSize="14px" fontWeight="400">
                  {"Cancel"}
                </Typography>
              </Button>
            </div>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
