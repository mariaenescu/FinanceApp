import { useState } from 'react';
import { Card, View, Text, List, ListItem } from '../ui';

type TxType = 'INCOME' | 'EXPENSE';
interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TxType;
  iban: string;
}

interface RecentFriendActivityProps {
  items: RecentItem[];
}

export default function RecentFriendActivity({ items }: RecentFriendActivityProps) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const formatRON = (n: number) =>
    n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const toggleReveal = (id: string) => {
    const next = new Set(revealed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealed(next);
  };

  return (
    <Card flex direction="column" style={{ height: '100%' }} padding={24}>
      <Text variant="h2" size={18} style={{ marginBottom: 20 }}>Recent Activity</Text>

      {items.length === 0 ? (
        <View flex align="center" justify="center" style={{ flex: 1 }}>
          <Text color="#848484" size={15}>No recent activity</Text>
        </View>
      ) : (
        <List gap={12}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => toggleReveal(item.id)}
              bg="#ffffff"
              border="1px solid #e5e7eb"
              borderRadius={12}
              padding={16}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              title={revealed.has(item.id) ? 'Click to hide IBAN' : 'Click to reveal IBAN'}
            >
              {!revealed.has(item.id) ? (
                <View flex align="center" justify="space-between">
                  <View grid gap={2}>
                    <Text weight={600} size={15}>{item.title}</Text>
                    <Text color="#848484" size={14}>{item.subtitle}</Text>
                  </View>
                  <Text weight={700} size={16} color={item.type === 'INCOME' ? '#10b981' : '#b52323'}>
                    {item.type === 'INCOME' ? '+' : '-'}{formatRON(item.amount)} RON
                  </Text>
                </View>
              ) : (
                <View grid gap={6}>
                  <Text color="#848484" size={14} weight={600}>Friend IBAN</Text>
                  <Text variant="code" style={{
                    background: '#f0f2f5',
                    padding: '10px 14px',
                    borderRadius: 8,
                    color: '#333333',
                    display: 'block'
                  }}>
                    {item.iban || '—'}
                  </Text>
                </View>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
};