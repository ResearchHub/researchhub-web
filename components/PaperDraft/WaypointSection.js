import React from "react";
import { StyleSheet, css } from "aphrodite";
import { Waypoint } from "react-waypoint";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const WaypointSection = (props) => {
  const { contentState, entityKey, onSectionEnter, children } = props;

  const sectionInstance = contentState.getEntity(entityKey);
  const { name, index } = sectionInstance.getData();
  return (
    <div {...props}>
      <Waypoint
        onEnter={() => {
          onSectionEnter(index);
        }}
        topOffset={40}
        bottomOffset={"95%"}
      >
        <a name={name}>{children}</a>
      </Waypoint>
    </div>
  );
};

export default WaypointSection;
