import React, { useState, useEffect, ChangeEvent } from "react";
import { useFlowchart } from "../../contexts/FlowchartContext";
import { X } from "lucide-react";

interface EdgePropertiesProps {
  edgeId: string;
  onClose: () => void;
}

const EdgeProperties: React.FC<EdgePropertiesProps> = ({ edgeId, onClose }) => {
  const { edges, updateEdgeData } = useFlowchart();
  const [label, setLabel] = useState("");
  const [animated, setAnimated] = useState(false);

  const edge = edges.find((e) => e.id === edgeId);

  useEffect(() => {
    if (edge) {
      setLabel(edge.data?.label || "");
      setAnimated(edge.animated || false);
    }
  }, [edge]);

  if (!edge) {
    return null;
  }

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    updateEdgeData(edgeId, { ...(edge.data || {}), label });
  };

  const handleAnimatedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newAnimated = e.target.checked;
    setAnimated(newAnimated);
    updateEdgeData(edgeId, { ...(edge.data || {}), label }, newAnimated);
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Connection Properties</h3>
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
            Connection
          </label>
          <div className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md">
            {edge.source} → {edge.target}
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
            placeholder="Add label..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="animated"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={animated}
            onChange={handleAnimatedChange}
          />
          <label
            htmlFor="animated"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Animated Flow
          </label>
        </div>

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

export default EdgeProperties;
