import React, { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';

interface AccountBalanceCardProps {
  balance: number;
  owner: string;
  cardNumberMasked?: string;
  cardNumber?: string;
  expirationDate?: {
    year: number;
    month: string;
    monthValue: number;
  };
  cvvNumber?: string | number;
}

const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  balance,
  owner,
  cardNumberMasked = '**** **** **** ****',
  cardNumber = '',
  expirationDate,
  cvvNumber = ''
}) => {
  const [isHidden, setIsHidden] = useState(true);

  const toggle = () => setIsHidden(!isHidden);

  const currency = (n: number) =>
    new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const fullCardNumber = cardNumber.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();

  const getExpiry = () => {
    if (!expirationDate) return '**/0*';

    let month = '';
    let year = '';

    if (typeof expirationDate === 'string') {
      const parts = (expirationDate as string).split('-');
      if (parts.length >= 2) {
        year = parts[0].slice(-2);
        month = parts[1];
      }
    } else if (expirationDate && typeof expirationDate === 'object') {
      month = String(expirationDate.monthValue || '').padStart(2, '0');
      year = String(expirationDate.year || '').slice(-2);
    }

    if (!month || !year) return '**/0*';
    return `${month}/${year}`;
  };

  const cardStyle: React.CSSProperties = {
    padding: '22px',
    background: 'linear-gradient(135deg, #7499da 0%, #2b3edc 25%, #461997 45%, #5c263a 85%, #f5576c 160%)',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.14), 0 20px 40px rgba(94, 109, 214, 0.11), 0 8px 16px rgba(0,0,0,.20)',
    borderRadius: '24px',
    color: 'white',
    height: '100%',
    width: '100%',
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  return (
    <div style={{ perspective: '1200px', width: '100%', height: '220px' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.2, 0.65, 0.25, 1)',
          transform: isHidden ? 'rotateY(0deg)' : 'rotateY(180deg)'
        }}
      >
        {/* Front Face */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '50%', padding: '6px' }}>
                <User size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{owner}</div>
            </div>
            <button onClick={toggle} style={{ color: 'rgba(255,255,255,0.9)' }}>
              {isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>Total Balance</div>
            <div style={{ fontSize: '38px', fontWeight: 800, margin: '6px 0 10px', textShadow: '0 2px 0 rgba(0,0,0,.25)' }}>
              {currency(balance)}
            </div>
            <div style={{ fontSize: '14px', letterSpacing: '2px', color: 'rgba(255,255,255,0.88)', fontFamily: 'monospace' }}>
              {cardNumberMasked}
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div style={{ ...cardStyle, transform: 'rotateY(180deg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.14)', borderRadius: '9999px', padding: '4px 12px', fontSize: '12px', fontFamily: 'monospace' }}>
              Virtual
            </div>
            <button onClick={toggle} style={{ color: 'rgba(255,255,255,0.9)', marginLeft: '12px' }}>
              {!isHidden ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Card number</div>
              <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '14px' }}>{fullCardNumber}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.85 }}>Expiry date</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>{getExpiry()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.85 }}>CVV</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>{cvvNumber}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceCard;
