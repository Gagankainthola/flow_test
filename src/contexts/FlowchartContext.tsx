import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { nanoid } from "nanoid";
import { Edge, Node, useReactFlow, ReactFlowInstance } from "reactflow";

// Types
interface Flowchart {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: number;
  updatedAt: number;
  modified?: boolean;
}

interface FlowchartContextType {
  currentFlowchart: Flowchart | null;
  savedFlowcharts: Flowchart[];
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  updateNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  updateEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  updateNodeData: (nodeId: string, data: any) => void;
  updateEdgeData: (edgeId: string, data: any, animated?: boolean) => void;
  saveFlowchart: () => Promise<void>;
  newFlowchart: () => void;
  loadFlowchart: (flowchart: Flowchart) => void;
  loadSavedFlowchart: (id: string) => void;
  exportFlowchart: () => Promise<void>;
  deleteFlowchart: (id: string) => void;
  validateFlowchart: () => { valid: boolean; message: string };
}

// Context
const FlowchartContext = createContext<FlowchartContextType | undefined>(
  undefined
);

// Provider
export const FlowchartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(
    null
  );
  const [currentFlowchart, setCurrentFlowchart] = useState<Flowchart | null>(
    null
  );
  const [savedFlowcharts, setSavedFlowcharts] = useState<Flowchart[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Initialize ReactFlow instance
  const onInit = useCallback((instance: ReactFlowInstance) => {
    setFlowInstance(instance);
  }, []);

  // Load saved flowcharts from localStorage on mount
  useEffect(() => {
    const loadedFlowcharts = localStorage.getItem("flowcharts");
    if (loadedFlowcharts) {
      setSavedFlowcharts(JSON.parse(loadedFlowcharts));
    }
  }, []);

  // Update nodes and mark flowchart as modified
  const updateNodes = useCallback((updater: React.SetStateAction<Node[]>) => {
    setNodes(updater);
    setCurrentFlowchart((prev) => {
      if (!prev) return null;
      return { ...prev, modified: true };
    });
  }, []);

  // Update edges and mark flowchart as modified
  const updateEdges = useCallback((updater: React.SetStateAction<Edge[]>) => {
    setEdges(updater);
    setCurrentFlowchart((prev) => {
      if (!prev) return null;
      return { ...prev, modified: true };
    });
  }, []);

  // Update a specific node's data
  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data };
        }
        return node;
      })
    );
    setCurrentFlowchart((prev) => {
      if (!prev) return null;
      return { ...prev, modified: true };
    });
  }, []);

  // Update a specific edge's data and animation state
  const updateEdgeData = useCallback(
    (edgeId: string, data: any, animated?: boolean) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            return {
              ...edge,
              data,
              animated: animated !== undefined ? animated : edge.animated,
            };
          }
          return edge;
        })
      );
      setCurrentFlowchart((prev) => {
        if (!prev) return null;
        return { ...prev, modified: true };
      });
    },
    []
  );

  // Create a new flowchart
  const newFlowchart = useCallback(() => {
    const emptyFlowchart: Flowchart = {
      id: nanoid(),
      name: "Untitled Flowchart",
      nodes: [],
      edges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentFlowchart(emptyFlowchart);
    setNodes([]);
    setEdges([]);
  }, []);

  // Save current flowchart to localStorage
  const saveFlowchart = useCallback(async () => {
    if (!currentFlowchart) return;

    // Ask for a name if this is the first save or if renaming
    let flowchartName = currentFlowchart.name;
    if (flowchartName === "Untitled Flowchart") {
      const newName = window.prompt(
        "Enter a name for your flowchart:",
        flowchartName
      );
      if (newName) {
        flowchartName = newName;
      }
    }

    // Update the flowchart with current data
    const updatedFlowchart: Flowchart = {
      ...currentFlowchart,
      name: flowchartName,
      nodes,
      edges,
      updatedAt: Date.now(),
      modified: false,
    };

    // Update current flowchart state
    setCurrentFlowchart(updatedFlowchart);

    // Save to localStorage
    const updatedFlowcharts = savedFlowcharts.map((flow) =>
      flow.id === updatedFlowchart.id ? updatedFlowchart : flow
    );

    // If this is a new flowchart, add it to the list
    if (!savedFlowcharts.find((flow) => flow.id === updatedFlowchart.id)) {
      updatedFlowcharts.push(updatedFlowchart);
    }

    setSavedFlowcharts(updatedFlowcharts);
    localStorage.setItem("flowcharts", JSON.stringify(updatedFlowcharts));
  }, [currentFlowchart, nodes, edges, savedFlowcharts]);

  // Load a flowchart from data
  const loadFlowchart = useCallback((flowchart: Flowchart) => {
    setCurrentFlowchart({ ...flowchart, modified: false });
    setNodes(flowchart.nodes);
    setEdges(flowchart.edges);
  }, []);

  // Load a saved flowchart by ID
  const loadSavedFlowchart = useCallback(
    (id: string) => {
      const flowchart = savedFlowcharts.find((flow) => flow.id === id);
      if (flowchart) {
        loadFlowchart(flowchart);
      }
    },
    [savedFlowcharts, loadFlowchart]
  );

  // Export flowchart as JSON file
  const exportFlowchart = useCallback(async () => {
    if (!currentFlowchart) return;

    const flowchartData = {
      ...currentFlowchart,
      nodes,
      edges,
    };

    const blob = new Blob([JSON.stringify(flowchartData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${flowchartData.name || "flowchart"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentFlowchart, nodes, edges]);

  // Delete a flowchart
  const deleteFlowchart = useCallback(
    (id: string) => {
      // If deleting the current flowchart, create a new one
      if (currentFlowchart?.id === id) {
        newFlowchart();
      }

      // Remove from saved list
      const updatedFlowcharts = savedFlowcharts.filter(
        (flow) => flow.id !== id
      );
      setSavedFlowcharts(updatedFlowcharts);
      localStorage.setItem("flowcharts", JSON.stringify(updatedFlowcharts));
    },
    [currentFlowchart, savedFlowcharts, newFlowchart]
  );

  // Validate the flowchart
  const validateFlowchart = useCallback(() => {
    // Check if there are nodes
    if (nodes.length === 0) {
      return { valid: false, message: "Flowchart is empty" };
    }

    // Check if there's a start node
    const startNodes = nodes.filter((node) => node.type === "start");
    if (startNodes.length === 0) {
      return { valid: false, message: "Missing start node" };
    }

    if (startNodes.length > 1) {
      return { valid: false, message: "Multiple start nodes detected" };
    }

    // Check if there's at least one end node
    const endNodes = nodes.filter((node) => node.type === "end");
    if (endNodes.length === 0) {
      return { valid: false, message: "Missing end node" };
    }

    // Check for unconnected nodes
    const connectedNodeIds = new Set<string>();

    // Add all source and target node IDs from edges
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    // Find nodes not in the connected set
    const unconnectedNodes = nodes.filter(
      (node) => !connectedNodeIds.has(node.id)
    );

    if (unconnectedNodes.length > 0) {
      return {
        valid: false,
        message: `${unconnectedNodes.length} unconnected node(s) detected`,
      };
    }

    // Check if start node has incoming connections
    const startNodeId = startNodes[0].id;
    const startNodeIncoming = edges.filter(
      (edge) => edge.target === startNodeId
    );
    if (startNodeIncoming.length > 0) {
      return {
        valid: false,
        message: "Start node should not have incoming connections",
      };
    }

    // Check if end nodes have outgoing connections
    for (const endNode of endNodes) {
      const endNodeOutgoing = edges.filter(
        (edge) => edge.source === endNode.id
      );
      if (endNodeOutgoing.length > 0) {
        return {
          valid: false,
          message: "End nodes should not have outgoing connections",
        };
      }
    }

    // Check for cycles (simple detection)
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        recursionStack.add(nodeId);

        const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
        for (const edge of outgoingEdges) {
          if (!visited.has(edge.target) && hasCycle(edge.target)) {
            return true;
          } else if (recursionStack.has(edge.target)) {
            return true;
          }
        }
      }
      recursionStack.delete(nodeId);
      return false;
    };

    if (hasCycle(startNodeId)) {
      return { valid: false, message: "Cycle detected in flowchart" };
    }

    // All checks passed
    return { valid: true, message: "Flowchart is valid" };
  }, [nodes, edges]);

  // Create a new flowchart on first mount
  useEffect(() => {
    if (!currentFlowchart) {
      newFlowchart();
    }
  }, [currentFlowchart, newFlowchart]);

  const contextValue: FlowchartContextType = {
    currentFlowchart,
    savedFlowcharts,
    nodes,
    edges,
    setNodes,
    setEdges,
    updateNodes,
    updateEdges,
    updateNodeData,
    updateEdgeData,
    saveFlowchart,
    newFlowchart,
    loadFlowchart,
    loadSavedFlowchart,
    exportFlowchart,
    deleteFlowchart,
    validateFlowchart,
  };

  return (
    <FlowchartContext.Provider value={contextValue}>
      {children}
    </FlowchartContext.Provider>
  );
};

// Custom hook for using the flowchart context
export const useFlowchart = () => {
  const context = useContext(FlowchartContext);
  if (context === undefined) {
    throw new Error("useFlowchart must be used within a FlowchartProvider");
  }
  return context;
};
