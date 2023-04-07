import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactElement, useState } from "react";
import Dropzone from "react-dropzone";

export default function ReferenceUploadImportOptionSelector(): ReactElement {
  const [selectedOption, setSelectedOption] = useState<"doi" | "file" | null>(
    null
  );
  return (
    <Box
      sx={{
        background: "transparent",
        height: "72px",
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
        <Dropzone
          accept={[".pdf"]}
          onDrop={(acceptedFiles) => console.log(acceptedFiles)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              style={{
                alignItems: "center",
                border: "1px dotted blue",
                borderRadius: "4px",
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
      </Box>
    </Box>
  );
}
