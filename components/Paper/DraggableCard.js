import React, { useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { StyleSheet, css } from "aphrodite";

import SummaryBulletPoint from "~/components/Paper/SummaryBulletPoint";
import DraggableProjectCard from "~/components/Author/Tabs/Projects/DraggableProjectCard";

const style = {
  cursor: "move",
};

const DraggableCard = ({
  id,
  text,
  project,
  index,
  moveCard,
  data,
  onEditCallback,
  onClick,
  featuredWorks,
  manage,
  active,
}) => {
  const ref = useRef(null);
  const refHolder = useRef(null);

  const [, drop] = useDrop({
    accept: "bullet_point",
    hover(item, monitor) {
      if (!ref.current || !manage) {
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

  if (featuredWorks) {
    return (
      <div ref={ref} style={{ opacity }}>
        <DraggableProjectCard
          data={data}
          index={index}
          onEditCallback={onEditCallback}
          onClick={onClick}
          active={active}
        />
      </div>
    );
  }
  return (
    <div ref={ref} style={{ opacity }}>
      <SummaryBulletPoint
        manage={true}
        data={data}
        index={index}
        onEditCallback={onEditCallback}
      />
    </div>
  );
};

const styles = StyleSheet.create({});

export default DraggableCard;
