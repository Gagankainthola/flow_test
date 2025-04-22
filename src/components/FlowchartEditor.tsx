import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Edge,
  Node,
  Connection,
  useReactFlow,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
  NodeTypes,
  EdgeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./Sidebar";
import { useFlowchart } from "../contexts/FlowchartContext";
import StartNode from "./nodes/StartNode";
import ProcessNode from "./nodes/ProcessNode";
import DecisionNodes from "./nodes/DecisionNodes";
import EndNode from "./nodes/EndNode";
import IONode from "./nodes/IONode";
import CustomEdge from "./edges/CustomEdge";
import NodeProperties from "./properties/NodeProperties";
import EdgeProperties from "./properties/EdgeProperties";
import { useToast } from "../hooks/useToast";

const nodeTypes: NodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNodes,
  end: EndNode,
  io: IONode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const FlowchartEditor: React.FC = () => {
  const reactFlowInstance = useReactFlow();
  const {
    nodes,
    edges,
    updateNodes,
    updateEdges,
    currentFlowchart,
    setNodes,
    setEdges,
    validateFlowchart,
  } = useFlowchart();
  const { toast } = useToast();

  const [selectedElement, setSelectedElement] = useState<{
    type: "node" | "edge";
    id: string;
  } | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      updateNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, updateNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      updateEdges(applyEdgeChanges(changes, edges));
    },
    [edges, updateEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;

      if (!source || !target) return;

      const newEdge: Edge = {
        id: `e${source}-${target}-${Date.now()}`,
        source,
        target,
        type: "custom",
        sourceHandle: sourceHandle ?? null,
        targetHandle: targetHandle ?? null,
        data: { label: "" },
        animated: false,
      };

      updateEdges((eds) => [...eds, newEdge]);
    },
    [updateEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedElement({ type: "node", id: node.id });
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedElement({ type: "edge", id: edge.id });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const onValidate = useCallback(() => {
    const validationResult = validateFlowchart();
    if (validationResult.valid) {
      toast({
        title: "Validation Successful",
        description: "Your flowchart is valid!",
        type: "success",
      });
    } else {
      toast({
        title: "Validation Failed",
        description: validationResult.message,
        type: "error",
      });
    }
  }, [validateFlowchart, toast]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow/type");
      if (!nodeType) return;

      const reactFlowBounds = (event.target as HTMLDivElement)
        .closest(".react-flow__renderer")
        ?.getBoundingClientRect();

      if (!reactFlowBounds) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      let newNode: Node = {
        id: `${nodeType}_${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 h-full flex flex-col">
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            snapToGrid
            snapGrid={[8, 8]}
            defaultEdgeOptions={{
              type: "custom",
              animated: false,
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              nodeColor={(node) => {
                switch (node.type) {
                  case "start":
                    return "#10B981";
                  case "process":
                    return "#3B82F6";
                  case "decision":
                    return "#F59E0B";
                  case "end":
                    return "#EF4444";
                  case "io":
                    return "#8B5CF6";
                  default:
                    return "#64748B";
                }
              }}
            />
            <Panel position="top-center" className="mt-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-4 py-2 flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {currentFlowchart?.name || "Untitled Flowchart"}
                </span>
                {currentFlowchart?.modified && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-2 py-0.5 rounded">
                    Modified
                  </span>
                )}
                <button
                  onClick={onValidate}
                  className="ml-4 bg-primary-500 hover:bg-primary-600 text-white py-1 px-3 text-sm rounded transition-colors"
                >
                  Validate
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {selectedElement && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 h-auto max-h-64 overflow-y-auto">
            {selectedElement.type === "node" ? (
              <NodeProperties
                nodeId={selectedElement.id}
                onClose={() => setSelectedElement(null)}
              />
            ) : (
              <EdgeProperties
                edgeId={selectedElement.id}
                onClose={() => setSelectedElement(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowchartEditor;
