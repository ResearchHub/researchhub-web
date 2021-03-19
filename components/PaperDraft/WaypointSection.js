import React from "react";
import { Waypoint } from "react-waypoint";

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
        <a name={name.toUpperCase()}>{children}</a>
      </Waypoint>
    </div>
  );
};

export default WaypointSection;
