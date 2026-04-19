import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import type { Category } from '../../types';

interface UpgradeToFirmProps {
  accountCategory: Category | '';
  categories: Exclude<Category, 'USER'>[];
  onUpgraded: (cat: Exclude<Category, 'USER'>) => void;
}

const colorByCategory: Record<string, string> = {
  BILLS: '#a855f7',
  ENTERTAINMENT: '#22c55e',
  FOOD: '#f97316',
  SHOPPING: '#0ea5e9',
  TRANSPORTATION: '#efde44',
  USER: '#a9b0bb',
};

const UpgradeToFirm: React.FC<UpgradeToFirmProps> = ({ accountCategory, categories, onUpgraded }) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [chosen, setChosen] = useState<Exclude<Category, 'USER'> | ''>('');

  const handleConfirm = () => {
    if (chosen) {
      onUpgraded(chosen as Exclude<Category, 'USER'>);
      setIsChoosing(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px' }}>Firm Status</h2>

      {!accountCategory ? (
        <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Checking...</div>
      ) : accountCategory === 'USER' ? (
        !isChoosing ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>You are not a Firm</div>
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => setIsChoosing(true)}
            >
              Upgrade Account
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <select
                value={chosen}
                onChange={(e) => setChosen(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--line)',
                  appearance: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '10px 16px', borderRadius: '10px' }}
              onClick={() => setIsChoosing(false)}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              style={{ padding: '10px 16px', borderRadius: '10px', width: 'auto' }}
              disabled={!chosen}
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        )
      ) : (
        <div style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          Your Firm category is:
          <span style={{
            color: colorByCategory[accountCategory],
            borderColor: colorByCategory[accountCategory],
            border: '1px solid',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            {accountCategory}
          </span>
        </div>
      )}
    </div>
  );
};

export default UpgradeToFirm;
