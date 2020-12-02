import React, { useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { Draggable } from "react-beautiful-dnd";

import SummaryBulletPoint from "~/components/Paper/SummaryBulletPoint";

const style = {
  cursor: "move",
};

const DraggableCard = ({
  id,
  text,
  index,
  moveCard,
  data,
  onEditCallback,
  onRemoveCallback,
}) => {
  const [dragActive, setDrag] = useState(false);
  const ref = useRef(null);

  return (
    <Draggable draggableId={`takeaway-${id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <SummaryBulletPoint
            manage={true}
            data={data}
            index={index}
            onEditCallback={onEditCallback}
            onRemoveCallback={onRemoveCallback}
            authorProfile={data.created_by.author_profile}
          />
        </div>
      )}
    </Draggable>
  );
};

const styles = StyleSheet.create({});

export default DraggableCard;
