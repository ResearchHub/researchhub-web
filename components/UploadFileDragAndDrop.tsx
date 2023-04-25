import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import Dropzone from "react-dropzone";
import colors from "~/config/themes/colors";

function UploadFileDragAndDrop({}) {
  const [isFileDragged, setIsFileDragged] = useState(false);
  const handleFileDrop = () => {};

  return (
    <div className={css(styles.dropzoneContainer)}>
      <Dropzone
        accept=".json,.csv,"
        multiple={false}
        onDragEnter={(): void => setIsFileDragged(true)}
        onDragLeave={(): void => setIsFileDragged(false)}
        onDrop={handleFileDrop}
      >
        {({ getRootProps, getInputProps }) => (
          <section className={css(styles.fullCanvas)}>
            <div
              {...getRootProps()}
              className={css(styles.dropzone, isFileDragged && styles.dragged)}
            >
              <input {...getInputProps()} required={true} />
              <>
                <img
                  className={css(styles.uploadImage)}
                  src={"/static/background/homepage-empty-state.png"}
                  alt="Drag N Drop Icon"
                />
                <div className={css(styles.instructions)}>
                  {"Drag & drop \n"}
                  <span className={css(styles.subtext)}>
                    {"your file here, or "}
                    <span className={css(styles.browse)} id={"browse"}>
                      {"browse"}
                    </span>
                  </span>
                </div>
              </>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
}

const styles = StyleSheet.create({
  dragged: {
    padding: "40px 0",
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px 0px",
    transition: "all ease-out 0.1s",
  },
  dropzoneContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    backgroundColor: "#F7F7FB",
    cursor: "pointer",
    borderRadius: 3,
    border: `1px dashed ${colors.BLUE()}`,
    outline: "none",
    ":hover": {
      borderStyle: "solid",
    },
    ":hover #browse": {
      textDecoration: "underline",
    },
  },
  uploadImage: {
    height: 80,
    paddingBottom: 10,
  },
  fullCanvas: {
    width: "100%",
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

export default UploadFileDragAndDrop;
