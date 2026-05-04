import { ClusterColumn } from './ClusterColumn'
import { clusters, diagramNodes } from '../../data/diagram'

interface RoadmapProps {
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

export function Roadmap({ selectedNodeId, onNodeClick }: RoadmapProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        padding: '2rem 1.5rem 4rem',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {clusters.map((cluster) => (
        <ClusterColumn
          key={cluster.id}
          cluster={cluster}
          nodes={diagramNodes.filter((n) => n.cluster === cluster.id)}
          selectedNodeId={selectedNodeId}
          onNodeClick={onNodeClick}
        />
      ))}
    </div>
  )
}
