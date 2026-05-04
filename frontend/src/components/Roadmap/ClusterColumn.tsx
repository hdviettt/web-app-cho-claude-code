import { ItemCard } from './ItemCard'
import type { Cluster, DiagramNode } from '../../data/diagram'

interface ClusterColumnProps {
  cluster: Cluster
  nodes: DiagramNode[]
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

export function ClusterColumn({ cluster, nodes, selectedNodeId, onNodeClick }: ClusterColumnProps) {
  // Sắp xếp: parent trước, children sau (theo thứ tự gốc trong data file).
  const parents = nodes.filter((n) => !n.parent)
  const children = nodes.filter((n) => n.parent)

  return (
    <section
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
      }}
    >
      <header
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          background: `linear-gradient(180deg, ${cluster.accent}0d 0%, ${cluster.accent}00 100%)`,
          borderTop: `3px solid ${cluster.accent}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: cluster.accent,
            marginBottom: 4,
          }}
        >
          {cluster.title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>
          {cluster.subtitle}
        </div>
      </header>

      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {parents.map((parent) => {
          const myChildren = children.filter((c) => c.parent === parent.id)
          return (
            <div key={parent.id}>
              <ItemCard
                node={parent}
                accent={cluster.accent}
                isSelected={selectedNodeId === parent.id}
                onClick={() => onNodeClick(parent.id)}
              />
              {myChildren.length > 0 && (
                <div
                  style={{
                    marginLeft: 18,
                    marginTop: 4,
                    paddingLeft: 12,
                    borderLeft: `1.5px dashed ${cluster.accent}55`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  {myChildren.map((child) => (
                    <ItemCard
                      key={child.id}
                      node={child}
                      accent={cluster.accent}
                      isSelected={selectedNodeId === child.id}
                      onClick={() => onNodeClick(child.id)}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
