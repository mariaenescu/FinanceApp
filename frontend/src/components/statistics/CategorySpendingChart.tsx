import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { PieChart } from 'lucide-react';
import { Card, View, Text, List, ListItem } from '../ui';

ChartJS.register(ArcElement, Tooltip, Legend, PieController);

interface CategoryRow {
  category: string;
  total: number;
}

interface CategorySpendingChartProps {
  rows: CategoryRow[];
}

export default function CategorySpendingChart({ rows }: CategorySpendingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  const filtered = rows.filter(r => r.category !== 'USER');
  const palette = ['#a855f7', '#22c55e', '#f97316', '#0ea5e9', '#ef4444', '#8b5cf6'];
  const total = filtered.reduce((sum, r) => sum + r.total, 0);

  const money = (v: number) =>
    new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 0 }).format(v);

  const formatPercent = (amount: number) => {
    if (total === 0) return '0%';
    return ((amount / total) * 100).toFixed(1) + '%';
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const options: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (c) => {
              const amount = c.parsed as number;
              const percent = total === 0 ? 0 : (amount / total) * 100;
              return ` ${money(amount)} (${percent.toFixed(1)}%)`;
            }
          }
        }
      }
    };

    chartRef.current = new ChartJS(ctx, {
      type: 'pie',
      data: {
        labels: filtered.map(r => r.category),
        datasets: [{
          data: filtered.map(r => r.total),
          backgroundColor: palette,
          borderWidth: 0,
          hoverOffset: 12
        }]
      },
      options
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [rows, total]);

  return (
    <Card padding={24}>
      <View flex align="center" gap={12} style={{ marginBottom: 24 }}>
        <View style={{ background: '#bbd1ed', color: '#4285F4' }} padding={10} borderRadius={12}>
          <PieChart size={22} />
        </View>
        <Text variant="h2" size={19}>Spending by Category</Text>
      </View>

      <View grid gridCols="minmax(0, 1.2fr) minmax(0, 0.8fr)" gap={32} align="center">
        <View style={{ position: 'relative', height: 300 }}>
          <canvas ref={canvasRef} />
        </View>

        <List gap={12}>
          {filtered.map((r, i) => (
            <ListItem key={r.category} flex align="center" gap={12} padding="12px 16px" borderRadius={12} bg="#ffffff" border="1px solid #e5e7eb">
              <View style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: palette[i % palette.length] }} />
              <Text weight={600} size={15} style={{ flex: 1 }}>{r.category}</Text>
              <Text weight={700} color="#4285F4" size={15}>{formatPercent(r.total)}</Text>
            </ListItem>
          ))}
          {filtered.length === 0 && (
            <ListItem style={{ textAlign: 'center', padding: '20px 0' }}>
              <Text color="#848484" size={15}>No category data</Text>
            </ListItem>
          )}
        </List>
      </View>
    </Card>
  );
}