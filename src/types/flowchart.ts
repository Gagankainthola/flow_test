import { Node, Edge } from "reactflow";

export interface Flowchart {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: number;
  updatedAt: number;
  modified?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}
