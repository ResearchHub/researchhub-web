import API, { generateApiUrl } from "~/config/api";
import { ID } from "~/config/types/root_types";
import { getCurrentUser } from "~/config/utils/getCurrentUser";

type Args = {
  acceptedFiles: Blob[];
  activeProjectID?: ID;
  currentUser: any;
  onError: (error: any) => void;
  onSuccess: (result?: any) => void;
  orgID: ID;
};

const isDevelopment = process.env.NODE_ENV === "development";

const getPresignedUrl = async (fileName, organizationID, projectID) => {
  const url = generateApiUrl("citation_entry/upload_pdfs");
  const resp = await fetch(
    url,
    API.POST_CONFIG({
      filename: fileName,
      organization_id: organizationID,
      project_id: projectID,
    })
  );

  return await resp.json();
};

export default async function postUploadPDFFiles({
  acceptedFiles,
  activeProjectID,
  currentUser,
  onError,
  onSuccess,
  orgID,
}: Args) {
  try {
    acceptedFiles.forEach(async (file) => {
      const preSignedUrl = await getPresignedUrl(
        file.name,
        orgID,
        activeProjectID
      );
      const fileBlob = new Blob([await file.arrayBuffer()], {
        type: "application/pdf",
      });

      const result = await fetch(preSignedUrl, {
        method: "PUT",
        body: fileBlob,
      });

      const preSignedUrlParts = preSignedUrl.split("?AWS");
      const path = preSignedUrlParts[0].split(".com/")[1];
      const _callBackResult = await fetch(
        generateApiUrl("citation_entry/upload_pdfs_callback"),
        API.POST_CONFIG({
          path: path,
          filename: file.name,
          organization_id: orgID,
          project_id: activeProjectID,
          creator_id: currentUser?.id,
        })
      );

      onSuccess();
    });
  } catch (error: any) {
    onError(error);
  }
}
