import React, { useEffect, useState } from 'react';
import { userService } from '../api/services';
import type { UserResponseDTO } from '../types';
import { User } from 'lucide-react';

const SidebarAccountCard: React.FC = () => {
  const [userData, setUserData] = useState<UserResponseDTO | null>(null);

  const loadData = async () => {
    try {
      const data = await userService.getMyUserAccount();
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    loadData();
    const poll = setInterval(loadData, 5000);
    return () => clearInterval(poll);
  }, []);

  const money = (v: number) =>
    new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(v);

  const owner = userData?.fullName || '-';
  const balance = userData?.account?.balance || 0;
  const cardNumberMasked = userData?.account?.card?.cardNumberMasked || '**** **** **** ****';

  return (
    <div style={{
      background: 'linear-gradient(140deg, #2b3edc 0%, #461997 45%, #5c263a 100%)',
      borderRadius: '16px',
      padding: '14px',
      color: '#eef4ff',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.14), 0 10px 20px rgba(0,0,0,.30)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{
          background: 'rgba(255,255,255,.22)',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <User size={18} />
        </div>
        <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {owner}
        </div>
      </div>

      <div style={{ fontSize: '11px', letterSpacing: '.6px', opacity: 0.9 }}>Total Balance</div>
      <div style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0 6px', letterSpacing: '.2px' }}>
        {money(balance)}
      </div>

      <div style={{ fontSize: '12px', letterSpacing: '2px', opacity: 0.95, fontFamily: 'monospace' }}>
        {cardNumberMasked}
      </div>
    </div>
  );
};

export default SidebarAccountCard;
