import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react'
import { useMemo } from 'react'
import { diagramNodes, diagramEdges } from '../../data/diagram'

interface CanvasProps {
  onNodeClick: (nodeId: string) => void
  selectedNodeId: string | null
}

export function Canvas({ onNodeClick, selectedNodeId }: CanvasProps) {
  const nodes: Node[] = useMemo(
    () =>
      diagramNodes.map((n) => {
        const isRoot = n.id === 'root'
        const isSelected = n.id === selectedNodeId
        return {
          id: n.id,
          position: n.position,
          data: { label: n.label },
          draggable: false,
          selectable: !isRoot,
          style: {
            background: isRoot ? 'var(--primary)' : isSelected ? '#f5f0ff' : 'white',
            color: isRoot ? 'white' : 'var(--fg)',
            border: `1.5px solid ${
              isRoot || isSelected ? 'var(--primary)' : 'var(--border)'
            }`,
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: isRoot ? 600 : 500,
            minWidth: 160,
            textAlign: 'center' as const,
            cursor: isRoot ? 'default' : 'pointer',
            boxShadow: isSelected ? '0 4px 12px rgba(124, 58, 237, 0.15)' : 'none',
            transition: 'all 0.15s ease',
          },
        }
      }),
    [selectedNodeId],
  )

  const edges: Edge[] = useMemo(
    () =>
      diagramEdges.map((e) => ({
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#d4d4d8', strokeWidth: 1.5 },
      })),
    [],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      onNodeClick={(_, node) => {
        if (node.id !== 'root') onNodeClick(node.id)
      }}
      minZoom={0.3}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
    >
      <Background gap={24} size={1} color="#eee" />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}
