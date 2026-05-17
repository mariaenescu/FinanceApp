import { Card, View, Text, List, ListItem } from '../ui';

type TxType = 'INCOME' | 'EXPENSE';
interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TxType;
}

interface RecentFirmPaymentsProps {
  items: RecentItem[];
}

function formatRON(n: number) {
  return n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function PaymentListItem({ item }: { item: RecentItem }) {
  return (
    <ListItem bg="#ffffff" border="1px solid #e5e7eb" borderRadius={12} padding={16} flex align="center" justify="space-between">
      <View grid gap={2}>
        <Text weight={600} size={15}>{item.title}</Text>
        <Text color="#848484" size={14}>{item.subtitle}</Text>
      </View>
      <Text weight={700} size={16} color={item.type === 'INCOME' ? '#10b981' : '#b52323'}>
        {item.type === 'INCOME' ? '+' : '-'}{formatRON(item.amount)} RON
      </Text>
    </ListItem>
  );
}

export default function RecentFirmPayments({ items }: RecentFirmPaymentsProps) {
  return (
    <Card flex direction="column" style={{ height: '100%' }} padding={24}>
      <Text variant="h2" size={18} style={{ marginBottom: 20 }}>Recent Payments</Text>

      {items.length === 0 ? (
        <View flex align="center" justify="center" style={{ flex: 1 }}>
          <Text color="#848484" size={15}>No recent payments</Text>
        </View>
      ) : (
        <List gap={12}>
          {items.map((item) => (
            <PaymentListItem key={item.id} item={item} />
          ))}
        </List>
      )}
    </Card>
  );
}