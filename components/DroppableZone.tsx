import { StyleSheet, css } from "aphrodite";
import { ReactElement, useState } from "react";
import Dropzone from "react-dropzone";
import colors from "~/config/themes/colors";

type Props = {
  accept?: string;
  fullWidth?: boolean;
  multiple?: boolean;
  children?: ReactElement;
  noClick?: boolean;
  id?: string;
  handleFileDrop: (acceptedFiles: any[]) => void;
};

function DroppableZone({
  accept,
  children,
  fullWidth,
  handleFileDrop,
  multiple,
  noClick,
  id,
}: Props) {
  const [isFileDragged, setIsFileDragged] = useState(false);

  return (
    <Dropzone
      accept={accept}
      multiple={multiple}
      noClick={noClick}
      onDragEnter={(): void => setIsFileDragged(true)}
      onDragLeave={(): void => setIsFileDragged(false)}
      onDrop={(acceptedFiles) => {
        setIsFileDragged(false);
        handleFileDrop(acceptedFiles);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <section
          className={css(
            styles.fullCanvas,
            styles.dropzoneContainer,
            isFileDragged && styles.dragged,
            fullWidth && styles.fullWidth
          )}
        >
          <div {...getRootProps()} className={css(styles.dropzone)} id={id}>
            <input {...getInputProps()} required={true} />
            <>{children}</>
          </div>
        </section>
      )}
    </Dropzone>
  );
}

const styles = StyleSheet.create({
  dragged: {
    backgroundColor: "transparent",
    border: 0,
    outline: `dotted ${colors.BLUE()}`,
    zIndex: 9,
    ":hover": {
      borderStyle: "solid",
    },
    ":hover #browse": {
      textDecoration: "underline",
    },
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    transition: "all ease-out 0.1s",
  },
  dropzoneContainer: {
    boxSizing: "border-box",
    width: "calc(100% - 240px)",
    cursor: "default",
    borderRadius: 3,
    height: "100%",
    outline: "none",
    zIndex: 9999,
    minHeight: 500,
  },
  fullWidth: {
    width: "100%",
    minWidth: "100%",
  },
  uploadImage: {
    height: 80,
    paddingBottom: 10,
  },
  fullCanvas: {
    width: "100%",
    height: "100%",
  },
  instructions: {
    fontSize: 18,
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
  subtext: {
    color: "#757575",
    fontSize: 14,
    marginTop: 15,
  },
  browse: {
    color: colors.BLUE(),
  },
});

export default DroppableZone;
