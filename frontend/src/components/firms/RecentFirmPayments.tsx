import React from 'react';

type TxType = 'INCOME' | 'EXPENSE';
interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TxType;
}

interface RecentFirmPaymentsProps {
  items: RecentItem[];
}

const RecentFirmPayments: React.FC<RecentFirmPaymentsProps> = ({ items }) => {
  const formatRON = (n: number) => 
    n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px' }}>Recent Payments</h2>
      
      {items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No recent payments
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '10px' }}>
          {items.map((item) => (
            <li key={item.id} style={{ 
              background: '#f8fafc', 
              border: '1px solid var(--line)', 
              borderRadius: '12px', 
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentFirmPayments;
