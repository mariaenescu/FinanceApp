import { useState, useEffect } from 'react';
import { Send, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Category } from '../../types';
import { Card, View, Text, Button, Input } from '../ui';

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

interface FirmItemCardProps {
  firm: Firm;
  isOpen: boolean;
  onToggle: () => void;
  amount: string;
  setAmount: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  pin: string;
  setPin: (val: string) => void;
  onPay: (firm: Firm) => void;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).map(w => w[0]?.toUpperCase()).join('');
}

export default function FirmsList({ firms, onPay, onError }: FirmsListProps) {
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

  return (
    <Card flex direction="column" style={{ height: '100%' }} padding={24}>
      <View flex align="center" justify="space-between" style={{ marginBottom: 20 }}>
        <Text variant="h2" size={18}>Firms ({firms.length})</Text>
      </View>

      <View grid gap={12} style={{ flex: 1 }}>
        {pageItems.map((f) => (
          <FirmItemCard
            key={f.iban}
            firm={f}
            isOpen={sendFor === f.iban}
            onToggle={() => toggleSend(f.iban)}
            amount={amount}
            setAmount={setAmount}
            message={message}
            setMessage={setMessage}
            pin={pin}
            setPin={setPin}
            onPay={attemptSend}
          />
        ))}

        {firms.length === 0 && (
          <View style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text color="#848484">No firms available</Text>
          </View>
        )}
      </View>

      <PaginationControls page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
    </Card>
  );
}

function FirmItemCard({
  firm,
  isOpen,
  onToggle,
  amount,
  setAmount,
  message,
  setMessage,
  pin,
  setPin,
  onPay
}: FirmItemCardProps) {
  const needsPin = parseFloat(amount) > 100;

  return (
    <View bg="#ffffff" border="1px solid #e5e7eb" borderRadius={12} padding={16} grid gridCols="1fr auto" gap={12} align="center">
      <View flex align="center" gap={14}>
        <View style={{ width: 42, height: 42, fontWeight: 700, color: '#fff', background: colorByCategory[firm.category] || '#a9b0bb' }} borderRadius={12} flex align="center" justify="center">
          {getInitials(firm.fullName)}
        </View>
        <View grid gap={2}>
          <Text weight={600} size={15}>{firm.fullName}</Text>
          <Text color="#848484" size={14}>{firm.email}</Text>
        </View>
      </View>

      <View flex align="center" gap={12}>
        <Text variant="caption" style={{ border: `1px solid ${colorByCategory[firm.category]}`, color: colorByCategory[firm.category], fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8 }}>
          {firm.category}
        </Text>
        <Button variant="icon" onClick={onToggle} style={{ width: 38, height: 38, background: isOpen ? '#4285F4' : '#e3eaf6', color: isOpen ? 'white' : '#4285F4', transition: 'all 0.2s' }}>
          {isOpen ? <X size={18} /> : <Send size={18} />}
        </Button>
      </View>

      {isOpen && (
        <View style={{ gridColumn: '1 / -1', marginTop: 12, backgroundColor: '#f0f2f5' }} flex gap={12} align="center" padding={16} border="1px solid #e5e7eb" borderRadius={10}>
          <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: 110, padding: 10, borderRadius: 8, fontSize: 14 }} />
          <Input type="text" placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 8, fontSize: 14 }} />
          {needsPin && (
            <Input type="password" placeholder="PIN" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: 80, padding: 10, borderRadius: 8, fontSize: 14 }} />
          )}
          <Button variant="primary" style={{ width: 'auto', padding: '10px 20px', margin: 0, borderRadius: 8 }} onClick={() => onPay(firm)}>Pay</Button>
        </View>
      )}
    </View>
  );
}

function PaginationControls({ page, totalPages, onPrev, onNext }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <View flex align="center" justify="flex-end" gap={12} style={{ marginTop: 20 }}>
      <Button variant="icon" disabled={page === 1} onClick={onPrev} style={{ padding: '6px 12px', background: '#e3eaf6', color: '#4285F4', opacity: page === 1 ? 0.5 : 1 }}>
        <ChevronLeft size={18} />
      </Button>

      <Text size={14} color="#848484" weight={600}>{page} / {totalPages}</Text>

      <Button variant="icon" disabled={page === totalPages} onClick={onNext} style={{ padding: '6px 12px', background: '#e3eaf6', color: '#4285F4', opacity: page === totalPages ? 0.5 : 1 }}>
        <ChevronRight size={18} />
      </Button>
    </View>
  );
}