import API, { generateApiUrl } from "~/config/api";
import { ID } from "~/config/types/root_types";

export type UploadLibraryEntryError = {
  citationId: ID;
  error: string;
};
const parseUploadLibraryEntryError = (error: any): UploadLibraryEntryError => ({
  citationId: error.citation_id,
  error: error.error,
});

type Args = {
  acceptedFiles: Blob[];
  activeProjectID?: ID;
  currentUser: any;
  orgID: ID;
  onSuccess: (refs: any[], errs: UploadLibraryEntryError[]) => void;
  onError: (err: Error) => void;
  type?: "bibtex";
};

export default async function postUploadLibrary({
  acceptedFiles,
  activeProjectID,
  currentUser,
  orgID,
  onSuccess,
  onError,
  type = "bibtex", // assume libraries are bibtex by default
}: Args): Promise<void> {
  try {
    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      formData.append("file", file);
    });

    formData.append("type", type);
    if (activeProjectID) {
      formData.append("project_id", activeProjectID.toString());
    }
    formData.append("creator_id", currentUser?.id);

    const url = generateApiUrl("citation_entry/upload_library");
    const response = await fetch(
      url,
      API.POST_FILE_CONFIG(formData, null, { "x-organization-id": orgID })
    );

    if (!response.ok) {
      throw new Error(
        `Unable to upload library. Error Code: ${response.status}`
      );
    }

    const { citations, errors } = await response.json();
    onSuccess(
      citations,
      (errors || []).map(
        parseUploadLibraryEntryError
      ) as UploadLibraryEntryError[]
    );
  } catch (error) {
    onError(error as any);
  }
}
