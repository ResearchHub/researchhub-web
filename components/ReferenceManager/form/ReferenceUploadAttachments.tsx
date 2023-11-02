import { isEmpty } from "~/config/utils/nullchecks";
import { ReactElement, SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import colors from "~/config/themes/colors";
import Dropzone from "react-dropzone";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Typography from "@mui/material/Typography";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

type Props = {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
};

export default function ReferenceUploadAttachments({
  selectedFile,
  onFileSelect,
}: Props): ReactElement {
  const { name: fileName } = selectedFile ?? {};
  return (
    <Box
      sx={{
        background: "transparent",
        minHeight: "72px",
        marginBottom: "16px",
        width: "100%",
      }}
    >
      <Typography
        color="rgba(36, 31, 58, 1)"
        fontSize="14px"
        fontWeight={600}
        lineHeight="22px"
        letterSpacing={0}
        mb="4px"
        sx={{ background: "transparent" }}
        width="100%"
      >
        {"Attachment (pdf)"}
      </Typography>
      <Box>
        {!isEmpty(selectedFile) ? (
          <div
            style={{
              alignItems: "center",
              border: `1px solid gb(228,231,231)`,
              borderRadius: "4px",
              display: "flex",
              height: "40px",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <UploadFileOutlinedIcon
                fontSize="small"
                sx={{ marginRight: "6px" }}
              />
              <span
                style={{
                  maxWidth: "92%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "92%",
                }}
              >
                {fileName}
              </span>
            </div>
            <RemoveCircleOutlineOutlinedIcon
              fontSize="small"
              onClick={(_event: SyntheticEvent): void => onFileSelect(null)}
              sx={{ cursor: "pointer" }}
            />
          </div>
        ) : (
          <Dropzone
            accept={[".pdf"]}
            multiple={false}
            onDrop={(attachment): void => {
              if (isEmpty(attachment)) {
                return;
              }
              onFileSelect(attachment[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                style={{
                  alignItems: "center",
                  border: `1px dotted ${colors.NEW_BLUE(1)}`,
                  borderRadius: "4px",
                  color: `${colors.GREY(1)}`,
                  cursor: "pointer",
                  display: "flex",
                  height: "40px",
                  justifyContent: "center",
                }}
              >
                <input {...getInputProps()} />
                <UploadFileOutlinedIcon
                  fontSize="small"
                  sx={{ marginRight: "6px" }}
                />
                {"Click or drag & drop"}
              </div>
            )}
          </Dropzone>
        )}
      </Box>
    </Box>
  );
}
