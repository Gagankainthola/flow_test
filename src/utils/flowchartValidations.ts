import { Node, Edge } from 'reactflow';

export interface ValidationResult {
  valid: boolean;
  message: string;
  issues?: ValidationIssue[];
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  nodeIds?: string[];
  edgeIds?: string[];
}

export function validateFlowchart(nodes: Node[], edges: Edge[]): ValidationResult {
  const issues: ValidationIssue[] = [];

  const hasForLoop = nodes.some((node) => node.type === 'forloop');
  console.log(hasForLoop);
  
  if (hasForLoop) {
 
    const startNodes = nodes.filter((node) => node.type === 'start');
    const endNodes = nodes.filter((node) => node.type === 'end');
    
    if (startNodes.length === 0) {
      issues.push({ type: 'error', message: 'Missing start node' });
    }
    if (endNodes.length === 0) {
      issues.push({ type: 'error', message: 'Missing end node' });
    }

    return {
      valid: issues.length === 0,
      message: issues.length === 0 ? 'Flowchart is valid' : 'Flowchart has issues',
      issues,
    };
  }


  if (nodes.length === 0) {
    return {
      valid: false,
      message: 'Flowchart is empty',
      issues: [{ type: 'error', message: 'Flowchart has no nodes' }],
    };
  }

  const startNodes = nodes.filter((node) => node.type === 'start');
  if (startNodes.length === 0) {
    issues.push({ type: 'error', message: 'Missing start node' });
  } else if (startNodes.length > 1) {
    issues.push({
      type: 'error',
      message: 'Multiple start nodes detected',
      nodeIds: startNodes.map((node) => node.id),
    });
  }

  const endNodes = nodes.filter((node) => node.type === 'end');
  if (endNodes.length === 0) {
    issues.push({ type: 'error', message: 'Missing end node' });
  }

  const connectedNodeIds = new Set<string>();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const unconnectedNodes = nodes.filter(
    (node) => !connectedNodeIds.has(node.id)
  );
  if (unconnectedNodes.length > 0) {
    issues.push({
      type: 'error',
      message: `${unconnectedNodes.length} unconnected node(s) detected`,
      nodeIds: unconnectedNodes.map((node) => node.id),
    });
  }

  if (startNodes.length === 1) {
    const startNodeId = startNodes[0].id;
    const startNodeIncoming = edges.filter((edge) => edge.target === startNodeId);
    if (startNodeIncoming.length > 0) {
      issues.push({
        type: 'error',
        message: 'Start node should not have incoming connections',
        nodeIds: [startNodeId],
        edgeIds: startNodeIncoming.map((edge) => edge.id),
      });
    }
  }

  for (const endNode of endNodes) {
    const endNodeOutgoing = edges.filter((edge) => edge.source === endNode.id);
    if (endNodeOutgoing.length > 0) {
      issues.push({
        type: 'error',
        message: 'End node has outgoing connections',
        nodeIds: [endNode.id],
        edgeIds: endNodeOutgoing.map((edge) => edge.id),
      });
    }
  }

  const nonEndNodes = nodes.filter((node) => node.type !== 'end');
  for (const node of nonEndNodes) {
    const outgoingEdges = edges.filter((edge) => edge.source === node.id);
    if (outgoingEdges.length === 0) {
      issues.push({
        type: 'warning',
        message: `Node "${node.data.label}" has no outgoing connections`,
        nodeIds: [node.id],
      });
    }
  }

  // Proceed with cycle detection only if there are no "ForLoop" nodes
  let cycleFound = false;
  if (!hasForLoop && startNodes.length === 1) {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycleEdges: string[] = [];
    let involvedNodes: string[] = [];

    const findCycle = (nodeId: string, path: Edge[] = [], nodeIdsInPath: string[] = []): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);
      nodeIdsInPath.push(nodeId);

      const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        const currentPath = [...path, edge];
        const currentNodeIds = [...nodeIdsInPath];

        if (!visited.has(edge.target)) {
          if (findCycle(edge.target, currentPath, currentNodeIds)) {
            cycleEdges.push(edge.id);
            involvedNodes.push(edge.target);
            return true;
          }
        } else if (recursionStack.has(edge.target)) {
          cycleEdges.push(edge.id);
          involvedNodes.push(edge.target);
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    findCycle(startNodes[0].id);

    if (cycleEdges.length > 0) {
      issues.push({
        type: 'error',
        message: 'Cycle detected in the flowchart',
        edgeIds: cycleEdges,
        nodeIds: involvedNodes,
      });
    }
  }

  return {
    valid: issues.length === 0,
    message: issues.length === 0 ? 'Flowchart is valid' : 'Flowchart has issues',
    issues,
  };
}
