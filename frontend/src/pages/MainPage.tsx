import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { financeService, userService } from '../api/services';
import type { UserResponseDTO, HistorySummaryDTO, DashboardStatsDTO } from '../types';
import AccountBalanceCard from '../components/AccountBalanceCard';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import { Plus, X, Banknote } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';
import { Card, View, Text, Button, Input } from '../components/ui';

interface DashboardHeaderProps {
  profile: UserResponseDTO | null;
  onOpenTopup: () => void;
}

export default function MainPage() {
  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [history, setHistory] = useState<HistorySummaryDTO | null>(null);
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  async function fetchData() {
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
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleTopupSuccess() {
    await fetchData();
    setShowAddDialog(false);
    setShowFeedback(true);
  }

  if (loading && !profile) {
    return (
      <View style={{ padding: 32, textAlign: 'center' }}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  const currentSummary = selectedPeriod === 'month' ? stats?.monthSummary : stats?.weekSummary;
  const summaryData = {
    income: currentSummary?.incomes || 0,
    expenses: currentSummary?.expense || 0,
    net: currentSummary?.netSavings || 0
  };

  return (
    <Layout>
      <View className="fade-in dashboard-container">
        <View grid gridCols="1fr 2fr" gap={24} style={{ marginBottom: 32, alignItems: 'start' }}>
          <DashboardHeader profile={profile} onOpenTopup={() => setShowAddDialog(true)} />
          <DashboardOverview
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            summaryData={summaryData}
          />
        </View>

        <View style={{ marginTop: 40 }}>
          <TransactionList items={(history?.lastTransactions as any) || []} count={5} />
        </View>

        {showAddDialog && (
          <TopupModal onClose={() => setShowAddDialog(false)} onSuccess={handleTopupSuccess} />
        )}

        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      </View>
    </Layout>
  );
}

function DashboardHeader({ profile, onOpenTopup }: DashboardHeaderProps) {
  return (
    <View style={{ paddingRight: 12 }}>
      <AccountBalanceCard
        balance={profile?.account?.balance || 0}
        owner={profile?.fullName || '-'}
        cardNumberMasked={profile?.account?.card?.cardNumberMasked}
        cardNumber={profile?.account?.card?.cardNumber}
        expirationDate={profile?.account?.card?.expirationDate}
        cvvNumber={profile?.account?.card?.cvvNumber}
      />
      <View style={{ marginTop: 20 }}>
        <Button
          variant="primary"
          onClick={onOpenTopup}
          style={{ padding: '12px 32px', fontSize: 18, width: 'fit-content' }}
        >
          <Plus size={24} />
          Add money
        </Button>
      </View>
    </View>
  );
}

interface DashboardOverviewProps {
  selectedPeriod: 'week' | 'month';
  setSelectedPeriod: (val: 'week' | 'month') => void;
  summaryData: { income: number; expenses: number; net: number };
}

function DashboardOverview({
  selectedPeriod,
  setSelectedPeriod,
  summaryData
}: DashboardOverviewProps) {
  return (
    <View style={{ paddingLeft: 12 }}>
      <View flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Text variant="h2" size={24}>
          Current {selectedPeriod === 'month' ? 'Month' : 'Week'}
        </Text>
        <View flex style={{ background: '#e5e7eb', borderRadius: 8, padding: 4 }}>
          <Button
            variant="ghost"
            onClick={() => setSelectedPeriod('week')}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: 14,
              background: selectedPeriod === 'week' ? 'white' : 'transparent',
              boxShadow: selectedPeriod === 'week' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              color: selectedPeriod === 'week' ? '#333333' : '#848484'
            }}
          >
            Week
          </Button>
          <Button
            variant="ghost"
            onClick={() => setSelectedPeriod('month')}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: 14,
              background: selectedPeriod === 'month' ? 'white' : 'transparent',
              boxShadow: selectedPeriod === 'month' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              color: selectedPeriod === 'month' ? '#333333' : '#848484'
            }}
          >
            Month
          </Button>
        </View>
      </View>
      <SummaryCards data={summaryData} period={selectedPeriod} />
    </View>
  );
}

interface TopupModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function TopupModal({ onClose, onSuccess }: TopupModalProps) {
  const [addAmount, setAddAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isTopupLoading, setIsTopupLoading] = useState(false);

  async function handleAddMoney(e: React.FormEvent) {
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
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Top up failed.');
    } finally {
      setIsTopupLoading(false);
    }
  }

  return (
    <View
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
      flex
      align="center"
      justify="center"
      padding={16}
    >
      <Card className="fade-in" style={{ width: '100%', maxWidth: 520 }} padding={0}>
        <View style={{ padding: '20px 24px' }} flex align="center" justify="space-between">
          <View flex align="center" gap={16}>
            <View style={{ backgroundColor: '#bbd1ed', color: '#4285F4' }} padding={10} borderRadius={12}>
              <Banknote size={26} />
            </View>
            <Text variant="h3" size={20}>Add money</Text>
          </View>
          <Button variant="icon" onClick={onClose} style={{ color: '#848484' }}>
            <X size={24} />
          </Button>
        </View>

        <form onSubmit={handleAddMoney} style={{ padding: 24 }}>
          <View className="form-group" style={{ marginBottom: 20 }}>
            <Text variant="label" style={{ marginBottom: 8 }}>Amount (RON)</Text>
            <Input
              type="number"
              step="0.01"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="0.00"
              required
              style={{ fontSize: 18, padding: 12 }}
            />
          </View>
          <View className="form-group" style={{ marginBottom: 24 }}>
            <Text variant="label" style={{ marginBottom: 8 }}>Description (Optional)</Text>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Savings"
              style={{ fontSize: 18, padding: 12 }}
            />
          </View>

          <View flex gap={12} justify="flex-end">
            <Button variant="secondary" type="button" onClick={onClose} style={{ padding: '12px 24px', borderRadius: 10 }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isTopupLoading}
              style={{ padding: '12px 32px', width: 'auto' }}
            >
              {isTopupLoading ? 'Processing...' : 'Add'}
            </Button>
          </View>
        </form>
      </Card>
    </View>
  );
}