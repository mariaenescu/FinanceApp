import { useState, useEffect } from 'react';
import { Card, View, Text, Button, Input } from '../ui';

interface QuickActionsProps {
  state: 'idle' | 'add' | 'send';
  onAddMode: () => void;
  onSendMode: () => void;
  onBack: () => void;
  onAddFriend: (iban: string) => void;
  onSendMoney: (iban: string, amount: number, message?: string) => void;
  onValidationError: (msg: string) => void;
}

export default function FriendsQuickActions({
  state,
  onAddMode,
  onSendMode,
  onBack,
  onAddFriend,
  onSendMoney,
  onValidationError
}: QuickActionsProps) {
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
    <Card padding={24}>
      <Text variant="h2" size={18} style={{ marginBottom: 20 }}>Quick Actions</Text>

      {state === 'idle' ? (
        <View grid gridCols="1fr 1fr" gap={16}>
          <Button variant="primary" style={{ padding: 12, borderRadius: 10 }} onClick={onAddMode}>Add New Friend</Button>
          <Button variant="secondary" style={{ padding: 12, borderRadius: 10 }} onClick={onSendMode}>Send Money</Button>
        </View>
      ) : (
        <View grid gap={16}>
          <View grid gap={6}>
            <Text variant="label">{state === 'add' ? 'Friend IBAN' : 'Receiver IBAN'}</Text>
            <Input placeholder="ROxx xxxx xxxx xxxx ..." value={iban} onChange={(e) => setIban(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleConfirm()} />
          </View>

          {state === 'send' && (
            <>
              <View grid gap={6}>
                <Text variant="label">Amount</Text>
                <Input type="number" placeholder="e.g. 250" value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleConfirm()} />
              </View>
              <View grid gap={6}>
                <Text variant="label">Message (optional)</Text>
                <Input placeholder="Description..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleConfirm()} />
              </View>
            </>
          )}

          <View flex justify="flex-end" gap={12} style={{ marginTop: 8 }}>
            <Button variant="secondary" style={{ padding: '10px 20px', borderRadius: 10 }} onClick={onBack}>Cancel</Button>
            <Button variant="primary" style={{ width: 'auto', padding: '10px 24px', margin: 0, borderRadius: 10 }} disabled={state === 'add' ? !iban : (!iban || !amount)} onClick={handleConfirm}>Confirm</Button>
          </View>
        </View>
      )}
    </Card>
  );
}