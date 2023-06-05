import fetchDocumentMetadata from "../api/fetchDocumentMetadata";
import { useEffect, useState } from "react";
import { DocumentMetadata } from "./types";

const useDocumentMetadata = ({ id }): [DocumentMetadata|undefined, Function] => {
  const [metadata, setMetadata] = useState<DocumentMetadata | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchMetadata = async () => {
      const metadata = await fetchDocumentMetadata({
        unifiedDocId: id,
      });
      setMetadata(metadata);
    };
    if (id) {
      fetchMetadata();
    }
  }, [id]);

  const updateMetadata = (newMetadata: DocumentMetadata) => {
    setMetadata(newMetadata);
  }

  return [metadata, updateMetadata]
}

export default useDocumentMetadata;