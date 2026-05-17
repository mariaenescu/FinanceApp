import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Category } from '../../types';
import { Card, View, Text, Button, Select } from '../ui';

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

export default function UpgradeToFirm({ accountCategory, categories, onUpgraded }: UpgradeToFirmProps) {
  const [isChoosing, setIsChoosing] = useState(false);
  const [chosen, setChosen] = useState<Exclude<Category, 'USER'> | ''>('');

  const handleConfirm = () => {
    if (chosen) {
      onUpgraded(chosen as Exclude<Category, 'USER'>);
      setIsChoosing(false);
    }
  };

  return (
    <Card padding={24}>
      <Text variant="h2" size={18} style={{ marginBottom: 16 }}>Firm Status</Text>

      {!accountCategory ? (
        <Text color="#848484" weight={500}>Checking status...</Text>
      ) : accountCategory === 'USER' ? (
        !isChoosing ? (
          <UserUpgradePrompt onStart={() => setIsChoosing(true)} />
        ) : (
          <CategorySelectForm
            categories={categories}
            chosen={chosen}
            setChosen={setChosen}
            onCancel={() => setIsChoosing(false)}
            onConfirm={handleConfirm}
          />
        )
      ) : (
        <ActiveFirmStatus category={accountCategory} />
      )}
    </Card>
  );
}
function UserUpgradePrompt({ onStart }: { onStart: () => void }) {
  return (
    <View flex align="center" justify="space-between" gap={16}>
      <Text color="#848484" weight={500}>You are currently a regular user.</Text>
      <Button variant="primary" style={{ width: 'auto', padding: '10px 20px', margin: 0, borderRadius: 10 }} onClick={onStart}>Upgrade Account</Button>
    </View>
  );
}

interface CategorySelectFormProps {
  categories: Exclude<Category, 'USER'>[];
  chosen: Exclude<Category, 'USER'> | '';
  setChosen: (val: Exclude<Category, 'USER'> | '') => void;
  onCancel: () => void;
  onConfirm: () => void;
}

function CategorySelectForm({
  categories,
  chosen,
  setChosen,
  onCancel,
  onConfirm
}: CategorySelectFormProps) {
  const catOptions = categories.map(cat => ({ label: cat, value: cat }));
  return (
    <View flex align="center" gap={12}>
      <View style={{ position: 'relative', flex: 1 }}>
        <Select value={chosen} onChange={(e) => setChosen(e.target.value as any)} options={catOptions} placeholder="Select firm category" style={{ paddingRight: 36 }} />
        <ChevronDown size={18} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#848484' }} />
      </View>
      <Button variant="secondary" style={{ padding: '10px 16px', borderRadius: 10 }} onClick={onCancel}>Cancel</Button>
      <Button variant="primary" style={{ padding: '10px 20px', borderRadius: 10, width: 'auto', margin: 0 }} disabled={!chosen} onClick={onConfirm}>Confirm</Button>
    </View>
  );
}

function ActiveFirmStatus({ category }: { category: string }) {
  return (
    <View flex align="center" gap={10}>
      <Text color="#848484" weight={500}>Your Firm category is:</Text>
      <Text variant="caption" style={{ color: colorByCategory[category], borderColor: colorByCategory[category], border: '1px solid', padding: '4px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>{category}</Text>
    </View>
  );
}