import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const ProcessNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`px-4 py-2 rounded-md bg-primary-100 dark:bg-primary-900/30 border-2 ${
        selected
          ? "border-primary-500"
          : "border-primary-300 dark:border-primary-700"
      } text-center w-48 shadow-sm transition-all`}
    >
      <div className="font-medium text-primary-900 dark:text-primary-300">
        {data.label}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary-500"
      />
    </div>
  );
};

export default memo(ProcessNode);
