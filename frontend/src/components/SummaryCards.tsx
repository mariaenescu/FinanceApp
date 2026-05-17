import React from 'react';
import { ArrowUpRight, ArrowDownLeft, PiggyBank } from 'lucide-react';
import { Card, View, Text } from './ui';

interface SummaryCardsProps {
  data: { income: number; expenses: number; net: number; };
  period?: 'week' | 'month';
}

interface StatCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function SummaryCards({ data, period = 'month' }: SummaryCardsProps) {
  const lbl = period === 'month' ? 'Monthly' : 'Weekly';

  return (
    <View grid gridCols="repeat(3, 1fr)" gap={20}>
      <StatCard
        title={`${lbl} Income`}
        amount={data.income}
        icon={<ArrowDownLeft size={24} />}
        iconBg="rgba(16, 185, 129, 0.1)"
        iconColor="#10b981"
      />
      <StatCard
        title={`${lbl} Expenses`}
        amount={data.expenses}
        icon={<ArrowUpRight size={24} />}
        iconBg="rgba(181, 35, 35, 0.1)"
        iconColor="#b52323"
      />
      <StatCard
        title={`${lbl} Net Savings`}
        amount={data.net}
        icon={<PiggyBank size={24} />}
        iconBg="rgba(99, 102, 241, 0.1)"
        iconColor="#4285F4"
      />
    </View>
  );
}

function StatCard({ title, amount, icon, iconBg, iconColor }: StatCardProps) {
  const currency = (n: number) =>
    new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <Card padding={20} flex align="center" gap={16}>
      <View style={{ width: 48, height: 48, backgroundColor: iconBg, color: iconColor }} borderRadius={14} flex align="center" justify="center">
        {icon}
      </View>
      <View>
        <Text size={14} color="#848484">{title}</Text>
        <Text size={22} weight={700} style={{ marginTop: 2 }}>{currency(amount)}</Text>
      </View>
    </Card>
  );
}