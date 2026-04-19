import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

type Period = 'month' | 'week';
type Tone = 'success' | 'error' | 'info';

interface StatCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  tone: Tone;
  period: Period;
  showBadge: boolean;
  isPositive: boolean;
  emoji: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  icon,
  tone,
  period,
  showBadge,
  isPositive,
  emoji
}) => {
  const toneColor = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  }[tone];

  const formatted = new Intl.NumberFormat('ro-RO', { 
    style: 'currency', 
    currency: 'RON', 
    maximumFractionDigits: 0 
  }).format(amount);

  return (
    <div style={{
      background: `linear-gradient(160deg, color-mix(in oklab, ${toneColor} 8%, #0b1220), color-mix(in oklab, ${toneColor} 2%, #0b1220))`,
      border: '2px solid rgba(255,255,255,.06)',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.25s ease',
      cursor: 'default',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '.2px' }}>{title}</div>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '999px',
          display: 'grid',
          placeItems: 'center',
          background: `color-mix(in oklab, ${toneColor} 20%, #0b1220)`,
          color: `color-mix(in oklab, ${toneColor} 80%, #ffffff)`
        }}>
          {icon}
        </div>
      </div>

      <div style={{ fontSize: '1.6rem', fontWeight: 600, letterSpacing: '.3px', color: toneColor, margin: '2px 0 8px' }}>
        {formatted}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showBadge && (
          <span style={{
            background: isPositive ? '#4285F4' : '#ef4444',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            {isPositive ? 'Saving' : 'Overspending'}
          </span>
        )}
        <span style={{ fontSize: '.75rem', opacity: .8 }}>
          {emoji} {period === 'month' ? 'This month' : 'This week'}
        </span>
      </div>
    </div>
  );
};

const SummaryCards: React.FC<{ data: { income: number, expenses: number, net: number }, period: Period }> = ({ data, period }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <StatCard
        title="Total Income"
        amount={data.income}
        icon={<TrendingUp size={18} />}
        tone="success"
        period={period}
        showBadge={true}
        isPositive={true}
        emoji="💰"
      />
      <StatCard
        title="Total Expenses"
        amount={data.expenses}
        icon={<TrendingDown size={18} />}
        tone="error"
        period={period}
        showBadge={true}
        isPositive={false}
        emoji="💸"
      />
      <StatCard
        title="Net Savings"
        amount={data.net}
        icon={<PiggyBank size={18} />}
        tone="info"
        period={period}
        showBadge={true}
        isPositive={data.net >= 0}
        emoji="🎯"
      />
    </div>
  );
};

export default SummaryCards;
