import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";

// Component
import FormInput from "../Form/FormInput";
import Loader from "../Loader/Loader";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class UniversityInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      searching: false,
      showDropDown: false,
      universities: [],
      userUniversity: {},
    };
  }

  handleUniversitySearch = (id, value) => {
    let { searching, universities, showDropDown } = this.state;
    this.setState(
      {
        [id]: value,
        showDropDown: value !== "",
        searching: this.state.search === "",
      },
      async () => {
        if (value === "") return;
        await fetch(API.UNIVERSITY({ search: value }), API.GET_CONFIG())
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            let universities = [...res.results];
            this.setState({
              universities,
              searching: false,
            });
          });
      }
    );
  };

  handleClick = (e, university) => {
    e.stopPropagation();
    this.setState({
      search: university.name,
      showDropDown: false,
      searching: false,
    });
    this.props.handleUserClick && this.props.handleUserClick(university);
  };

  renderOptions = () => {
    let { searching, universities, showDropDown } = this.state;
    if (universities.length) {
      return universities.map((university, i) => {
        let { name, city, state, country } = university;
        return (
          <div
            key={`uni-${i}`}
            className={css(styles.universityCard)}
            onClick={(e) => this.handleClick(e, university)}
          >
            <div className={css(styles.uniName)}>{name}</div>
            <div className={css(styles.uniMeta)}>
              {`${city && city + ", "}${state && state + ", "}${country &&
                country}`}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className={css(styles.emptyMessage)}>
          Sorry, there were no matches for your search.
        </div>
      );
    }
  };

  calcHeight = () => {
    let { universities } = this.state;
    switch (universities.length) {
      case 0:
      case 1:
        return styles.smallHeight;
      case 2:
        return styles.midHeight;
      default:
        break;
    }
  };

  render() {
    let {
      containerStyle,
      inputStyle,
      labelStyle,
      label,
      required,
    } = this.props;
    let { searching, universities, showDropDown } = this.state;
    return (
      <div className={css(styles.container, containerStyle && containerStyle)}>
        <div
          className={css(
            styles.inputLabel,
            labelStyle && labelStyle,
            styles.text
          )}
        >
          {label && label}
          {required && <div className={css(styles.asterick)}>*</div>}
        </div>
        <span className={css(styles.inputWrapper)}>
          <FormInput
            id={"search"}
            value={this.state.search}
            onChange={this.handleUniversitySearch}
            required={required}
            placeholder={"Search university"}
            containerStyle={styles.removeMargin}
            type="search"
            autoComplete="off"
          />
          <div
            className={css(
              styles.dropDown,
              showDropDown && styles.show,
              this.calcHeight()
            )}
          >
            {searching ? (
              <div className={css(styles.emptyMessage)}>
                <Loader loading={true} />
              </div>
            ) : (
              this.renderOptions()
            )}
          </div>
        </span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    maxHeight: 80,
    width: "100%",
  },
  inputLabel: {
    height: 19,
    fontWeight: "500",
    width: "100%",
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
    textAlign: "left",
    marginBottom: 10,
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  show: {
    opacity: 1,
    zIndex: 2,
  },
  removeMargin: {
    margin: 0,
    "@media only screen and (max-width: 665px)": {
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  text: {
    fontFamily: "Roboto",
  },
  asterick: {
    color: colors.BLUE(1),
  },
  dropDown: {
    position: "absolute",
    boxSizing: "border-box",
    background: "#FFF",
    border: "#E8E8F2 1px solid",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    bottom: -235,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: -3,
    minHeight: 255,
    maxHeight: 255,
    height: 255,
    overflow: "scroll",
    transition: "opacity ease-in-out 0.3s",
    opacity: 0,
    paddingTop: 5,
  },
  smallHeight: {
    minHeight: 90,
    maxHeight: 90,
    height: 90,
    bottom: -70,
  },
  midHeight: {
    minHeight: 180,
    maxHeight: 180,
    height: 180,
    bottom: -160,
  },
  universityCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "calc(95% - 40px)",
    padding: "10px 20px",
    minHeight: 55,
    maxHeight: 55,
    border: "1px solid #FAFAFA",
    backgroundColor: "#f7f7fb",
    cursor: "pointer",
    marginBottom: 5,
    ":hover": {
      borderColor: "#B3B3B3",
    },
  },
  uniName: {
    fontSize: 18,
    "@media only screen and (max-width: 665px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  uniMeta: {
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
    "@media only screen and (max-width: 665px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  emptyMessage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UniversityInput;
