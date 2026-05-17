import { useState, useEffect } from 'react';
import { Send, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, View, Text, Button, Input } from '../ui';

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

export default function PaginatedFriendsList({
  friends,
  onSendMoney,
  onValidationError
}: PaginatedFriendsListProps) {
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
    <Card flex direction="column" style={{ height: '100%' }} padding={24}>
      <View flex align="center" justify="space-between" style={{ marginBottom: 20 }}>
        <Text variant="h2" size={18}>Friends ({friends.length})</Text>
      </View>

      <View grid gap={12} style={{ flex: 1 }}>
        {pageItems.map((f) => (
          <View key={f.iban} bg="#ffffff" border="1px solid #e5e7eb" borderRadius={12} padding={16} grid gridCols="1fr auto" gap={12} align="center">
            <View flex align="center" gap={14}>
              <View style={{ width: 42, height: 42, fontWeight: 700, color: '#fff', background: '#4285F4' }} borderRadius={12} flex align="center" justify="center">
                {getInitials(f.fullName)}
              </View>
              <View grid gap={2}>
                <Text weight={600} size={15}>{f.fullName}</Text>
                <Text color="#848484" size={14}>{f.email}</Text>
              </View>
            </View>

            <View flex align="center" gap={8}>
              <Button variant="icon" onClick={() => toggleSend(f.iban)} style={{ width: 38, height: 38, background: sendFor === f.iban ? '#4285F4' : '#e3eaf6', color: sendFor === f.iban ? 'white' : '#4285F4', transition: 'all 0.2s' }}>
                {sendFor === f.iban ? <X size={18} /> : <Send size={18} />}
              </Button>
            </View>

            {sendFor === f.iban && (
              <View style={{ gridColumn: '1 / -1', marginTop: 12, backgroundColor: '#f0f2f5' }} flex gap={12} align="center" padding={16} border="1px solid #e5e7eb" borderRadius={10}>
                <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendAndClose(f)} style={{ width: 110, padding: 10, borderRadius: 8, fontSize: 14 }} />
                <Input type="text" placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendAndClose(f)} style={{ flex: 1, padding: 10, borderRadius: 8, fontSize: 14 }} />
                <Button variant="primary" style={{ width: 'auto', padding: '10px 20px', margin: 0, borderRadius: 8 }} onClick={() => handleSendAndClose(f)}>Send</Button>
              </View>
            )}
          </View>
        ))}

        {friends.length === 0 && (
          <View style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text color="#848484">No friends found.</Text>
          </View>
        )}
      </View>

      {totalPages > 1 && (
        <View flex align="center" justify="flex-end" gap={12} style={{ marginTop: 20 }}>
          <Button variant="icon" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 12px', background: '#e3eaf6', color: '#4285F4', opacity: page === 1 ? 0.5 : 1 }}>
            <ChevronLeft size={18} />
          </Button>
          <Text size={14} color="#848484" weight={600}>{page} / {totalPages}</Text>
          <Button variant="icon" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 12px', background: '#e3eaf6', color: '#4285F4', opacity: page === totalPages ? 0.5 : 1 }}>
            <ChevronRight size={18} />
          </Button>
        </View>
      )}
    </Card>
  );
}