import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, PieController);

interface CategoryRow {
  category: string;
  total: number;
}

interface CategorySpendingChartProps {
  rows: CategoryRow[];
}

const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({ rows }) => {
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
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '8px', borderRadius: '100%' }}>
          <PieChart size={20} />
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Spending by Category</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '32px', alignItems: 'center' }}>
        <div style={{ position: 'relative', height: '300px' }}>
          <canvas ref={canvasRef} />
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
          {filtered.map((r, i) => (
            <li key={r.category} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '10px 14px', 
              borderRadius: '12px', 
              background: '#f8fafc',
              border: '1px solid var(--line)'
            }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: palette[i % palette.length] 
              }} />
              <div style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>{r.category}</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                {formatPercent(r.total)}
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
              No category data
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CategorySpendingChart;
