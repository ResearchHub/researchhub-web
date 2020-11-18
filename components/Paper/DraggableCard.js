import React, { useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { StyleSheet, css } from "aphrodite";

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
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "bullet_point",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: "bullet_point", id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }}>
      <SummaryBulletPoint
        manage={true}
        data={data}
        index={index}
        onEditCallback={onEditCallback}
        onRemoveCallback={onRemoveCallback}
        authorProfile={data.created_by.user.author_profile}
      />
    </div>
  );
};

const styles = StyleSheet.create({});

export default DraggableCard;
