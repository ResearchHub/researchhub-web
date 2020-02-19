// NPM
import React, { Fragment } from "react";
import { connect, useState, useDispatch } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Config
import colors from "../../config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

// Component
import FormInput from "./FormInput";
import Loader from "../Loader/Loader";
import PaperMetaData from "../SearchSuggestion/PaperMetaData";
import Dropzone from "react-dropzone";

class NewDND extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlView: false,
    };
  }

  componentDidMount() {}

  handleFileDrop = (acceptedFiles) => {
    // Arg returns as an array
  };

  render() {
    return (
      <Ripples className={css(styles.dropzoneContainer)}>
        <Dropzone onDrop={this.handleFileDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className={css(styles.fullCanvas)}>
              <div {...getRootProps()} className={css(styles.flexColumn)}>
                <img
                  className={css(styles.uploadImage)}
                  src={"/static/background/homepage-empty-state.png"}
                />
                <input {...getInputProps()} />
                <div className={css(styles.instructions)}>
                  Drag & drop{"\n"}
                  <span className={css(styles.subtext)}>
                    your files here, or{" "}
                    <span className={css(styles.browse)} id={"browse"}>
                      browse
                    </span>
                  </span>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      </Ripples>
    );
  }
}

const styles = StyleSheet.create({
  dropzoneContainer: {
    backgroundColor: "#F7F7FB",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    backgroundColor: "#F7F7FB",
    cursor: "pointer",
    borderRadius: 3,
    position: "relative",
    transition: "all ease-in-out 0.1s",
    border: `1px dashed ${colors.BLUE()}`,
    outline: "none",
    ":hover": {
      borderStyle: "solid",
    },
    ":hover #browse": {
      color: colors.BLUE(),
    },
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px 0px",
  },
  uploadImage: {
    height: 80,
    paddingBottom: 10,
  },
  fullCanvas: {
    height: "100%",
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
    ":hover": {
      textDecoration: "underline",
    },
  },
});

export default NewDND;
