import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const DecisionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`transform rotate-45 p-4 bg-warning-100 dark:bg-warning-900/30 border-2 ${
        selected
          ? "border-warning-500"
          : "border-warning-300 dark:border-warning-700"
      } h-32 w-32 flex items-center justify-center shadow-sm transition-all`}
    >
      <div className="transform -rotate-45 w-24 text-center font-medium text-warning-900 dark:text-warning-300">
        {data.label}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-warning-500 transform -rotate-45"
        style={{ top: "0%", left: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-warning-500 transform -rotate-45"
        style={{ top: "50%", right: "0%" }}
        id="yes"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-warning-500 transform -rotate-45"
        style={{ bottom: "0%", left: "50%" }}
        id="no"
      />
    </div>
  );
};

export default memo(DecisionNode);
