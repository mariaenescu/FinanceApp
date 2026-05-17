import { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { firmService, financeService, userService } from '../api/services';
import type { FirmDTO, Category, TransactionDTO } from '../types';
import UpgradeToFirm from '../components/firms/UpgradeToFirm';
import RecentFirmPayments from '../components/firms/RecentFirmPayments';
import FirmsList from '../components/firms/FirmsList';
import { Filter } from 'lucide-react';
import { Card, View, Text, Button } from '../components/ui';

const categories: Exclude<Category, 'USER'>[] = ['BILLS', 'ENTERTAINMENT', 'FOOD', 'SHOPPING', 'TRANSPORTATION'];

export default function FirmsPage() {
  const [firms, setFirms] = useState<FirmDTO[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [accountCategory, setAccountCategory] = useState<Category | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | Category>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [fList, rList, user] = await Promise.all([
        firmService.listFirms(selectedCategory === 'ALL' ? undefined : selectedCategory),
        financeService.getRecentFirmPayments(),
        userService.getProfile()
      ]);

      setFirms(fList);
      setAccountCategory(user.account?.category || 'USER');

      const recentItems = rList.map((t: TransactionDTO, idx: number) => ({
        id: `${t.type}-${idx}`,
        title: `To ${t.fromOrTo}`,
        subtitle: t.description,
        amount: t.amount,
        type: t.type
      }));
      setRecent(recentItems);
    } catch (err) {
      console.error('Failed to fetch firms data', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  async function handleSendMoney(payload: { iban: string; amount: number; message?: string; pin?: string }) {
    try {
      await financeService.createExpense({
        ibanReceiver: payload.iban,
        amount: payload.amount,
        description: payload.message || '',
        pin: payload.pin
      });
      alert('Payment sent successfully!');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Payment failed.');
    }
  };

  async function handleUpgrade(cat: Exclude<Category, 'USER'>) {
    try {
      await firmService.upgradeToFirm(cat);
      setAccountCategory(cat);
      alert(`Account upgraded to Firm (${cat})`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Upgrade failed.');
    }
  };

  return (
    <Layout>
      <View className="fade-in">
        <header style={{ marginBottom: 32 }}>
          <Text variant="h1" style={{ fontSize: 28, marginBottom: 6 }}>Firms & Businesses</Text>
          <Text color="#848484">Go pro as a firm or pay trusted businesses in seconds</Text>
        </header>

        <View grid gridCols="1fr 1.2fr" gap={24} style={{ alignItems: 'stretch' }}>
          <View flex direction="column" gap={16}>
            <UpgradeToFirm accountCategory={accountCategory} categories={categories} onUpgraded={handleUpgrade} />

            <Card padding={24}>
              <Text variant="h2" size={17} style={{ marginBottom: 12 }}>Filter by Category</Text>
              <View flex gap={8} style={{ flexWrap: 'wrap' }}>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCategory('ALL')}
                  style={{
                    background: selectedCategory === 'ALL' ? '#4285F4' : '#f3f4f6',
                    color: selectedCategory === 'ALL' ? 'white' : '#333333'
                  }}
                >
                  <Filter size={14} />
                  All
                </Button>
                {categories.map(cat => (
                  <Button
                    variant="ghost"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: selectedCategory === cat ? '#4285F4' : '#f3f4f6',
                      color: selectedCategory === cat ? 'white' : '#333333'
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </View>
            </Card>

            <View style={{ flex: 1 }}>
              <RecentFirmPayments items={recent} />
            </View>
          </View>

          <View>
            <FirmsList
              firms={firms}
              onPay={handleSendMoney}
              onError={(msg) => alert(msg)}
            />
          </View>
        </View>

        {loading && firms.length === 0 && (
          <View style={{ textAlign: 'center', marginTop: 20 }}>
            <Text color="#848484">Loading firms...</Text>
          </View>
        )}
      </View>
    </Layout>
  );
}