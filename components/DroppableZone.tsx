import { StyleSheet, css } from "aphrodite";
import { ReactElement, useState } from "react";
import Dropzone from "react-dropzone";
import colors from "~/config/themes/colors";

type Props = {
  accept?: string;
  multiple?: boolean;
  children?: ReactElement;
  noClick?: boolean;
  handleFileDrop: (acceptedFiles: any[]) => void;
};

function DroppableZone({
  accept,
  multiple,
  children,
  noClick,
  handleFileDrop,
}: Props) {
  const [isFileDragged, setIsFileDragged] = useState(false);

  return (
    <div
      className={css(styles.dropzoneContainer, isFileDragged && styles.dragged)}
    >
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
          <section className={css(styles.fullCanvas)}>
            <div {...getRootProps()} className={css(styles.dropzone)}>
              <input {...getInputProps()} required={true} />
              <>{children}</>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
}

const styles = StyleSheet.create({
  dragged: {
    backgroundColor: "#F7F7FB",
    border: 0,
    outline: `dotted ${colors.BLUE()}`,
    zIndex: 999999,
    // border: `1px dashed ${colors.BLUE()}`,
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
    justifyContent: "center",
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
    outline: "none",
    marginRight: 4,
    marginBottom: 4,
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
