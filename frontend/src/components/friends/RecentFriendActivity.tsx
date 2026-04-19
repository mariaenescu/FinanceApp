import React, { useState } from 'react';

type TxType = 'INCOME' | 'EXPENSE';
interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TxType;
  iban: string;
}

interface RecentFriendActivityProps {
  items: RecentItem[];
}

const RecentFriendActivity: React.FC<RecentFriendActivityProps> = ({ items }) => {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const formatRON = (n: number) => 
    n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const toggleReveal = (id: string) => {
    const next = new Set(revealed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealed(next);
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px' }}>Recent Activity</h2>

      {items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No recent activity
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '10px' }}>
          {items.map((item) => (
            <li 
              key={item.id} 
              onClick={() => toggleReveal(item.id)}
              style={{ 
                background: 'white', 
                border: '1px solid var(--line)', 
                borderRadius: '16px', 
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: revealed.has(item.id) ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
              title={revealed.has(item.id) ? 'Click to hide IBAN' : 'Click to reveal IBAN'}
            >
              {!revealed.has(item.id) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ color: '#97a3b6', fontSize: '.85rem' }}>{item.subtitle}</div>
                  </div>
                  <div style={{ 
                    fontWeight: 800, 
                    color: item.type === 'INCOME' ? '#22c55e' : '#ef4444' 
                  }}>
                    {item.type === 'INCOME' ? '+' : '-'}{formatRON(item.amount)} RON
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '6px' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Friend IBAN</div>
                  <code style={{ 
                    background: 'white', 
                    border: '1px dashed var(--line)', 
                    padding: '8px 10px', 
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    display: 'block'
                  }}>
                    {item.iban || '—'}
                  </code>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentFriendActivity;
