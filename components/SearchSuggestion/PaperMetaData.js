import React, { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Config
import { convertNumToMonth, cslFields } from "../../config/utils/options";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

// Redux
import { ModalActions } from "~/redux/modals";

const PaperMetaData = ({ metaData, onRemove, onEdit }) => {
  if (Object.keys(metaData).length < 1) {
    return null;
  }
  const [blankState, toggleBlankState] = useState(
    metaData.csl_item ? false : true
  );
  const [editState, useEditState] = useState(false);
  const [editableCsl, updateEditableCsl] = useState(
    metaData ? { ...metaData.csl_item } : {}
  );
  const [isDraggedOver, toggleDragState] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    toggleBlankState(metaData.csl_item.URL ? false : true);
  }, [metaData]);
  // Deconstruct the JSON returned from the backend
  const {
    url,
    url_is_pdf,
    url_is_unsupported_pdf,
    pdf_location,
    csl_item,
  } = metaData;

  const {
    URL,
    number,
    title,
    issued,
    author,
    page,
    volume,
    issue,
    source,
    DOI,
    publisher,
    type,
    abstract,
  } = csl_item;
  const containerTitle = csl_item && csl_item["container-title"]; // camel-case keys
  const date = issued && issued["date-parts"]; // camel-case keys

  const formatDate = (arr) => {
    return arr[0] && arr[0].join("-");
  };

  const formatAuthors = (arr) => {
    if (arr.length > 5 && !url_is_pdf) {
      let firstAuthor = arr[0];
      return `${firstAuthor.family}, ${firstAuthor.given &&
        firstAuthor.given[0]}., et al`;
    }
    return (
      arr &&
      arr
        .map((author) => {
          return `${author.family}, ${author.given && author.given[0]}.`;
        })
        .join(", ")
    );
  };

  const publishedDate = date && formatDate(date);
  const authors = author && formatAuthors(author);

  const toggleEditState = () => {
    useEditState(!editState);
  };

  const openUploadPaperModal = () => {
    dispatch(ModalActions.openUploadPaperModal(true));
  };

  const renderIcon = () => {
    if (blankState) {
      return null;
    }
    if (url_is_pdf) {
      return (
        <img
          src={"/static/icons/pdf.png"}
          className={css(styles.pdfIcon)}
          alt="PDF Icon"
        />
      );
    } else {
      return (
        <div className={css(styles.bookIcon)}>
          <i className="fad fa-book" />
        </div>
      );
    }
  };

  const renderMetaData = () => {
    if (blankState) {
      return (
        <div className={css(styles.blankState)}>
          <img
            className={css(styles.blankStateImg)}
            src={"/static/background/homepage-empty-state.png"}
            alt="Empty State Background"
          />
          Add Paper
        </div>
      );
    }
    if (url_is_pdf && url_is_unsupported_pdf) {
      return (
        <div className={css(styles.metaDataSummary)}>
          <div className={css(styles.text)}>
            <b>URL: </b>
            {URL && URL}
          </div>
          <div className={css(styles.text)}>
            <b>Issued Date: </b>
            {publishedDate && publishedDate}
          </div>
          <div className={css(styles.text, styles.type)}>
            <b>Type: </b>
            {type && type}
          </div>
        </div>
      );
    } else if (url_is_pdf) {
      return (
        <div className={css(styles.metaDataSummary)}>
          {title && (
            <div className={css(styles.text)}>
              <b>Title: </b>
              <em>{title}</em>
            </div>
          )}
          {author && (
            <div className={css(styles.text)}>
              <b>{`Author${authors.length > 1 ? "s" : ""}:`} </b>
              {authors}
            </div>
          )}
          {publishedDate && (
            <div className={css(styles.text)}>
              <b>Issued Date: </b>
              {publishedDate}
            </div>
          )}
          {type && (
            <div className={css(styles.text, styles.type)}>
              <b>Type: </b>
              {type}
            </div>
          )}
        </div>
      );
    } else if (!url_is_pdf) {
      return (
        <div className={css(styles.text)}>
          {author && <span>{`${authors}. `}</span>}
          {title && <span className={css(styles.title)}>{`"${title}" `}</span>}
          {containerTitle && (
            <Fragment>
              <span className={css(styles.italics)}>{containerTitle}</span>
              {", "}
            </Fragment>
          )}
          {volume && <span>{`vol. ${volume}, `}</span>}
          {issue && <span>{`no. ${issue}, `}</span>}
          {date && <span>{`${publishedDate}, `}</span>}
          {page && <span>{`p. ${page}. `}</span>}
          {source && (
            <span className={css(styles.italics)}>{`${source}, `}</span>
          )}
          {DOI && <span>{`doi:${DOI}.`}</span>}
        </div>
      );
    }
  };

  const renderEditState = () => {
    return (
      <div className={css(styles.form)}>
        <div className={css(styles.backButton)}></div>
        <div className={css(styles.saveButton)}></div>
        {cslFields.map((field, i) => {
          if (field.key !== "author" || field.key !== "date") {
            return (
              <div className={css(styles.inputContainer)}>
                <div className={css(styles.inputLabel)}>{field.label}</div>
                <input className={css(styles.input)} />
              </div>
            );
          }
        })}
      </div>
    );
  };

  const renderCornerButton = () => {
    if (blankState) {
      return null;
    }
    if (onRemove) {
      return (
        <Ripples className={css(styles.deleteIconWrapper)}>
          <img
            src={"/static/icons/delete.png"}
            className={css(styles.deleteIcon)}
            onClick={onRemove ? onRemove : null}
            alt="Close Button"
          />
        </Ripples>
      );
    } else if (onEdit) {
      return (
        <Ripples>
          <div
            className={css(styles.editIcon)}
            onClick={onRemove ? onRemove : null}
            // onClick={toggleEditState}
          >
            <i className={"fas fa-pencil"} />
          </div>
        </Ripples>
      );
    }
  };

  return (
    <Ripples
      className={css(styles.entryContainer, isDraggedOver && styles.dragged)}
      onClick={blankState ? openUploadPaperModal : null}
      onDragOver={() => !isDraggedOver && toggleDragState(true)}
      onDragLeave={() => isDraggedOver && toggleDragState(false)}
    >
      {editState ? (
        renderEditState()
      ) : (
        <Fragment>
          <div className={css(styles.column, styles.left)}>{renderIcon()}</div>
          <div
            className={css(
              styles.column,
              styles.right,
              blankState && styles.blankState
            )}
          >
            {renderMetaData()}
          </div>
          <div className={css(styles.cornerButton)}>{renderCornerButton()}</div>
        </Fragment>
      )}
    </Ripples>
  );
};

