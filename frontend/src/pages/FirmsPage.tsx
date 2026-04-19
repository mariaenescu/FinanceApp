import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { firmService, financeService, userService } from '../api/services';
import type { FirmDTO, Category, TransactionDTO } from '../types';
import UpgradeToFirm from '../components/firms/UpgradeToFirm';
import RecentFirmPayments from '../components/firms/RecentFirmPayments';
import FirmsList from '../components/firms/FirmsList';
import { Filter } from 'lucide-react';

const categories: Exclude<Category, 'USER'>[] = ['BILLS', 'ENTERTAINMENT', 'FOOD', 'SHOPPING', 'TRANSPORTATION'];

const FirmsPage: React.FC = () => {
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

      // Transform recent payments to match component expected props
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

  const handleSendMoney = async (payload: { iban: string; amount: number; message?: string; pin?: string }) => {
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

  const handleUpgrade = async (cat: Exclude<Category, 'USER'>) => {
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
      <div className="fade-in">
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>Firms & Businesses</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Go pro as a firm or pay trusted businesses in seconds</p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'stretch' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <UpgradeToFirm
              accountCategory={accountCategory}
              categories={categories}
              onUpgraded={handleUpgrade}
            />

            <div className="card">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px' }}>Filter by Category</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: selectedCategory === 'ALL' ? 'var(--accent-primary)' : '#f3f4f6',
                    color: selectedCategory === 'ALL' ? 'white' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Filter size={14} />
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: selectedCategory === cat ? 'var(--accent-primary)' : '#f3f4f6',
                      color: selectedCategory === cat ? 'white' : 'var(--text-primary)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <RecentFirmPayments items={recent} />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <FirmsList
              firms={firms}
              onPay={handleSendMoney}
              onError={(msg) => alert(msg)}
            />
          </div>
        </section>

        {loading && firms.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>Loading firms...</div>
        )}
      </div>
    </Layout>
  );
};

export default FirmsPage;
