import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { financeService } from '../api/services';
import type { TransactionDTO } from '../types';
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Calendar
} from 'lucide-react';

const TransactionHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await financeService.getHistory();
      setTransactions(data.lastTransactions);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'ALL') return true;
    return tx.type === filter;
  });

  return (
    <Layout>
      <div className="fade-in">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ marginBottom: '8px' }}>History</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track every transaction across your accounts</p>
          </div>
          <button className="card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontWeight: 600 }}>
            <Download size={18} />
            Export CSV
          </button>
        </header>

        <div className="card" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'INCOME', 'EXPENSE'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                style={{
                  padding: '8px 24px',
                  borderRadius: '10px',
                  backgroundColor: filter === f ? 'var(--accent-primary)' : '#f0f2f5',
                  color: filter === f ? 'white' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              style={{
                paddingLeft: '44px',
                paddingRight: '16px',
                backgroundColor: '#f0f2f5',
                border: '1px solid #ccc',
                borderRadius: '10px',
                width: '100%',
                paddingTop: '10px',
                paddingBottom: '10px'
              }}
              placeholder="Search transactions..."
            />
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <th style={{ padding: '16px 24px' }}>Date</th>
                <th style={{ padding: '16px 24px' }}>Transaction</th>
                <th style={{ padding: '16px 24px' }}>Category / Contact</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                      <Calendar size={16} />
                      <span style={{ fontSize: '0.9rem' }}>{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: tx.type === 'INCOME' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {tx.type === 'INCOME' ? <ArrowDownLeft color="#10b981" size={18} /> : <ArrowUpRight color="#ef4444" size={18} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tx.description}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tx.type}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: '#f1f5f9',
                      fontSize: '0.8rem',
                      color: '#475569',
                      fontWeight: 500
                    }}>
                      {tx.fromOrTo}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <p style={{
                      fontWeight: 700,
                      color: tx.type === 'INCOME' ? '#10b981' : 'var(--text-primary)',
                      fontSize: '1.05rem'
                    }}>
                      {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('ro-RO')} RON
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
              <History size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
              <p>No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TransactionHistoryPage;
