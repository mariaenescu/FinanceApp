import { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { friendService, financeService, alertService } from '../api/services';
import type { FriendResponseDTO } from '../types';
import FriendsQuickActions from '../components/friends/FriendsQuickActions';
import RecentFriendActivity from '../components/friends/RecentFriendActivity';
import PaginatedFriendsList from '../components/friends/PaginatedFriendsList';
import { Search, X } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';
import { View, Text, Button, Input } from '../components/ui';

type QuickState = 'idle' | 'add' | 'send';

export default function FriendsPage() {
  const [friends, setFriends] = useState<FriendResponseDTO[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickState, setQuickState] = useState<QuickState>('idle');
  const [query, setQuery] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [notice, setNotice] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showNotice(msg: string, type: 'success' | 'error' = 'success') {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 5000);
  }

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

  async function handleAddFriend(iban: string) {
    try {
      await friendService.addFriend(iban);
      showNotice('Friend added successfully!');
      loadFriends(query);
    } catch (err) {
      showNotice('Could not add friend. Check IBAN or if already added.', 'error');
    }
  }

  async function handleSendMoney(iban: string, amount: number, message?: string) {
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

      const lbData = await alertService.checkLowBalance();
      if (lbData.shouldAlert) {
        window.alert(lbData.message || 'Low balance alert!');
      }
    } catch (err: any) {
      showNotice(err.message || 'Transfer failed.', 'error');
    }
  }

  return (
    <Layout>
      <View className="fade-in" padding="8px 0">
        <View flex direction="column" gap={24} style={{ marginBottom: 32 }}>
          <View>
            <Text variant="h1" style={{ marginBottom: 6 }}>Friends & Contacts</Text>
            <Text color="#848484" size={18}>Manage your community and send money instantly</Text>
          </View>

          <View style={{ position: 'relative', maxWidth: 800, width: '100%' }}>
            <View
              className="search-grand-container"
              flex
              align="center"
              bg="white"
              borderRadius={20}
              padding={4}
              border="1px solid #e5e7eb"
              style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
            >
              <Search size={24} style={{ position: 'absolute', left: 20, color: '#4285F4', opacity: 0.7 }} />
              <Input
                type="text"
                style={{
                  padding: '16px 20px 16px 60px',
                  width: '100%',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: 19,
                  outline: 'none',
                  color: '#333333'
                }}
                placeholder="Search by name, email or IBAN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <Button variant="icon" onClick={() => setQuery('')} style={{ position: 'absolute', right: 16, color: '#848484' }}>
                  <X size={20} />
                </Button>
              )}
            </View>
          </View>
        </View>

        {notice && (
          <View
            flex
            justify="space-between"
            align="center"
            style={{
              padding: '14px 20px',
              borderRadius: 16,
              marginBottom: 28,
              backgroundColor: notice.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: notice.type === 'success' ? '#16a34a' : '#dc2626',
              border: `1px solid ${notice.type === 'success' ? '#dcfce7' : '#fee2e2'}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <Text weight={500}>{notice.msg}</Text>
            <Button variant="icon" onClick={() => setNotice(null)} style={{ opacity: 0.6 }}>
              <X size={18} />
            </Button>
          </View>
        )}

        <View grid gridCols="0.92fr 1.08fr" gap={28} style={{ alignItems: 'stretch' }}>
          <View flex direction="column" gap={24}>
            <FriendsQuickActions
              state={quickState}
              onAddMode={() => setQuickState('add')}
              onSendMode={() => setQuickState('send')}
              onBack={() => setQuickState('idle')}
              onAddFriend={(iban) => {
                handleAddFriend(iban);
                setQuickState('idle');
              }}
              onSendMoney={(iban, amt, msg) => {
                handleSendMoney(iban, amt, msg);
                setQuickState('idle');
              }}
              onValidationError={(msg) => showNotice(msg, 'error')}
            />
            <View style={{ flex: 1 }}>
              <RecentFriendActivity items={recent} />
            </View>
          </View>

          <View style={{ height: '100%' }}>
            <PaginatedFriendsList
              friends={friends}
              onSendMoney={(p) => handleSendMoney(p.iban, p.amount, p.message)}
              onValidationError={(msg) => showNotice(msg, 'error')}
            />
          </View>
        </View>

        {loading && (
          <View style={{ marginTop: 12 }}>
            <Text color="#848484" size={15}>Refreshing data...</Text>
          </View>
        )}

        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      </View>
    </Layout>
  );
}