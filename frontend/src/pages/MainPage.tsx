import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { financeService, userService } from '../api/services';
import type { UserResponseDTO, HistorySummaryDTO, DashboardStatsDTO } from '../types';
import AccountBalanceCard from '../components/AccountBalanceCard';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import { Plus, X, Banknote } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

const MainPage: React.FC = () => {
  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [history, setHistory] = useState<HistorySummaryDTO | null>(null);
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addAmount, setAddAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isTopupLoading, setIsTopupLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prof, hist, st] = await Promise.all([
        userService.getProfile(),
        financeService.getHistory(),
        financeService.getStats()
      ]);
      setProfile(prof);
      setHistory(hist);
      setStats(st);
    } catch (err: any) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(addAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsTopupLoading(true);
    try {
      await financeService.topup({
        amount: amountNum,
        description: description || 'Top up'
      });
      await fetchData();
      setShowAddDialog(false);
      setAddAmount('');
      setDescription('');
      setShowFeedback(true);
    } catch (err: any) {
      alert(err.message || 'Top up failed.');
    } finally {
      setIsTopupLoading(false);
    }
  };

  if (loading && !profile) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  const currentSummary = selectedPeriod === 'month' ? stats?.monthSummary : stats?.weekSummary;
  const summaryData = {
    income: currentSummary?.incomes || 0,
    expenses: currentSummary?.expense || 0,
    net: currentSummary?.netSavings || 0
  };

  return (
    <Layout>
      <div className="fade-in dashboard-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px', alignItems: 'start' }}>
          <div style={{ paddingRight: '12px' }}>
            <AccountBalanceCard
              balance={profile?.account?.balance || 0}
              owner={profile?.fullName || '-'}
              cardNumberMasked={profile?.account?.card?.cardNumberMasked}
              cardNumber={profile?.account?.card?.cardNumber}
              expirationDate={profile?.account?.card?.expirationDate}
              cvvNumber={profile?.account?.card?.cvvNumber}
            />
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setShowAddDialog(true)}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: 'fit-content',
                  padding: '12px 32px',
                  fontSize: '1.1rem'
                }}
              >
                <Plus size={24} />
                Add money
              </button>
            </div>
          </div>

          <div style={{ paddingLeft: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Current {selectedPeriod === 'month' ? 'Month' : 'Week'}</h2>
              <div style={{ display: 'flex', background: '#e5e7eb', borderRadius: '8px', padding: '4px' }}>
                <button
                  onClick={() => setSelectedPeriod('week')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    background: selectedPeriod === 'week' ? 'white' : 'transparent',
                    boxShadow: selectedPeriod === 'week' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    background: selectedPeriod === 'month' ? 'white' : 'transparent',
                    boxShadow: selectedPeriod === 'month' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Month
                </button>
              </div>
            </div>
            <SummaryCards data={summaryData} period={selectedPeriod} />
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <TransactionList items={(history?.lastTransactions as any) || []} count={5} />
        </div>

        {showAddDialog && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <div className="card fade-in" style={{ width: '100%', maxWidth: '520px', padding: 0 }}>
              <div style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent-primary)',
                    padding: '10px',
                    borderRadius: '12px'
                  }}>
                    <Banknote size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add money</h3>
                </div>
                <button onClick={() => setShowAddDialog(false)} style={{ color: 'var(--text-secondary)' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddMoney} style={{ padding: '24px' }}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Amount (RON)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    style={{ fontSize: '1.1rem', padding: '12px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Savings"
                    style={{ fontSize: '1.1rem', padding: '12px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddDialog(false)}
                    style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTopupLoading}
                    className="btn-primary"
                    style={{ padding: '12px 32px', width: 'auto' }}
                  >
                    {isTopupLoading ? 'Processing...' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      </div>
    </Layout>
  );
};

export default MainPage;
