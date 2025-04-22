import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const EndNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`px-4 py-2 rounded-full bg-error-100 dark:bg-error-900/30 border-2 ${
        selected ? "border-error-500" : "border-error-300 dark:border-error-700"
      } text-center w-40 shadow-sm transition-all`}
    >
      <div className="font-medium text-error-900 dark:text-error-300">
        {data.label}
      </div>
      <Handle type="target" position={Position.Top} className="!bg-error-500" />
    </div>
  );
};

export default memo(EndNode);
