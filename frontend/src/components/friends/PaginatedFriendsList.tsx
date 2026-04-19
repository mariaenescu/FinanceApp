import React, { useState, useEffect } from 'react';
import { Send, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Friend {
  fullName: string;
  email: string;
  iban: string;
}

interface PaginatedFriendsListProps {
  friends: Friend[];
  onSendMoney: (payload: { iban: string; amount: number; message?: string }) => void;
  onValidationError: (msg: string) => void;
}

const PaginatedFriendsList: React.FC<PaginatedFriendsListProps> = ({
  friends,
  onSendMoney,
  onValidationError
}) => {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(friends.length / pageSize));

  const [sendFor, setSendFor] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [friends.length, totalPages]);

  const pageItems = friends.slice((page - 1) * pageSize, page * pageSize);

  const toggleSend = (iban: string) => {
    if (sendFor === iban) {
      setSendFor(null);
    } else {
      setSendFor(iban);
      setAmount('');
      setMessage('');
    }
  };

  const handleSendAndClose = (f: Friend) => {
    const a = parseFloat(amount);
    if (isNaN(a) || a <= 0) {
      onValidationError('Please enter a valid amount.');
      return;
    }
    onSendMoney({
      iban: f.iban,
      amount: a,
      message: message || undefined
    });
    setSendFor(null);
  };

  const getInitials = (name: string) =>
    name.split(' ').filter(Boolean).map(w => w[0]?.toUpperCase()).join('');

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Friends ({friends.length})</h2>
      </div>

      <div style={{ display: 'grid', gap: '12px', flex: 1 }}>
        {pageItems.map((f) => (
          <div key={f.iban} style={{
            background: 'white',
            border: '1px solid var(--line)',
            borderRadius: '16px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '12px',
            position: 'relative',
            transition: '120ms ease',
            boxShadow: sendFor === f.iban ? '0 8px 20px -4px rgba(0,0,0,0.08)' : 'none'
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
                background: '#2563eb'
              }}>
                {getInitials(f.fullName)}
              </div>
              <div style={{ display: 'grid', gap: '4px' }}>
                <div style={{ fontWeight: 700 }}>{f.fullName}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{f.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAndClose(f)}
                  style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid var(--line)' }}
                />
                <input
                  type="text"
                  placeholder="Message (opt)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAndClose(f)}
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--line)' }}
                />
                <button 
                  className="btn-primary"
                  style={{ width: 'auto', padding: '8px 16px', borderRadius: '6px' }}
                  onClick={() => handleSendAndClose(f)}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))}

        {friends.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No friends found.
          </div>
        )}
      </div>

      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default PaginatedFriendsList;
