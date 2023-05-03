import { createReferenceCitation } from "../api/createReferenceCitation";
import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchReferenceCitationSchema } from "../api/fetchReferenceCitationSchema";
import { ID, NullableString } from "~/config/types/root_types";
import { SyntheticEvent, useEffect } from "react";
import { toFormData } from "~/config/utils/toFormData";
import moment from "moment";

export function useEffectOnReferenceTypeChange({
  prevRefSchemaValueSet,
  selectedReferenceType,
  setIsLoading,
  setReferenceSchemaValueSet,
}): void {
  useEffect((): void => {
    if (!isEmpty(selectedReferenceType)) {
      setIsLoading(true);
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
      creators: (authorships ?? []).map(
        (authorship) => authorship.author?.display_name ?? ""
      ),
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
  referenceSchemaValueSet,
  resetComponentState,
  selectedReferenceType,
  setIsSubmitting,
  setReferencesFetchTime,
  organizationID,
  projectID,
}: {
  event: SyntheticEvent;
  resetComponentState: () => void;
  referenceSchemaValueSet: any;
  selectedReferenceType: NullableString;
  setIsSubmitting: (flag: boolean) => void;
  setReferencesFetchTime: (date: number) => void;
  organizationID: ID;
  projectID: ID;
}): void => {
  event.preventDefault();
  setIsSubmitting(true);
  const formattedCreators =
    referenceSchemaValueSet?.schema?.creators?.map((creatorName) => {
      const splittedName = creatorName.split(" ");
      return {
        first_name: splittedName[0],
        last_name: splittedName.slice(1).join(" "),
      };
    }) ?? [];

  const fields: {
    fields: any;
    organization: ID;
    project?: ID;
    citation_type: NullableString;
  } = {
    fields: {
      ...referenceSchemaValueSet.schema,
      creators: formattedCreators,
    },
    citation_type: selectedReferenceType,
    organization: organizationID,
  };

  if (projectID) {
    fields.project = projectID;
  }

  const payload = toFormData(fields);

  const attachment = referenceSchemaValueSet.attachment;
  if (!isEmpty(attachment)) {
    // @ts-ignore unnecessary type checking
    payload.append("attachment", attachment);
  }
  createReferenceCitation({
    onError: (error) => alert(error),
    onSuccess: () => {
      setReferencesFetchTime(Date.now());
      resetComponentState();
    },
    payload,
  });
};
