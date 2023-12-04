import { createReferenceCitation } from "../api/createReferenceCitation";
import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchReferenceCitationSchema } from "../api/fetchReferenceCitationSchema";
import { stringToDateParts } from "../utils/formatCSLDate";
import { ID, NullableString } from "~/config/types/root_types";
import { SyntheticEvent, useEffect } from "react";
import { toFormData } from "~/config/utils/toFormData";

import moment from "moment";
import { ReferenceTableRowDataType } from "../reference_table/utils/formatReferenceRowData";

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
          setReferenceSchemaValueSet({
            schema,
            required,
            signedUrl: prevRefSchemaValueSet.signedUrl,
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
  const {
    title,
    doi,
    display_name,
    authorships,
    issued,
    issn_l,
    issn,
    url,
    landing_page_url,
    source,
    abstract,
    pdf_url,
    custom,
    signed_pdf_url,
  } = doiMetaData ?? {};
  const formattedTitle = title ?? display_name ?? "";
  const schemaSet = {
    attachment: referenceSchemaValueSet.attachment,
    signedUrl: signed_pdf_url,
    schema: {
      ...referenceSchemaValueSet.schema,
      access_date: moment().format("MM-DD-YYYY"),
      author: (authorships ?? []).map(
        (authorship) => authorship.author?.display_name ?? ""
      ),
      issued: issued ? moment(issued).format("MM-DD-YYYY") : "",
      date: !isEmpty(issued) ? moment(issued).format("MM-DD-YYYY") : "",
      DOI: doi,
      title: formattedTitle,
      ISSN: issn.join(", "),
      pdf_url: pdf_url,
      URL: landing_page_url,
      signed_pdf_url,
      abstract,
      source: source,
      custom: custom,
      publication_title: formattedTitle,
    },
    required: referenceSchemaValueSet.required,
  };

  setReferenceSchemaValueSet(schemaSet);
}

export const handleSubmit = ({
  addSingleReference,
  event,
  referenceSchemaValueSet,
  resetComponentState,
  selectedReferenceType,
  setIsSubmitting,
  organizationID,
  projectID,
}: {
  event: SyntheticEvent;
  resetComponentState: () => void;
  referenceSchemaValueSet: any;
  selectedReferenceType: NullableString;
  setIsSubmitting: (flag: boolean) => void;
  setReferencesFetchTime?: (date: number) => void;
  organizationID: ID;
  projectID: ID;
  addSingleReference: (entry: ReferenceTableRowDataType) => void;
}): void => {
  event.preventDefault();
  setIsSubmitting(true);
  const formattedCreators =
    referenceSchemaValueSet?.schema?.author?.map((creatorName) => {
      const splittedName = creatorName.split(" ");
      return {
        given: splittedName[0],
        family: splittedName.slice(1).join(" "),
      };
    }) ?? [];

  const formattedCSLDate = stringToDateParts(
    referenceSchemaValueSet?.schema?.issued
  );

  const fields: {
    fields: any;
    organization: ID;
    project?: ID;
    citation_type: NullableString;
  } = {
    fields: {
      ...referenceSchemaValueSet.schema,
      author: formattedCreators,
      issued: formattedCSLDate,
      custom: {
        ...referenceSchemaValueSet.custom,
        attachment: referenceSchemaValueSet.signedUrl,
      },
    },
    citation_type: selectedReferenceType,
    doi: referenceSchemaValueSet.schema.DOI,
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
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (res) => {
      addSingleReference(res);
      resetComponentState();
    },
    payload,
  });
};
