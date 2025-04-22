import React, { useState, useEffect, ChangeEvent } from "react";
import { useFlowchart } from "../../contexts/FlowchartContext";
import { X } from "lucide-react";

interface NodePropertiesProps {
  nodeId: string;
  onClose: () => void;
}

const NodeProperties: React.FC<NodePropertiesProps> = ({ nodeId, onClose }) => {
  const { nodes, updateNodeData } = useFlowchart();
  const [label, setLabel] = useState("");
  const [nodeType, setNodeType] = useState("");

  const node = nodes.find((n) => n.id === nodeId);

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || "");
      setNodeType(node.type || "");
    }
  }, [node]);

  if (!node) {
    return null;
  }

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    updateNodeData(nodeId, { ...node.data, label });
  };

  const getNodeTypeLabel = (type: string): string => {
    switch (type) {
      case "start":
        return "Start Node";
      case "process":
        return "Process Node";
      case "decision":
        return "Decision Node";
      case "end":
        return "End Node";
      case "io":
        return "Input/Output Node";
      default:
        return "Node";
    }
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Node Properties</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Node Type
          </label>
          <div className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md">
            {getNodeTypeLabel(nodeType)}
          </div>
        </div>

        <div>
          <label
            htmlFor="label"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Label
          </label>
          <input
            type="text"
            id="label"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800"
            value={label}
            onChange={handleLabelChange}
            onBlur={handleLabelBlur}
          />
        </div>

        {nodeType === "decision" && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Decision Node Tips:</strong>
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Connect the "Yes" path from the right handle</li>
              <li>Connect the "No" path from the bottom handle</li>
              <li>Use clear, concise questions in the label</li>
            </ul>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeProperties;
