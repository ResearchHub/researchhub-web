import getDocumentFromRaw, {
  DocumentMetadata,
  parseDocumentMetadata,
  GenericDocument,
} from "~/components/Document/lib/types";
import { useEffect, useState } from "react";
import { isEmpty } from "~/config/utils/nullchecks";
import fetchDocumentMetadata from "../api/fetchDocumentMetadata";

export const useDocument = ({
  rawDocumentData,
  documentType,
}): [GenericDocument | null, Function] => {
  const [document, setDocument] = useState<null | GenericDocument>(null);

  useEffect(() => {
    if (rawDocumentData && isEmpty(document)) {
      const _document = getDocumentFromRaw({
        raw: rawDocumentData,
        type: documentType,
      });
      setDocument(_document);
    }
  }, [rawDocumentData]);

  let parsedDocument = document;
  // When the page is build statically rawDocumentData may be empty
  // and we need to parse the document synchronously so that parsed data is
  // available on first render.
  if (isEmpty(parsedDocument) && rawDocumentData) {
    parsedDocument = getDocumentFromRaw({
      raw: rawDocumentData,
      type: documentType,
    });
  }

  return [parsedDocument, setDocument];
};

export const useDocumentMetadata = ({
  rawMetadata,
  unifiedDocumentId,
}): [DocumentMetadata | null, Function] => {
  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);

  useEffect(() => {
    if (rawMetadata && isEmpty(metadata)) {
      const _metadata = parseDocumentMetadata(rawMetadata);
      setMetadata(_metadata);
    }
  }, [rawMetadata]);

  useEffect(() => {
    if (isEmpty(unifiedDocumentId)) return;
    const _fetchFreshData = async () => {
      const _metadata = await fetchDocumentMetadata({
        unifiedDocId: unifiedDocumentId,
      });

      setMetadata(parseDocumentMetadata(_metadata));
    };

    _fetchFreshData();
  }, [rawMetadata]);

  let parsedMetadata = metadata;
  if (isEmpty(parsedMetadata) && rawMetadata) {
    parsedMetadata = parseDocumentMetadata(rawMetadata);
  }

  return [parsedMetadata, setMetadata];
};
