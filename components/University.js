import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/pro-solid-svg-icons";
import { css, StyleSheet } from "aphrodite";

const University = (props) => {
  const { university } = props || {};
  return (
    <div className={css(styles.extraInfo)}>
      <span className={css(styles.icon)}>
        {<FontAwesomeIcon icon={faGraduationCap}></FontAwesomeIcon>}
      </span>
      {buildText(university.name, university.city, university.country)}
    </div>
  );
};

function buildText(name, city, country) {
  let text = "";
  if (name) {
    text += name;
  }
  if (city) {
    text += " • " + city;
  }
  if (country) {
    text += ", " + country;
  }
  return text;
}

const styles = StyleSheet.create({
  extraInfo: {
    color: colors.TEXT_DARKER_GREY,
    opacity: 0.5,
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
});

export default University;
