import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const StartNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-900/30 border-2 ${
        selected
          ? "border-accent-500"
          : "border-accent-300 dark:border-accent-700"
      } text-center w-40 shadow-sm transition-all`}
    >
      <div className="font-medium text-accent-900 dark:text-accent-300">
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-accent-500"
      />
    </div>
  );
};

export default memo(StartNode);
