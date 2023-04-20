import { createReferenceCitation } from "../api/createReferenceCitation";
import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchReferenceCitationSchema } from "../api/fetchReferenceCitationSchema";
import { fetchReferenceCitationTypes } from "../api/fetchReferenceCitationTypes";
import { NullableString } from "~/config/types/root_types";
import { SyntheticEvent, useEffect } from "react";
import { toFormData } from "~/config/utils/toFormData";
import moment from "moment";

export function useEffectOnReferenceTypeChange({
  prevRefSchemaValueSet,
  selectedReferenceType,
  setIsLoading,
  setReferenceSchemaValueSet,
  setReferenceTypes,
  setSelectedReferenceType,
}): void {
  useEffect((): void => {
    setIsLoading(true);
    if (!isEmpty(selectedReferenceType)) {
      fetchReferenceCitationSchema({
        citation_type: selectedReferenceType,
        onError: emptyFncWithMsg,
        onSuccess: ({ schema, required }): void => {
          setIsLoading(false);
          // Pasting existing values onto the new schema set
          for (const key in schema) {
            schema[key] = prevRefSchemaValueSet?.schema[key] ?? "";
          }
          setReferenceSchemaValueSet({ schema, required });
        },
      });
    } else {
      fetchReferenceCitationTypes({
        onError: (error) => {
          emptyFncWithMsg(error);
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

export function parseDoiSearchResultOntoValueSet({
  doiMetaData,
  setReferenceSchemaValueSet,
  referenceSchemaValueSet,
}) {
  const { title, doi, display_name, authorships, publication_date } =
    doiMetaData ?? {};
  const formattedTitle = title ?? display_name ?? "";
  setReferenceSchemaValueSet({
    attachment: referenceSchemaValueSet.attachment,
    schema: {
      ...referenceSchemaValueSet.schema,
      access_date: moment().format("MM-DD-YYYY"),
      creators: (authorships ?? [])
        .map((authorship) => authorship.author?.display_name ?? "")
        .join(", "),
      date: !isEmpty(publication_date)
        ? moment(publication_date).format("MM-DD-YYYY")
        : "",
      DOI: doi,
      title: formattedTitle,
      publication_title: formattedTitle,
    },
    required: referenceSchemaValueSet.required,
  });
}

export const handleSubmit = ({
  event,
  initComponentStates,
  referenceSchemaValueSet,
  selectedReferenceType,
  setIsSubmitting,
  setReferencesFetchTime,
}: {
  event: SyntheticEvent;
  initComponentStates: () => void;
  referenceSchemaValueSet: any;
  selectedReferenceType: NullableString;
  setIsSubmitting: (flag: boolean) => void;
  setReferencesFetchTime: (date: number) => void;
}): void => {
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

  const payload = toFormData({
    fields: {
      ...referenceSchemaValueSet.schema,
      creators: formattedCreators,
    },
    citation_type: selectedReferenceType,
    organization: 1,
  });

  const attachment = referenceSchemaValueSet.attachment;
  if (!isEmpty(attachment)) {
    // @ts-ignore unnecessary type checking
    payload.append("attachment", attachment);
  }
  createReferenceCitation({
    onError: (error) => alert(error),
    onSuccess: () => {
      setReferencesFetchTime(Date.now());
      initComponentStates();
    },
    payload,
  });
};
