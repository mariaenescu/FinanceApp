import { useNavigate } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Card, View, Text, Button, List, ListItem } from './ui';

interface TransactionItemProps {
  id: string;
  fromOrTo: string;
  description: string;
  date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  currency?: string;
}

interface TransactionListProps {
  items: TransactionItemProps[];
  count?: number;
}

export default function TransactionList({ items, count }: TransactionListProps) {
  const navigate = useNavigate();
  const limitedItems = count ? items.slice(0, count) : items;

  return (
    <Card padding={24}>
      <View style={{ paddingBottom: 16, borderBottom: '1px solid #e5e7eb', marginBottom: 16 }} flex justify="space-between" align="center">
        <Text weight={700} size={18}>Recent Transactions ({limitedItems.length})</Text>
        <Button
          variant="secondary"
          onClick={() => navigate('/transaction-history')}
          style={{ padding: '8px 16px', fontSize: 14, color: '#4285F4', border: 'none' }}
        >
          View All
        </Button>
      </View>
      <List gap={12}>
        {limitedItems.map((item) => (
          <TransactionItem key={item.id} {...item} />
        ))}
        {limitedItems.length === 0 && (
          <ListItem style={{ textAlign: 'center', padding: '32px 0' }}>
            <Text size={14} color="#848484">No recent transactions</Text>
          </ListItem>
        )}
      </List>
    </Card>
  );
}

function TransactionItem({
  fromOrTo,
  description,
  date,
  amount,
  type,
  currency = 'RON'
}: TransactionItemProps) {
  function formatCurrency(n: number) {
    return `${Math.abs(n).toLocaleString('ro-RO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${currency}`;
  }

  return (
    <ListItem padding="12px 16px" flex align="center" justify="space-between" bg="#ffffff" borderRadius={12} border="1px solid #e5e7eb">
      <View flex align="center" gap={14}>
        <View style={{
          width: 40,
          height: 40,
          background: type === 'INCOME' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(181, 35, 35, 0.1)',
          color: type === 'INCOME' ? '#10b981' : '#b52323'
        }} borderRadius={12} flex align="center" justify="center">
          {type === 'INCOME' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </View>
        <View grid gap={2}>
          <Text weight={600} size={15}>{fromOrTo}</Text>
          <Text size={14} color="#848484">{description}</Text>
          <Text size={12} color="#afacac">{date}</Text>
        </View>
      </View>
      <Text weight={700} size={16} color={type === 'INCOME' ? '#10b981' : '#b52323'}>
        {type === 'INCOME' ? '+' : '-'}{formatCurrency(amount)}
      </Text>
    </ListItem>
  );
}