const styles = StyleSheet.create({
  entryContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    padding: "30px 10px",
    backgroundColor: "#F7F7FB",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    borderRadius: 3,
    position: "relative",
    transition: "all ease-in-out 0.1s",
    // ":hover": {
    //   borderColor: "rgb(210, 210, 230)",
    // },
  },
  blankState: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    ":hover": {
      textDecoration: "underline",
    },
  },
  dragged: {
    paddingBottom: 50,
    border: `1px dashed ${colors.BLUE(1)}`,
    borderColor: colors.BLUE(1),
    // border: `0.5 dashed ${colors.BLUE(1)}`,
    backgroundColor: "#FFF",
  },
  blankStateImg: {
    height: 80,
    paddingBottom: 10,
  },
  metaDataSummary: {
    marginLeft: 10,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  left: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  right: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    wordBreak: "break-word",
    lineHeight: 1.6,
    fontSize: 13,
  },
  title: {
    fontWeight: "bold",
  },
  type: {
    textTransform: "capitalize",
  },
  italics: {
    fontStyle: "italic",
  },
  pdfIcon: {
    height: 39.91,
    width: 34.92,
    marginLeft: 10,
  },
  bookIcon: {
    fontSize: 40,
    color: colors.BLUE(),
  },
  cornerButton: {
    cursor: "pointer",
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconWrapper: {},
  deleteIcon: {
    height: 17,
  },
  editIcon: {
    color: "#C1C2CE",
    ":hover": {
      color: "#000",
    },
  },
  addPaperIcon: {
    color: colors.BLUE(),
    fontSize: 20,
    marginRight: 5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  inputRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: "5px 0 5px 0",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "5px 0 5px 0",
    width: "100%",
  },
  inputLabel: {
    fontSize: 13,
    marginRight: 15,
    width: 80,
    fontWeight: 500,
    marginBottom: 5,
  },
  input: {
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    fontWeight: "400",
    borderRadius: 2,
    color: "#232038",
    highlight: "none",
    outline: "none",
    // width: '100%',
    ":hover": {
      borderColor: "#B3B3B3",
    },
    ":focus": {
      borderColor: "#3f85f7",
      ":hover": {
        boxShadow: "0px 0px 1px 1px #3f85f7",
        cursor: "text",
      },
    },
  },
});

export default PaperMetaData;
