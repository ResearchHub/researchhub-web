import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "./Button";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/pro-regular-svg-icons";
import { ClipLoader } from "react-spinners";

interface FormFileUploadProps {
  onUploadComplete: (objectKey: string, absoluteUrl: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const FormFileUpload = ({
  onUploadComplete,
  label,
  error,
  disabled,
}: FormFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const baseUrl = API.BASE_URL.replace("/api/", "/");
      const url = `${baseUrl}paper/upload/`;

      const formData = new FormData();
      formData.append("filename", file.name);

      console.log("FormData:", formData);

      const {
        headers: { Authorization },
      } = API.POST_CONFIG({});

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: Authorization,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error("Failed to get upload URL");
      }

      const { presigned_url, object_key } = await response.json();

      // Upload to S3
      const uploadResponse = await fetch(presigned_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "application/pdf",
          // Headers for CORS
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT",
        },
        mode: "cors", // Explicitly set CORS mode
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      // Clean the presigned URL by removing the query parameters
      const absoluteUrl = presigned_url.split("?")[0];

      setFileName(file.name);
      onUploadComplete(object_key, absoluteUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Re-throw to be handled by the parent
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: async (files) => {
      if (files?.[0]) {
        await uploadFile(files[0]);
      }
    },
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled: isUploading || disabled,
    noClick: true,
  });

  return (
    <div className={css(styles.inputContainer, disabled && styles.disabled)}>
      {label && <div className={css(styles.inputLabel)}>{label}</div>}
      <div
        {...getRootProps()}
        className={css(styles.input, Boolean(error) && styles.errorInput)}
      >
        <input {...getInputProps()} />
        <div className={css(styles.fileInfo)}>
          {fileName ? (
            <>
              <FontAwesomeIcon icon={faFile} className={css(styles.fileIcon)} />
              <span className={css(styles.fileName)}>{fileName}</span>
            </>
          ) : (
            <span className={css(styles.placeholder)}>No file selected</span>
          )}
        </div>
        <div className={css(styles.buttonContainer)}>
          <Button
            type="button"
            isDisabled={isUploading || disabled}
            label={
              isUploading ? (
                <div className={css(styles.loaderContainer)}>
                  <ClipLoader
                    sizeUnit={"px"}
                    size={18}
                    color={"#fff"}
                    loading={true}
                  />
                </div>
              ) : (
                "Upload"
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            theme="solidPrimary"
          />
        </div>
      </div>
      {error && <p className={css(styles.error)}>{error}</p>}
    </div>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    minHeight: 75,
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
    width: "100%",
  },
  inputLabel: {
    fontWeight: 500,
    marginBottom: 10,
    color: "#232038",
    fontSize: 16,
    fontFamily: "Roboto",
  },
  input: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    padding: "5px 10px",
    height: 48,
    borderRadius: 2,
    color: "#232038",
    highlight: "none",
    outline: "none",
    ":hover": {
      borderColor: "#B3B3B3",
    },
    ":focus": {
      borderColor: "#3f85f7",
    },
  },
  fileInfo: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
  fileIcon: {
    marginRight: 8,
    color: colors.MEDIUM_GREY(),
    fontSize: 16,
  },
  fileName: {
    fontSize: 14,
    color: colors.BLACK(0.6),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  placeholder: {
    fontSize: 14,
    color: colors.BLACK(0.6),
  },
  buttonContainer: {
    marginLeft: "auto",
    paddingLeft: 16,
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    minHeight: "28px",
  },
  errorInput: {
    borderColor: colors.RED(),
    ":hover": {
      borderColor: colors.RED(),
    },
    ":focus": {
      borderColor: colors.RED(),
    },
  },
  error: {
    margin: 0,
    padding: 0,
    marginTop: 4,
    marginBottom: 10,
    color: colors.RED(1),
    fontSize: 12,
    fontFamily: "Roboto",
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.6,
  },
});

export default FormFileUpload;