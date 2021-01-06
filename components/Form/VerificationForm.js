import React, {
  useState,
  useEffect,
  useImperativeHandle,
  Fragment,
} from "react";
import { StyleSheet, css } from "aphrodite";
import DragNDrop from "./DragNDrop";
import Loader from "../Loader/Loader";
import colors from "../../config/themes/colors";
import api from "../../config/api";
import helpers from "@quantfive/js-web-config/helpers";

const VerificationForm = React.forwardRef((props, ref) => {
  const { showMessage } = props;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      return () => {
        files.forEach((file) => URL.revokeObjectURL(file.preview));
      };
    },
    [files]
  );

  useImperativeHandle(ref, () => ({
    uploadVerification: () => {
      // setLoading(true);
      showMessage({ show: true, load: true });

      let params = new FormData();
      for (let i = 0; i < files.length; i++) {
        params.append("images", files[i]);
      }
      return fetch(
        api.USER_VERIFICATION({ route: "bulk_upload" }),
        api.POST_FILE_CONFIG(params)
      )
        .then(helpers.checkStatus)
        .then(helpers.parseJSON)
        .then((res) => {
          showMessage({ show: false });
          return res;
        });
    },
  }));

  /**
   * Remove an uploaded file
   * @param { Integer } index -- the index of the file we wish to remove
   */
  const removeFile = (index) => {
    let currentFiles = [...files];
    let currentFile = currentFiles[index];
    currentFiles.splice(index, 1);
    setFiles(currentFiles);
    URL.revokeObjectURL(currentFile.preview);
  };

  const fileAdded = (uploadedFiles, binaryStr) => {
    let newFiles = [...files, ...uploadedFiles];
    newFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(newFiles);
  };

  const calculateStyle = () => {
    if (files.length < 2) {
      return "single";
    } else if (files.length === 2) {
      return "half";
    } else if (files.length > 2) {
      return "DndItem";
    }
  };

  const renderDropContent = () => {
    if (loading) {
      return <Loader loading={true} size={28} />;
    } else {
      return (
        <Fragment>
          <img
            className={css(styles.uploadImage)}
            src={"/static/background/homepage-empty-state.png"}
            alt="Drag N Drop Icon"
          />
          <div className={css(styles.instructions)}>
            Drag & drop{"\n"}
            <span className={css(styles.subtext)}>
              your file here, or{" "}
              <span className={css(styles.browse)} id={"browse"}>
                browse
              </span>
            </span>
          </div>
        </Fragment>
      );
    }
  };

  return (
    <div className={css(styles.root)}>
      {files.length > 0 && (
        <div className={css(styles.filePreviews)}>
          {files.map((file, index) => {
            return (
              <div className={css(styles.preview)} key={`file_${index}`}>
                <i
                  onClick={() => removeFile(index)}
                  class={css(styles.times) + " fas fa-times"}
                ></i>
                {
                  <img
                    className={css(styles.previewImg)}
                    src={file.preview}
                    alt={`File Preview Page ${index + 1}`}
                  />
                }
              </div>
            );
          })}
        </div>
      )}
      <DragNDrop
        images={files}
        handleDrop={fileAdded}
        // onSortEnd={this.onSortEnd}
        noPasteUrl={true}
        addImageClassName={files.length > 0 ? "DndHero single" : "DndDefault"}
        imageContainerClassName={calculateStyle()}
        accept={"image/*"}
        addImageText={
          files.length < 1 ? renderDropContent() : <i className="fal fa-plus" />
        }
      />
    </div>
  );
});

const styles = StyleSheet.create({
  uploadImage: {
    height: 80,
    paddingBottom: 10,
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
  filePreviews: {
    display: "flex",
    marginBottom: 16,
  },
  preview: {
    position: "relative",
    marginRight: 16,
    width: "33%",
    boxSizing: "border-box",
  },
  previewImg: {
    width: "100%",
  },
  times: {
    position: "absolute",
    top: 16,
    right: 16,
    cursor: "pointer",
    padding: 8,
    height: 16,
    width: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
    color: "#fff",
    borderRadius: "50%",
    boxShadow: "rgba(129,148,167,0.39) 0px 3px 10px 0px",
  },
});

export default VerificationForm;
