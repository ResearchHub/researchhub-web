import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component
import BaseModal from "./BaseModal";
import FormSelect from "~/components/Form/FormSelect";
import Toggle from "react-toggle";
import "~/components/TextEditor/stylesheets/ReactToggle.css";
import Button from "~/components/Form/Button";
import UniversityInput from "../SearchSuggestion/UniversityInput";
import MajorsInput from "../SearchSuggestion/MajorsInput";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import { degrees } from "~/config/utils/options";
import * as Options from "../../config/utils/options";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const EducationModal = (props) => {
  // set initial props;

  const [school, setSchool] = useState(); // object
  const [degree, setDegree] = useState(); // select option object
  const [year, setYear] = useState(); // select option object
  const [major, setMajor] = useState();
  const [isPublic, setIsPublic] = useState();

  useEffect(() => {
    mapPropsToState();
  }, [props.education]);

  useEffect(() => {}, [degree]);

  function mapPropsToState() {
    const { education } = props;
    if (education) {
      if (education.degree) {
        setDegree(education.degree);
      } else {
        setDegree(null);
      }

      if (education.name) {
        setSchool(education);
      } else {
        setSchool(null);
      }

      if (education.year) {
        setYear(education.year);
      } else {
        setYear(null);
      }

      if (education.major) {
        setMajor(education.major);
      } else {
        setMajor(null);
      }

      if (education.hasOwnProperty("is_public")) {
        setIsPublic(education.is_public);
      } else {
        setIsPublic(props.currentIndex === 0 ? true : false);
      }
    }
  }

  function handleEducationInput(value, index) {
    setSchool(value);
  }

  function handleMajorInput(value) {
    setMajor(value);
  }

  function handleDegreeSelect(id, value) {
    setDegree(value);
  }

  function handleYearSelect(id, value) {
    setYear(value);
  }

  function formatEducationSummary() {
    let education = { ...school };
    let summary = "";

    if (major) {
      education.major = major;
      summary += major + " ";
    }

    if (degree) {
      education.degree = degree;
      summary += degree.value + `${year ? "" : ","}`;
    }

    if (year) {
      education.year = year;
      let formattedYear = " '" + year.value.slice(2) + ",";
      summary += formattedYear;
    }

    summary += " " + school.name;

    education.summary = summary;
    education.is_public = isPublic;
    return education;
  }

  function handleIsPublic(e) {
    e && e.stopPropagation();
    setIsPublic(e.target.checked);
    props.onActive && props.onActive(props.currentIndex);
  }

  function saveEducation(e) {
    e && e.preventDefault();
    let education = formatEducationSummary();
    // format summary object here
    props.onSave && props.onSave(education);
    closeModal();
  }

  function closeModal() {
    props.openEducationModal(false);
    document.body.style.overflow = "scroll";
  }

  return (
    <BaseModal
      isOpen={props.modals.openEducationModal}
      closeModal={closeModal}
      title={"Add Education"}
      textAlign={"left"}
      zIndex={15}
      modalStyle={styles.modalStyle}
      titleStyle={styles.titleStyle}
    >
      <form onSubmit={saveEducation} className={css(styles.form)}>
        <div className={css(styles.formInputContainer)}>
          <UniversityInput
            label={"School"}
            inputStyle={styles.formInput}
            handleUserClick={handleEducationInput}
            value={school}
            required={true}
          />
          <MajorsInput
            label="Major"
            inputStyle={styles.formInput}
            containerStyle={styles.majorContainer}
            handleUserClick={handleMajorInput}
            onChange={handleMajorInput}
            value={major}
          />
          <FormSelect
            id={"degree"}
            label={"Degree"}
            placeholder={"Ex: Bachelor's"}
            options={degrees}
            maxMenuHeight={175}
            onChange={handleDegreeSelect}
            value={degree}
          />
          <FormSelect
            label={"Year of Graduation"}
            placeholder="Type year"
            required={false}
            value={year}
            id={"year"}
            options={Options.range(1980, 2040)}
            maxMenuHeight={120}
            onChange={handleYearSelect}
          />
          <div className={css(styles.isPublicContainer)}>
            <h3
              className={css(
                styles.isPublicLabel,
                isPublic && styles.activeLabel
              )}
            >
              Set as Main
            </h3>
            <Toggle
              className={"react-toggle"}
              height={15}
              value={isPublic}
              checked={isPublic}
              onChange={handleIsPublic}
            />
          </div>
        </div>
        <div className={css(styles.buttonContainer)}>
          <Button label={"Save"} type={"submit"} />
        </div>
      </form>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    width: 500,
    "@media only screen and (max-width: 767px)": {
      width: 450,
    },
    "@media only screen and (max-width: 415px)": {
      width: 350,
    },
  },
  titleStyle: {
    fontWeight: 400,
  },
  form: {
    width: "100%",
  },
  majorContainer: {
    marginTop: 20,
  },
  formInputContainer: {
    width: "100%",
    marginTop: 30,
    marginBottom: 40,
  },
  formInput: {
    padding: 0,
    margin: 0,
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    paddingTop: 25,
  },
  isPublicContainer: {
    display: "flex",
    alignItems: "center",
    float: "right",
  },
  isPublicLabel: {
    color: colors.BLACK(0.5),
    fontSize: 14,
    margin: 0,
    marginRight: 8,
    fontWeight: 400,
  },
  activeLabel: {
    color: colors.BLUE(),
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openEducationModal: ModalActions.openEducationModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EducationModal);
