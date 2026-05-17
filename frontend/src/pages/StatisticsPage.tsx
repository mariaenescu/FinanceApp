import { useEffect, useState, useCallback, useMemo } from 'react';
import Layout from '../components/Layout';
import { financeService } from '../api/services';
import type { DashboardStatsDTO } from '../types';
import WeeklySpendingChart from '../components/statistics/WeeklySpendingChart';
import CategorySpendingChart from '../components/statistics/CategorySpendingChart';
import SummaryCards from '../components/SummaryCards';
import { Loader2, AlertCircle } from 'lucide-react';
import { View, Text, Button } from '../components/ui';

type Period = 'month' | 'week';

export default function StatisticsPage() {
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('month');
  const [weekOffset, setWeekOffset] = useState(0);

  const fetchStats = useCallback(async (offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getStats(offset);
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(weekOffset);
  }, [fetchStats, weekOffset]);

  const summaryData = useMemo(() => {
    const s = period === 'month' ? stats?.monthSummary : stats?.weekSummary;
    return {
      income: s?.incomes || 0,
      expenses: s?.expense || 0,
      net: s?.netSavings || 0
    };
  }, [stats, period]);

  const weekRange = useMemo(() => {
    const startOfWeekMonday = (date: Date) => {
      const day = date.getDay() === 0 ? 7 : date.getDay();
      const monday = new Date(date);
      monday.setDate(date.getDate() - (day - 1));
      monday.setHours(0, 0, 0, 0);
      return monday;
    };

    const today = new Date();
    const start = startOfWeekMonday(new Date(today.getFullYear(), today.getMonth(), today.getDate() + weekOffset * 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    return `${fmt(start)} - ${fmt(end)}`;
  }, [weekOffset]);

  const handlePrevWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    if (weekOffset < 0) {
      setWeekOffset(prev => prev + 1);
    }
  };

  if (loading && !stats) {
    return (
      <Layout>
        <View flex align="center" justify="center" style={{ height: '60vh' }}>
          <Loader2 className="animate-spin" size={32} />
          <Text size={19} style={{ marginLeft: 12 }}>Analyzing your data...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View className="fade-in">
        <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text variant="h1" style={{ fontSize: 40, marginBottom: 8 }}>Analytics</Text>
            <Text color="#848484">Detailed insights into your financial health</Text>
          </View>

          <View flex style={{ background: '#e5e7eb', borderRadius: 12, padding: 4 }}>
            <Button
              variant="ghost"
              onClick={() => setPeriod('week')}
              style={{
                background: period === 'week' ? 'white' : 'transparent',
                boxShadow: period === 'week' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                color: period === 'week' ? '#333333' : '#848484'
              }}
            >
              Weekly
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPeriod('month')}
              style={{
                background: period === 'month' ? 'white' : 'transparent',
                boxShadow: period === 'month' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                color: period === 'month' ? '#333333' : '#848484'
              }}
            >
              Monthly
            </Button>
          </View>
        </header>

        {error && (
          <View flex align="center" gap={12} style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#dc2626',
            padding: 16,
            borderRadius: 16,
            marginBottom: 32
          }}>
            <AlertCircle size={20} />
            <Text color="#dc2626">{error}</Text>
            <Button variant="ghost" onClick={() => fetchStats(weekOffset)} style={{ marginLeft: 'auto', color: '#dc2626', textDecoration: 'underline' }}>Retry</Button>
          </View>
        )}

        <View grid gap={32}>
          <SummaryCards data={summaryData} period={period} />

          <View grid gap={32}>
            <WeeklySpendingChart
              data={stats?.weeklySpending || []}
              range={weekRange}
              loading={loading}
              onPrev={handlePrevWeek}
              onNext={handleNextWeek}
            />

            <CategorySpendingChart rows={stats?.spendingByCategory || []} />
          </View>
        </View>
      </View>
    </Layout>
  );
}