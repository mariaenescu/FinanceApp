import React, { useEffect, useRef } from 'react';
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

const WeeklySpendingChart: React.FC<WeeklySpendingChartProps> = ({
  data,
  range,
  loading,
  onPrev,
  onNext
}) => {
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

    // Create Gradient for Bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, '#38bdf8'); // light sky blue
    gradient.addColorStop(1, '#1d4ed8'); // deep royal blue

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
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
          ticks: { color: 'var(--text-secondary)', font: { weight: 600 } },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: 'var(--text-secondary)',
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
          backgroundColor: gradient,
          borderRadius: 12,
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
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      background: 'linear-gradient(165deg, #ffffff, #f1f5f9)',
      border: '1px solid var(--line)',
      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'var(--accent-primary)',
            color: 'white',
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>Weekly Spending</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Daily breakdown from your activity</p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255,255,255,0.8)',
          padding: '6px 10px',
          borderRadius: '12px',
          border: '1px solid var(--line)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          backdropFilter: 'blur(8px)'
        }}>
          <button
            onClick={onPrev}
            disabled={loading}
            style={{
              padding: '6px',
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              opacity: loading ? 0.5 : 1,
              background: '#f8fafc',
              border: '1px solid var(--line)',
              cursor: 'pointer'
            }}
            className="hover-scale"
          >
            <ChevronLeft size={16} />
          </button>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
            <Calendar size={14} className="text-accent" />
            {range}
          </div>
          <button
            onClick={onNext}
            disabled={loading}
            style={{
              padding: '6px',
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              opacity: loading ? 0.5 : 1,
              background: '#f8fafc',
              border: '1px solid var(--line)',
              cursor: 'pointer'
            }}
            className="hover-scale"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', height: '320px', width: '100%', zIndex: 1 }}>
        <canvas ref={canvasRef} />
      </div>

      <div style={{ display: 'flex', gap: '16px', zIndex: 1 }}>
        <div style={{
          flex: 1,
          background: 'white',
          border: '1px solid var(--line)',
          padding: '16px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>
          <div style={{ background: '#f0f9ff', color: '#0369a1', padding: '8px', borderRadius: '10px' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Weekly Total</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369a1' }}>{money(total)}</div>
          </div>
        </div>

        <div style={{
          flex: 1,
          background: 'white',
          border: '1px solid var(--line)',
          padding: '16px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>
          <div style={{ background: '#f5f3ff', color: '#5b21b6', padding: '8px', borderRadius: '10px' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Avg / Day</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#5b21b6' }}>{money(avg)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySpendingChart;
