import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClipboardCheck, 
  faFileLines, 
  faFlask, 
  faMagnifyingGlass,
  faAngleDown 
} from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";
import GenericMenu, { MenuOption } from "~/components/shared/GenericMenu";
import IconButton from "~/components/Icons/IconButton";
import colors from "~/config/themes/colors";

export enum NOTE_TYPE {
  PEER_REVIEW = "PEER_REVIEW",
  PREREGISTRATION = "PREREGISTRATION",
  PROTOCOL = "PROTOCOL",
  POST = "POST"
}

const noteTypeConfig = {
  [NOTE_TYPE.PEER_REVIEW]: {
    label: "Peer Review",
    icon: faMagnifyingGlass
  },
  [NOTE_TYPE.PREREGISTRATION]: {
    label: "Preregistration",
    icon: faClipboardCheck
  },
  [NOTE_TYPE.PROTOCOL]: {
    label: "Protocol",
    icon: faFlask
  },
  [NOTE_TYPE.POST]: {
    label: "Post",
    icon: faFileLines
  }
};

interface Props {
  selectedType: NOTE_TYPE;
  onChange: (type: NOTE_TYPE) => void;
}

const NoteTypeSelector = ({ selectedType, onChange }: Props) => {
  const options: MenuOption[] = Object.entries(noteTypeConfig).map(([value, config]) => ({
    value,
    html: (
      <div className={css(styles.menuOption)}>
        <FontAwesomeIcon 
          icon={config.icon} 
          className={css(styles.menuOptionIcon)}
        />
        {config.label}
      </div>
    )
  }));

  return (
    <GenericMenu
      softHide={true}
      options={options}
      width={"100%"}
      id="note-type-selector"
      direction="bottom-left"
      menuStyleOverride={styles.menuStyleOverride}
      onSelect={(option: MenuOption) => {
        onChange(option.value as NOTE_TYPE);
      }}
      selected={selectedType}
    >
      <IconButton overrideStyle={styles.dropdownTrigger}>
        <FontAwesomeIcon 
          icon={noteTypeConfig[selectedType].icon}
          className={css(styles.triggerIcon)} 
        />
        {noteTypeConfig[selectedType].label}
        <FontAwesomeIcon icon={faAngleDown} />
      </IconButton>
    </GenericMenu>
  );
};

const styles = StyleSheet.create({
  dropdownTrigger: {
    borderColor: "hsl(0,0%,80%)",
    backgroundColor: "#FBFBFD",
    borderRadius: 2,
    color: "#8e8d9a",
    border: `1px solid #E8E8F2`,
    minHeight: 50,
    padding: "8px 15px",
    gap: 8,
    display: "flex",
    boxSizing: "border-box",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  menuStyleOverride: {
    top: 58,
  },
  menuOption: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    color: colors.BLACK_TEXT(),
    fontSize: 14,
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.LIGHTER_GREY(),
    }
  },
  menuOptionIcon: {
    width: 16,
    color: colors.MEDIUM_GREY(),
  },
  triggerIcon: {
    width: 16,
    color: colors.MEDIUM_GREY(),
  }
});

export default NoteTypeSelector;
