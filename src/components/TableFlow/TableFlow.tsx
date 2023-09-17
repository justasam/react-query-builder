import ReactFlow, {
  Background,
  Edge,
  Node,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import "reactflow/dist/style.css";

import { tableFlowData } from "mocks";

import TableNode from "./TableNode";
import { useCallback, useState } from "react";

const nodeTypes = {
  table: TableNode,
};

const data = tableFlowData;

function getNodeCoordinatesWithRandomOffset(
  nodeIndex: number,
  nodeArrayLength: number,
  width: number,
  maxOffsetX: number,
  maxOffsetY: number
): { x: number; y: number } {
  // Calculate the number of columns needed to form a square-ish structure
  const sideLength = Math.ceil(Math.sqrt(nodeArrayLength));
  const numCols = sideLength;

  // Find the row and column of the given node index
  const row = Math.floor(nodeIndex / numCols);
  const col = nodeIndex % numCols;

  // Calculate X and Y coordinates with width
  let x = col * width;
  let y = row * width;

  // Introduce random offsets
  const offsetX = Math.random() * maxOffsetX;
  const offsetY = Math.random() * maxOffsetY;

  // Apply offsets to coordinates
  x += offsetX;
  y += offsetY;

  // Return the X and Y coordinates as an object
  return { x, y };
}

const initialNodes: Array<Node> = data.Tables.map((table, index) => ({
  id: table.table,
  type: "table",
  data: table,
  position: getNodeCoordinatesWithRandomOffset(
    index,
    data.Tables.length,
    250,
    20,
    20
  ),
}));

const initialEdges: Array<Edge> = data.Relationships.map((relationship) => ({
  id: uuidv4(),
  source: relationship.From.Table,
  target: relationship.To.Table,
  label: relationship.Type,
  animated: true,
  sourceHandle: relationship.From.Table,
  targetHandle: relationship.To.Table + "target",
}));

console.log(initialEdges);

const TableFlow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: "800px", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default TableFlow;
