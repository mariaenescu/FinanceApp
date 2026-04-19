import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Layout from '../components/Layout';
import { financeService } from '../api/services';
import type { DashboardStatsDTO } from '../types';
import WeeklySpendingChart from '../components/statistics/WeeklySpendingChart';
import CategorySpendingChart from '../components/statistics/CategorySpendingChart';
import SummaryCards from '../components/SummaryCards';
import { Loader2, AlertCircle } from 'lucide-react';

type Period = 'month' | 'week';

const StatisticsPage: React.FC = () => {
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
          <Loader2 className="animate-spin" size={32} />
          <span style={{ marginLeft: '12px', fontSize: '1.2rem' }}>Analyzing your data...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fade-in">
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Analytics</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Detailed insights into your financial health</p>
          </div>

          <div style={{ display: 'flex', background: '#e5e7eb', borderRadius: '12px', padding: '4px' }}>
            <button
              onClick={() => setPeriod('week')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: period === 'week' ? 'white' : 'transparent',
                boxShadow: period === 'week' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                transition: '0.3s'
              }}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('month')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: period === 'month' ? 'white' : 'transparent',
                boxShadow: period === 'month' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                transition: '0.3s'
              }}
            >
              Monthly
            </button>
          </div>
        </header>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '16px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => fetchStats(weekOffset)} style={{ marginLeft: 'auto', fontWeight: 700, textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Top Summary Row */}
          <SummaryCards data={summaryData} period={period} />

          {/* Charts Row */}
          <div style={{ display: 'grid', gap: '32px' }}>
            <WeeklySpendingChart
              data={stats?.weeklySpending || []}
              range={weekRange}
              loading={loading}
              onPrev={handlePrevWeek}
              onNext={handleNextWeek}
            />

            <CategorySpendingChart
              rows={stats?.spendingByCategory || []}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StatisticsPage;
