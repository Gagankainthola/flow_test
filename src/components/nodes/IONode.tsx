import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "./IONode.css"; // Import the external CSS

const IONode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className="relative">
      <div
        className={`
          px-4 py-2 
          bg-purple-100 dark:bg-purple-900/30 
          border-2 ${
            selected
              ? "border-purple-500"
              : "border-purple-300 dark:border-purple-700"
          } 
          w-48 h-12
          flex items-center justify-center
          shadow-sm transition-all
          parallelogram
        `}
      >
        <div className="font-medium text-purple-900 dark:text-purple-300 transform skew(15deg)">
          {data.label}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-500"
        style={{ left: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500"
        style={{ left: "50%" }}
      />
    </div>
  );
};

export default memo(IONode);
