import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

type TxType = 'INCOME' | 'EXPENSE';

interface TransactionItemProps {
  id: string;
  fromOrTo: string;
  description: string;
  date: string;
  amount: number;
  type: TxType;
  currency?: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  fromOrTo,
  description,
  date,
  amount,
  type,
  currency = 'RON'
}) => {
  const formatCurrency = (n: number) => {
    return `${Math.abs(n).toLocaleString('ro-RO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${currency}`;
  };

  return (
    <li style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: type === 'INCOME' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          color: type === 'INCOME' ? '#22c55e' : '#ef4444'
        }}>
          {type === 'INCOME' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div style={{ display: 'grid', gap: '2px' }}>
          <div style={{ fontWeight: 600 }}>{fromOrTo}</div>
          <div style={{ fontSize: '0.85rem', color: '#97a3b6' }}>{description}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{date}</div>
        </div>
      </div>
      <div style={{ fontWeight: 800, color: type === 'INCOME' ? '#22c55e' : '#ef4444' }}>
        {type === 'INCOME' ? '+' : '-'}{formatCurrency(amount)}
      </div>
    </li>
  );
};

interface TransactionListProps {
  items: TransactionItemProps[];
  count?: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ items, count }) => {
  const navigate = useNavigate();
  const limitedItems = count ? items.slice(0, count) : items;

  return (
    <div className="card" style={{ padding: '10px' }}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 800 }}>Recent Transactions ({limitedItems.length})</div>
        <button 
          onClick={() => navigate('/transaction-history')}
          style={{
            background: 'transparent',
            fontWeight: 600,
            letterSpacing: '.2px',
            borderRadius: '16px',
            padding: '8px 12px',
            color: 'var(--accent-primary)',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(121, 134, 203, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          View All
        </button>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: '12px', display: 'grid', gap: '10px' }}>
        {limitedItems.map((item) => (
          <TransactionItem key={item.id} {...item} />
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
