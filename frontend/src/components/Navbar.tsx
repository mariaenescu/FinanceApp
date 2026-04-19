import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  History, 
  Users, 
  Building2, 
  PieChart, 
  Settings, 
  LogOut,
  CreditCard
} from 'lucide-react';
import SidebarAccountCard from './SidebarAccountCard';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/main' },
    { icon: <History size={20} />, label: 'Transaction History', path: '/transaction-history' },
    { icon: <Users size={20} />, label: 'Friends', path: '/friends' },
    { icon: <Building2 size={20} />, label: 'Firms', path: '/firms' },
    { icon: <PieChart size={20} />, label: 'Statistics', path: '/statistics' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '30px 20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #7352c3 0%, #1d2ba5 100%)', 
          borderRadius: '16px', 
          width: '44px', 
          height: '44px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#bbd1ed'
        }}>
          <CreditCard size={24} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.8px' }}>FinanceApp</div>
          <div style={{ fontSize: '0.85rem', color: '#9aa3b2', letterSpacing: '0.6px' }}>Financial Management</div>
        </div>
      </div>

      <div style={{ padding: '0 1rem' }}>
        <SidebarAccountCard />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '1rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? 'var(--accent-primary)' : '#474646',
              background: isActive ? '#f0f4ff' : 'transparent',
              fontWeight: 500,
              fontSize: '1rem',
              transition: 'all 0.2s'
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <NavLink 
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive ? 'var(--accent-primary)' : '#474646',
            background: isActive ? '#f0f4ff' : 'transparent',
            fontWeight: 500,
            fontSize: '1rem',
            transition: 'all 0.2s'
          })}
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            gap: '12px', 
            padding: '12px 16px', 
            color: '#ac3c39',
            fontSize: '1rem',
            marginTop: '8px'
          }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
