import React, { useState, useEffect } from 'react';
import { Send, ChevronLeft, ChevronRight, X } from 'lucide-react';

import type { Category } from '../../types';

interface Firm {
  fullName: string;
  email: string;
  iban: string;
  category: Category;
}

interface FirmsListProps {
  firms: Firm[];
  onPay: (payload: { iban: string; amount: number; message?: string; pin?: string }) => void;
  onError: (msg: string) => void;
}

const colorByCategory: Record<Category, string> = {
  BILLS: '#a855f7',
  ENTERTAINMENT: '#22c55e',
  FOOD: '#f97316',
  SHOPPING: '#0ea5e9',
  TRANSPORTATION: '#efde44',
  USER: '#a9b0bb',
};

const FirmsList: React.FC<FirmsListProps> = ({ firms, onPay, onError }) => {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(firms.length / pageSize));

  const [sendFor, setSendFor] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [firms.length, totalPages]);

  const pageItems = firms.slice((page - 1) * pageSize, page * pageSize);

  const toggleSend = (iban: string) => {
    if (sendFor === iban) {
      setSendFor(null);
    } else {
      setSendFor(iban);
      setAmount('');
      setMessage('');
      setPin('');
    }
  };

  const attemptSend = (firm: Firm) => {
    const a = parseFloat(amount);
    if (isNaN(a) || a <= 0) {
      onError('Please enter a valid amount.');
      return;
    }

    if (a > 100 && !/^\d{4}$/.test(pin)) {
      onError('PIN must be exactly 4 digits.');
      return;
    }

    onPay({
      iban: firm.iban,
      amount: a,
      message: message || undefined,
      pin: a > 100 ? pin : undefined
    });
    setSendFor(null);
  };

  const getInitials = (name: string) =>
    name.split(' ').filter(Boolean).map(w => w[0]?.toUpperCase()).join('');

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Firms ({firms.length})</h2>
      </div>

      <div style={{ display: 'grid', gap: '12px', flex: 1 }}>
        {pageItems.map((f) => (
          <div key={f.iban} style={{
            background: '#f8fafc',
            border: '1px solid var(--line)',
            borderRadius: '14px',
            padding: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '10px',
            position: 'relative',
            transition: '120ms ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '9999px',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                color: '#fff',
                background: colorByCategory[f.category] || '#a9b0bb'
              }}>
                {getInitials(f.fullName)}
              </div>
              <div style={{ display: 'grid', gap: '4px' }}>
                <div style={{ fontWeight: 700 }}>{f.fullName}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{f.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                border: `1px solid ${colorByCategory[f.category]}`,
                color: colorByCategory[f.category],
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {f.category}
              </span>
              <button 
                onClick={() => toggleSend(f.iban)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'grid',
                  placeItems: 'center',
                  background: sendFor === f.iban ? 'var(--accent-primary)' : 'transparent',
                  color: sendFor === f.iban ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--line)'
                }}
              >
                {sendFor === f.iban ? <X size={18} /> : <Send size={18} />}
              </button>
            </div>

            {sendFor === f.iban && (
              <div style={{
                gridColumn: '1 / -1',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginTop: '8px',
                padding: '10px',
                border: '1px dashed var(--line)',
                borderRadius: '10px',
                backgroundColor: 'white'
              }}>
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid var(--line)' }}
                />
                <input
                  type="text"
                  placeholder="Message (opt)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--line)' }}
                />
                {parseFloat(amount) > 100 && (
                  <input
                    type="password"
                    placeholder="PIN"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    style={{ width: '70px', padding: '8px', borderRadius: '6px', border: '1px solid var(--line)' }}
                  />
                )}
                <button 
                  className="btn-primary"
                  style={{ width: 'auto', padding: '8px 16px', borderRadius: '6px' }}
                  onClick={() => attemptSend(f)}
                >
                  Pay
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          style={{ padding: '4px', borderRadius: '6px', opacity: page === 1 ? 0.3 : 1 }}
        >
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {page} / {totalPages}
        </span>
        <button 
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          style={{ padding: '4px', borderRadius: '6px', opacity: page === totalPages ? 0.3 : 1 }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FirmsList;
