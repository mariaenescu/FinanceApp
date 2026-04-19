import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { friendService, financeService, alertService } from '../api/services';
import type { FriendResponseDTO } from '../types';
import FriendsQuickActions from '../components/friends/FriendsQuickActions';
import RecentFriendActivity from '../components/friends/RecentFriendActivity';
import PaginatedFriendsList from '../components/friends/PaginatedFriendsList';
import { Search, X } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

type QuickState = 'idle' | 'add' | 'send';

const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<FriendResponseDTO[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickState, setQuickState] = useState<QuickState>('idle');
  const [query, setQuery] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const [notice, setNotice] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showNotice = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 5000);
  };

  const loadFriends = useCallback(async (searchText?: string) => {
    try {
      const q = searchText?.trim() || '';
      const data = q
        ? await friendService.searchFriends(q)
        : await friendService.getFriends();
      setFriends(data);
    } catch (err) {
      console.error('Failed to load friends', err);
    }
  }, []);

  const loadRecent = useCallback(async () => {
    try {
      const txs = await financeService.getRecentUserTransactions();
      const mapped = txs.map((t, idx) => ({
        id: `${t.type}-${idx}`,
        title: (t.type === 'INCOME' ? 'From ' : 'To ') + (t.fromOrTo || '—'),
        subtitle: t.description || '',
        amount: t.amount,
        type: t.type,
        iban: t.type === 'INCOME' ? t.ibanSender : t.ibanReceiver
      }));
      setRecent(mapped);
    } catch (err) {
      console.error('Failed to load recent activity', err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadFriends(query), loadRecent()]);
    setLoading(false);
  }, [loadFriends, loadRecent, query]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      loadFriends(query);
      loadRecent();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchData, query, loadFriends, loadRecent]);

  const handleAddFriend = async (iban: string) => {
    try {
      await friendService.addFriend(iban);
      showNotice('Friend added successfully!');
      loadFriends(query);
    } catch (err) {
      showNotice('Could not add friend. Check IBAN or if already added.', 'error');
    }
  };

  const handleSendMoney = async (iban: string, amount: number, message?: string) => {
    try {
      await financeService.createExpense({
        ibanReceiver: iban,
        amount,
        description: message || 'Transfer to friend'
      });
      showNotice('Transfer sent successfully!');
      loadRecent();
      loadFriends(query);
      setShowFeedback(true);

      // Check for low balance alert
      const lbData = await alertService.checkLowBalance();
      if (lbData.shouldAlert) {
        window.alert(lbData.message || 'Low balance alert!');
      }
    } catch (err: any) {
      showNotice(err.message || 'Transfer failed.', 'error');
    }
  };

  return (
    <Layout>
      <div className="fade-in" style={{ padding: '8px 0' }}>
        <header style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em' }}>Friends & Contacts</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage your community and send money instantly</p>
          </div>

          {/* Grand Search Bar */}
          <div style={{ position: 'relative', maxWidth: '800px', width: '100%' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              borderRadius: '20px',
              padding: '4px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              border: '1px solid var(--line)',
              transition: 'all 0.3s ease'
            }} className="search-grand-container">
              <Search size={24} style={{ position: 'absolute', left: '20px', color: 'var(--accent-primary)', opacity: 0.7 }} />
              <input
                type="text"
                style={{
                  padding: '16px 20px 16px 60px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1.2rem',
                  outline: 'none',
                  color: 'var(--text-primary)'
                }}
                placeholder="Search by name, email or IBAN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{ position: 'absolute', right: '16px', color: 'var(--text-secondary)', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </header>

        {notice && (
          <div style={{
            padding: '14px 20px',
            borderRadius: '16px',
            marginBottom: '28px',
            backgroundColor: notice.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: notice.type === 'success' ? '#16a34a' : '#dc2626',
            border: `1px solid ${notice.type === 'success' ? '#dcfce7' : '#fee2e2'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <span style={{ fontWeight: 500 }}>{notice.msg}</span>
            <button onClick={() => setNotice(null)} style={{ opacity: 0.6 }}><X size={18} /></button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: '28px', alignItems: 'stretch' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <FriendsQuickActions
              state={quickState}
              onAddMode={() => setQuickState('add')}
              onSendMode={() => setQuickState('send')}
              onBack={() => setQuickState('idle')}
              onAddFriend={(iban) => { handleAddFriend(iban); setQuickState('idle'); }}
              onSendMoney={(iban, amt, msg) => { handleSendMoney(iban, amt, msg); setQuickState('idle'); }}
              onValidationError={(msg) => showNotice(msg, 'error')}
            />

            <div style={{ flex: 1 }}>
              <RecentFriendActivity items={recent} />
            </div>
          </div>

          <div style={{ height: '100%' }}>
            <PaginatedFriendsList
              friends={friends}
              onSendMoney={(p) => handleSendMoney(p.iban, p.amount, p.message)}
              onValidationError={(msg) => showNotice(msg, 'error')}
            />
          </div>
        </div>

        {loading && <div style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Refreshing data...</div>}

        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      </div>
    </Layout>
  );
};

export default FriendsPage;
