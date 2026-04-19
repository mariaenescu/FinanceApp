import React, { useState, useEffect } from 'react';

interface QuickActionsProps {
  state: 'idle' | 'add' | 'send';
  onAddMode: () => void;
  onSendMode: () => void;
  onBack: () => void;
  onAddFriend: (iban: string) => void;
  onSendMoney: (iban: string, amount: number, message?: string) => void;
  onValidationError: (msg: string) => void;
}

const FriendsQuickActions: React.FC<QuickActionsProps> = ({
  state,
  onAddMode,
  onSendMode,
  onBack,
  onAddFriend,
  onSendMoney,
  onValidationError
}) => {
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIban('');
    setAmount('');
    setMessage('');
  }, [state]);

  const normIban = (val: string) => val.replace(/\s+/g, '').toUpperCase();

  const handleConfirm = () => {
    const n = normIban(iban);
    if (!n) {
      onValidationError('Please enter an IBAN.');
      return;
    }
    if (!n.startsWith('RO') || n.length !== 18) {
      onValidationError('IBAN must be 18 characters (RO + 16), e.g. ROxxxxxxxxxxxxxxxx.');
      return;
    }

    if (state === 'add') {
      onAddFriend(n);
    } else if (state === 'send') {
      const a = parseFloat(amount);
      if (isNaN(a) || a <= 0) {
        onValidationError('Amount must be a positive number.');
        return;
      }
      onSendMoney(n, a, message || undefined);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px' }}>Quick Actions</h2>

      {state === 'idle' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button className="btn-primary" style={{ padding: '10px' }} onClick={onAddMode}>
            Add New Friend
          </button>
          <button className="btn-secondary" style={{ padding: '10px' }} onClick={onSendMode}>
            Send Money
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {state === 'add' ? 'Friend IBAN' : 'Receiver IBAN'}
            </label>
            <input
              className="form-group"
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--line)' }}
              placeholder="ROxx xxxx xxxx xxxx ..."
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
          </div>

          {state === 'send' && (
            <>
              <div style={{ display: 'grid', gap: '4px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amount</label>
                <input
                  className="form-group"
                  style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--line)' }}
                  type="number"
                  placeholder="e.g. 250"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                />
              </div>
              <div style={{ display: 'grid', gap: '4px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message (optional)</label>
                <input
                  className="form-group"
                  style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--line)' }}
                  placeholder="Description..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn-secondary" style={{ width: 'auto', padding: '8px 16px' }} onClick={onBack}>
              Cancel
            </button>
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '8px 16px' }}
              disabled={state === 'add' ? !iban : (!iban || !amount)}
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsQuickActions;
