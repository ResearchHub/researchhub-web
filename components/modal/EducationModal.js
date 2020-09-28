import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component
import BaseModal from "./BaseModal";
import FormSelect from "~/components/Form/FormSelect";

import Button from "~/components/Form/Button";
import UniversityInput from "../SearchSuggestion/UniversityInput";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import { degrees } from "~/config/utils/options";
import * as Options from "../../config/utils/options";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const EducationModal = (props) => {
  // set initial props;

  const [school, setSchool] = useState();
  const [degree, setDegree] = useState();
  const [year, setYear] = useState();

  useEffect(() => {
    mapPropsToState();
  }, [props.education]);

  function mapPropsToState() {
    const { education } = props;

    if (education) {
      if (education.degree) {
        // we need to convert the degree string into select option
        let degreeOption = {
          label: education.degree,
          value: education.degree,
        };
        setDegree(degreeOption);
      } else {
        setDegree(null);
      }

      if (education.name) {
        setSchool(education);
      } else {
        setSchool(null);
      }
    }
  }

  function handleEducationInput(value, index) {
    setSchool(value);
  }

  function handleDegreeSelect(id, value) {
    setDegree(value);
  }

  function handleYearSelect(id, value) {
    setYear(value);
  }

  function formatEducationSummary() {}

  function saveEducation() {
    // format summary object here
    props.onSave && props.onSave({ school, degree, year, summary });
    closeModal();
  }

  function closeModal() {
    props.openEducationModal(false);
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
      <div className={css(styles.formInputContainer)}>
        <UniversityInput
          label={"School"}
          inputStyle={styles.formInput}
          containerStyle={styles.universityContainer}
          handleUserClick={handleEducationInput}
          value={school}
        />
        <FormSelect
          id={"degree"}
          label={"Degree"}
          placeholder={"Ex: Bachelor's"}
          options={degree}
          maxMenuHeight={175}
          onChange={handleDegreeSelect}
          // required={true}
          value={degree}
        />
        <FormSelect
          label={"Year of Graduation"}
          placeholder="yyyy"
          required={false}
          value={year}
          id={"year"}
          options={Options.range(1980, 2040)}
          maxMenuHeight={120}
          onChange={handleYearSelect}
        />
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button label={"Save"} onClick={saveEducation} />
      </div>
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
  formInputContainer: {
    width: "100%",
    height: 300,
    marginTop: 30,
    marginBottom: 15,
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
    marginTop: 20,
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
