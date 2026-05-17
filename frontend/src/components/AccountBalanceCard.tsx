import { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { Card, View, Text, Button } from './ui';

interface AccountBalanceCardProps {
  balance: number;
  owner: string;
  cardNumberMasked?: string;
  cardNumber?: string;
  expirationDate?: {
    year: number;
    month: string;
    monthValue: number;
  };
  cvvNumber?: string | number;
}

export default function AccountBalanceCard({
  balance,
  owner,
  cardNumberMasked = '**** **** **** ****',
  cardNumber = '',
  expirationDate,
  cvvNumber = ''
}: AccountBalanceCardProps) {
  const [isHidden, setIsHidden] = useState(true);
  const toggle = () => setIsHidden(!isHidden);

  const currency = (n: number) =>
    new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const fullCardNumber = cardNumber.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();

  const getExpiry = () => {
    if (!expirationDate) return '**/0*';

    let month = '';
    let year = '';

    if (typeof expirationDate === 'string') {
      const parts = (expirationDate as string).split('-');
      if (parts.length >= 2) {
        year = parts[0].slice(-2);
        month = parts[1];
      }
    } else if (expirationDate && typeof expirationDate === 'object') {
      month = String(expirationDate.monthValue || '').padStart(2, '0');
      year = String(expirationDate.year || '').slice(-2);
    }

    if (!month || !year) return '**/0*';
    return `${month}/${year}`;
  };

  return (
    <Card bg="#1e293b" color="white" borderRadius={20} padding={24} style={{ minHeight: 220 }} flex direction="column" justify="space-between">
      {isHidden ? (
        <>
          <View flex align="center" justify="space-between">
            <View flex align="center" gap={12}>
              <View bg="rgba(255,255,255,0.15)" borderRadius="50%" padding={8}>
                <User size={20} />
              </View>
              <Text weight={700} size={18} color="white">{owner}</Text>
            </View>
            <Button variant="icon" onClick={toggle} title="Show card details" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <EyeOff size={20} />
            </Button>
          </View>

          <View>
            <Text size={14} color="rgba(255,255,255,0.8)" style={{ marginBottom: 4 }}>Total Balance</Text>
            <Text size={35} weight={800} color="white" style={{ marginBottom: 12 }}>
              {currency(balance)}
            </Text>
            <Text size={16} color="rgba(255,255,255,0.85)" style={{ letterSpacing: 2, fontFamily: 'monospace' }}>
              {cardNumberMasked}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View flex align="center" justify="space-between">
            <View bg="rgba(255,255,255,0.15)" borderRadius={12} padding="4px 12px">
              <Text size={14} color="white" style={{ fontFamily: 'monospace' }}>Virtual Card</Text>
            </View>
            <Button variant="icon" onClick={toggle} title="Hide card details" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <Eye size={20} />
            </Button>
          </View>

          <View flex direction="column" gap={16}>
            <View>
              <Text size={13} color="rgba(255,255,255,0.8)">Card Number</Text>
              <Text weight={700} size={18} color="white" style={{ fontFamily: 'monospace', marginTop: 2 }}>{fullCardNumber}</Text>
            </View>
            <View grid gridCols="1fr 1fr" gap={16}>
              <View>
                <Text size={13} color="rgba(255,255,255,0.8)">Expiry Date</Text>
                <Text weight={700} color="white" style={{ fontFamily: 'monospace', marginTop: 2 }}>{getExpiry()}</Text>
              </View>
              <View>
                <Text size={13} color="rgba(255,255,255,0.8)">CVV</Text>
                <Text weight={700} color="white" style={{ fontFamily: 'monospace', marginTop: 2 }}>{cvvNumber}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </Card>
  );
}