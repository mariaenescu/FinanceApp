import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { financeService } from '../api/services';
import type { TransactionDTO } from '../types';
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar
} from 'lucide-react';
import { Card, View, Text, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await financeService.getHistory();
      setTransactions(data.lastTransactions);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'ALL') return true;
    return tx.type === filter;
  });

  return (
    <Layout>
      <View className="fade-in">
        <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text variant="h1" style={{ marginBottom: 8 }}>History</Text>
            <Text color="#848484">Track every transaction across your accounts</Text>
          </View>
        </header>

        <Card style={{ marginBottom: 32 }} flex justify="space-between" align="center" padding="16px 24px">
          <View flex gap={8}>
            {['ALL', 'INCOME', 'EXPENSE'].map((f) => (
              <Button
                variant="ghost"
                key={f}
                onClick={() => setFilter(f as any)}
                style={{
                  backgroundColor: filter === f ? '#4285F4' : '#f0f2f5',
                  color: filter === f ? 'white' : '#333333',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </Button>
            ))}
          </View>
          <View style={{ position: 'relative', width: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#848484' }} />
            <Input
              type="text"
              style={{
                paddingLeft: 44,
                paddingRight: 16,
                backgroundColor: '#f0f2f5',
                border: '1px solid #ccc',
                borderRadius: 10,
                width: '100%',
                paddingTop: 10,
                paddingBottom: 10
              }}
              placeholder="Search transactions..."
            />
          </View>
        </Card>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>Date</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Category / Contact</TableHead>
                <TableHead align="right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <View flex align="center" gap={12} style={{ color: '#848484' }}>
                      <Calendar size={16} />
                      <Text size={15}>{new Date(tx.date).toLocaleDateString()}</Text>
                    </View>
                  </TableCell>
                  <TableCell>
                    <View flex align="center" gap={16}>
                      <View style={{
                        width: 40,
                        height: 40,
                        backgroundColor: tx.type === 'INCOME' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                      }} borderRadius={10} flex align="center" justify="center">
                        {tx.type === 'INCOME' ? <ArrowDownLeft color="#10b981" size={18} /> : <ArrowUpRight color="#ef4444" size={18} />}
                      </View>
                      <View>
                        <Text weight={600} size={15}>{tx.description}</Text>
                        <Text size={13} color="#848484">{tx.type}</Text>
                      </View>
                    </View>
                  </TableCell>
                  <TableCell>
                    <Text variant="caption" style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      backgroundColor: '#f1f5f9',
                      fontSize: 13,
                      color: '#475569',
                      fontWeight: 500
                    }}>
                      {tx.fromOrTo}
                    </Text>
                  </TableCell>
                  <TableCell align="right">
                    <Text weight={700} size={17} style={{
                      color: tx.type === 'INCOME' ? '#10b981' : '#333333'
                    }}>
                      {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('ro-RO')} RON
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTransactions.length === 0 && !loading && (
            <View flex direction="column" align="center" justify="center" style={{ padding: 80 }}>
              <History size={48} style={{ opacity: 0.2, marginBottom: 20 }} />
              <Text color="#848484">No transactions found.</Text>
            </View>
          )}
        </Card>
      </View>
    </Layout>
  );
}