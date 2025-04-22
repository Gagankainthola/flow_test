import React, { FC } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";

const CustomEdge: FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeStyles = {
    ...style,
    stroke: selected ? "#3B82F6" : "#64748B",
    strokeWidth: selected ? 2 : 1.5,
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={edgeStyles}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className={`
              bg-white dark:bg-gray-800 
              px-2 py-1 
              rounded-md 
              text-xs 
              border border-gray-200 dark:border-gray-700 
              ${selected ? "ring-2 ring-primary-500" : ""} 
              shadow-sm
              select-none
              max-w-xs
              overflow-hidden
              text-ellipsis
              z-10
            `}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
