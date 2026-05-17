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
import { View, Text, Button } from './ui';

export default function Navbar() {
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
    <View className="sidebar" flex direction="column" style={{ height: '100vh' }}>
      <View flex align="center" gap={12} padding="24px 16px">
        <View style={{ width: 40, height: 40, backgroundColor: '#bbd1ed', color: '#4285F4' }} borderRadius={12} flex align="center" justify="center">
          <CreditCard size={22} />
        </View>
        <View>
          <Text weight={700} size={21}>FinanceApp</Text>
        </View>
      </View>

      <View flex direction="column" gap={6} padding={16}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 10,
              textDecoration: 'none',
              color: isActive ? '#4285F4' : '#333333',
              background: isActive ? '#e3eaf6' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              fontSize: 15,
              transition: 'all 0.2s'
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </View>

      <View style={{ marginTop: 'auto', borderTop: '1px solid #e5e7eb' }} padding={16}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 10,
            textDecoration: 'none',
            color: isActive ? '#4285F4' : '#333333',
            background: isActive ? '#e3eaf6' : 'transparent',
            fontWeight: isActive ? 600 : 500,
            fontSize: 15,
            transition: 'all 0.2s'
          })}
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        <Button
          variant="ghost"
          onClick={handleLogout}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            color: '#b52323',
            marginTop: 4,
            padding: '12px 16px',
            fontSize: 15,
            fontWeight: 500
          }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </Button>
      </View>
    </View>
  );
}