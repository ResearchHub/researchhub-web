import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";
import React from "react";

export type ProgressStepperStep = {
  title: string;
  number: number;
  value: any;
};

const ProgressStepper = ({ steps, selected }) => {
  return (
    <div className={css(styles.breadcrumbs)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={css(styles.step)}>
            <div
              className={css(
                styles.num,
                step.value === selected && styles.selectedStep
              )}
            >
              <div>{step.number}</div>
            </div>
            <div
              className={css(
                styles.stepText,
                step.value === selected && styles.selectedStepText
              )}
            >
              {step.title}
            </div>
          </div>
          {index !== steps.length - 1 && (
            <div className={css(styles.line)}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};


const styles = StyleSheet.create({
  breadcrumbs: {
    display: "flex",
    alignItems: "center",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  num: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 7,
  },
  selectedStep: {
    backgroundColor: colors.NEW_BLUE(),
    color: "#fff",
  },
  selectedStepText: {
    fontWeight: "bold",
    color: colors.BLACK(),
  },
  stepText: {
    fontSize: 12,
    color: "rgb(91 91 91)",
  },
  line: {
    width: "50px",
    height: "2px",
    backgroundColor: "#DEDEE6",
    position: "relative",
    top: "-8px",
    margin: "0 15px",
  },
});

export default ProgressStepper;