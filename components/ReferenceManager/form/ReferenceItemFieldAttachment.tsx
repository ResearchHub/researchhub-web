import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { StyleSheet, css } from "aphrodite";
import React, { ReactElement, useState } from "react";
import { ClipLoader } from "react-spinners";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import { convertHttpToHttps } from "~/config/utils/routing";

export type Props = {
  label?: string;
  attachmentURL: string | null;

  onRemoveAttachment: () => void;
};

const ReferenceItemFieldAttachment = ({
  label = "Attachment",
  attachmentURL,
  onRemoveAttachment,
}: Props): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box
      className={"reference-field-input"}
      sx={{
        background: "transparent",
        marginBottom: "16px",
        width: "100%",
      }}
    >
      <div className={css(styles.header)}>
        <Typography
          color="rgba(36, 31, 58, 1)"
          fontSize="14px"
          fontWeight={600}
          lineHeight="22px"
          letterSpacing={0}
          sx={{ background: "transparent" }}
          width="100%"
        >
          {label}
        </Typography>
        {!!attachmentURL && (
          <Button
            onClick={() => {
              setIsLoading(true);
              onRemoveAttachment();
            }}
            customButtonStyle={styles.removeButton}
            variant="text"
            size="small"
          >
            {isLoading ? (
              <ClipLoader
                color={colors.BLACK(0.6)}
                loading={true}
                size={10}
                speedMultiplier={0.5}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  style={{
                    color: colors.BLACK(0.6),
                    fontSize: 14,
                    marginRight: 4,
                  }}
                />

                <div className={css(styles.removeText)}>Remove</div>
              </div>
            )}
          </Button>
        )}
      </div>
      {!attachmentURL ? (
        <span className={css(styles.emptyText)}>No attachments found.</span>
      ) : (
        <div
          style={{
            height: 600,
          }}
        >
          <iframe
            height={"100%"}
            src={convertHttpToHttps(attachmentURL)}
            width={"100%"}
          />
        </div>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  removeButton: {
    padding: "5px 8px",
    minWidth: 100,
  },
  removeText: {
    color: colors.BLACK(0.6),
    fontSize: 14,
    fontWeight: 600,
    marginLeft: 5,
  },
  emptyText: {
    color: colors.BLACK(0.6),
    fontSize: 14,
  },
});

export default ReferenceItemFieldAttachment;
