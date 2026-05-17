import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Calendar, ChevronLeft, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';
import { Card, View, Text, Button } from '../ui';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);

interface WeeklyBarDTO {
  day: string;
  total: number;
}

interface WeeklySpendingChartProps {
  data: WeeklyBarDTO[];
  range: string;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function WeeklySpendingChart({ data, range, loading, onPrev, onNext }: WeeklySpendingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const order = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const labels = order.map(d => d.slice(0, 3));
  const values = order.map(d => {
    const item = data.find(i => i.day.toUpperCase() === d);
    return item ? item.total : 0;
  });

  const total = data.reduce((sum, d) => sum + d.total, 0);
  const avg = total / 7;

  const money = (v: number) =>
    new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 0 }).format(v);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 14 },
          cornerRadius: 12,
          callbacks: {
            label: (c) => ` ${money(Number(c.parsed.y))}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#848484', font: { weight: 600 } },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#848484',
            callback: (v) => money(Number(v)),
            font: { size: 10 }
          },
          grid: { color: 'rgba(0,0,0,0.03)' }
        }
      }
    };

    chartRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: '#38bdf8',
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: '#0ea5e9'
        }]
      },
      options
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return (
    <Card flex direction="column" gap={24} padding={24} bg="#ffffff">
      <View flex align="center" justify="space-between">
        <View flex align="center" gap={14}>
          <View style={{ background: '#bbd1ed', color: '#4285F4', width: 42, height: 42 }} borderRadius={12} flex align="center" justify="center">
            <BarChart3 size={22} />
          </View>
          <View>
            <Text variant="h2" size={19}>Weekly Spending</Text>
            <Text size={14} color="#848484" style={{ marginTop: 2 }}>Daily breakdown from your activity</Text>
          </View>
        </View>

        <View flex align="center" gap={12} style={{ background: '#e3eaf6', padding: '6px 12px', border: '1px solid #e5e7eb' }} borderRadius={10}>
          <Button variant="icon" onClick={onPrev} disabled={loading} style={{ padding: 6, borderRadius: 8, background: '#ffffff', border: '1px solid #e5e7eb' }}>
            <ChevronLeft size={16} />
          </Button>
          <Text size={14} weight={600} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} style={{ color: '#4285F4' }} />
            {range}
          </Text>
          <Button variant="icon" onClick={onNext} disabled={loading} style={{ padding: 6, borderRadius: 8, background: '#ffffff', border: '1px solid #e5e7eb' }}>
            <ChevronRight size={16} />
          </Button>
        </View>
      </View>

      <View style={{ position: 'relative', height: 320, width: '100%' }}>
        <canvas ref={canvasRef} />
      </View>

      <View flex gap={16}>
        <View style={{ flex: 1 }} bg="#ffffff" border="1px solid #e5e7eb" padding={16} borderRadius={12} flex align="center" gap={14}>
          <View style={{ background: 'rgba(3, 105, 161, 0.1)', color: '#0369a1' }} padding={10} borderRadius={10}>
            <Calendar size={22} />
          </View>
          <View>
            <Text size={13} color="#848484" weight={600}>Weekly Total</Text>
            <Text size={21} weight={700} style={{ color: '#0369a1', marginTop: 2 }}>{money(total)}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} bg="#ffffff" border="1px solid #e5e7eb" padding={16} borderRadius={12} flex align="center" gap={14}>
          <View style={{ background: 'rgba(91, 33, 182, 0.1)', color: '#5b21b6' }} padding={10} borderRadius={10}>
            <TrendingUp size={22} />
          </View>
          <View>
            <Text size={13} color="#848484" weight={600}>Avg / Day</Text>
            <Text size={21} weight={700} style={{ color: '#5b21b6', marginTop: 2 }}>{money(avg)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}