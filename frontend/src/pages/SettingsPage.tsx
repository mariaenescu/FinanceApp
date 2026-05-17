import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { alertService } from '../api/services';
import type { SettingsRespDTO } from '../types';
import { Shield, Bell, Check, X } from 'lucide-react';
import { Card, View, Text, Button, Input } from '../components/ui';

export default function SettingsPage() {
  const [data, setData] = useState<SettingsRespDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editThreshold, setEditThreshold] = useState(false);
  const [newThreshold, setNewThreshold] = useState('');
  const [editPin, setEditPin] = useState(false);
  const [newPin, setNewPin] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await alertService.getSettings();
      setData(settings);
    } catch (err) {
      setErrorMsg('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const updateSettings = async (payload: any) => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const updated = await alertService.updateSettings(payload);
      setData(updated);
      showSuccess('Settings updated successfully.');
    } catch (err) {
      setErrorMsg('Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const toggleLowBalance = () => {
    if (!data || saving) return;
    updateSettings({ lowBalanceEnabled: !data.lowBalanceEnabled });
  };

  const confirmThreshold = async () => {
    const val = newThreshold.trim();
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      setErrorMsg('Invalid threshold amount.');
      return;
    }
    await updateSettings({ lowBalanceThreshold: num });
    setEditThreshold(false);
    setNewThreshold('');
  };

  const confirmPin = async () => {
    const pin = newPin.trim();
    if (!/^\d{4}$/.test(pin)) {
      setErrorMsg('PIN must be exactly 4 digits.');
      return;
    }
    await updateSettings({ newPin: pin });
    setEditPin(false);
    setNewPin('');
  };

  if (loading && !data) return <Layout><View style={{ padding: 32 }}><Text>Loading settings...</Text></View></Layout>;

  return (
    <Layout>
      <View className="fade-in" style={{ maxWidth: 800 }}>
        <header style={{ marginBottom: 32 }}>
          <Text variant="h1" style={{ fontSize: 35, marginBottom: 8 }}>Settings</Text>
          <Text color="#848484">Manage your card security and notifications</Text>
        </header>

        {errorMsg && (
          <View style={{ backgroundColor: '#fef2f2', padding: '12px 16px', borderRadius: 12, marginBottom: 20, border: '1px solid #fee2e2' }}>
            <Text color="#dc2626">{errorMsg}</Text>
          </View>
        )}
        {successMsg && (
          <View style={{ backgroundColor: '#f0fdf4', padding: '12px 16px', borderRadius: 12, marginBottom: 20, border: '1px solid #dcfce7' }}>
            <Text color="#16a34a">{successMsg}</Text>
          </View>
        )}

        <View grid gap={24}>
          <Card padding={24}>
            <View flex align="center" gap={12} style={{ marginBottom: 20 }}>
              <View style={{ background: '#bbd1ed', color: '#4285F4', padding: 10, borderRadius: 12 }}>
                <Shield size={24} />
              </View>
              <Text variant="h2" style={{ fontSize: 20 }}>Card Security</Text>
            </View>

            <View flex direction="column" gap={16}>
              <View flex align="center" justify="space-between" style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                <View>
                  <Text weight={600} style={{ marginBottom: 4 }}>Card PIN</Text>
                  <Text size={14} color="#848484">
                    {data?.hasPinSet ? 'PIN is active and required for large transfers' : 'No PIN set yet'}
                  </Text>
                </View>
                {!editPin ? (
                  <Button variant="secondary" style={{ width: 'auto' }} onClick={() => { setEditPin(true); setNewPin(''); }}>
                    {data?.hasPinSet ? 'Change PIN' : 'Set PIN'}
                  </Button>
                ) : (
                  <View flex gap={8}>
                    <Input
                      type="password"
                      maxLength={4}
                      placeholder="****"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      style={{ width: 80, padding: 8, borderRadius: 8 }}
                    />
                    <Button variant="primary" onClick={confirmPin} style={{ padding: 8, width: 'auto', margin: 0, borderRadius: 8 }}>
                      <Check size={18} />
                    </Button>
                    <Button variant="secondary" onClick={() => setEditPin(false)} style={{ padding: 8, width: 'auto', margin: 0, borderRadius: 8 }}>
                      <X size={18} />
                    </Button>
                  </View>
                )}
              </View>
            </View>
          </Card>

          <Card padding={24}>
            <View flex align="center" gap={12} style={{ marginBottom: 20 }}>
              <View style={{ background: '#ecfdf5', color: '#10b981', padding: 10, borderRadius: 12 }}>
                <Bell size={24} />
              </View>
              <Text variant="h2" style={{ fontSize: 20 }}>Notifications & Alerts</Text>
            </View>

            <View flex direction="column" gap={16}>
              <View flex align="center" justify="space-between" style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                <View>
                  <Text weight={600} style={{ marginBottom: 4 }}>Low Balance Alert</Text>
                  <Text size={14} color="#848484">Receive alerts when your balance drops below the threshold</Text>
                </View>
                <Button
                  variant="ghost"
                  onClick={toggleLowBalance}
                  style={{
                    width: 56,
                    height: 28,
                    borderRadius: 20,
                    background: data?.lowBalanceEnabled ? '#4285F4' : '#cbd5e1',
                    position: 'relative',
                    transition: '0.3s',
                    padding: 0
                  }}
                >
                  <View style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: 3,
                    left: data?.lowBalanceEnabled ? 31 : 3,
                    transition: '0.3s'
                  }} />
                </Button>
              </View>

              <View flex align="center" justify="space-between" style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                <View>
                  <Text weight={600} style={{ marginBottom: 4 }}>Alert Threshold</Text>
                  <Text size={14} color="#848484">
                    Current: <span style={{ fontWeight: 700, color: '#333333' }}>{data?.lowBalanceThreshold.toLocaleString()} RON</span>
                  </Text>
                </View>
                {!editThreshold ? (
                  <Button variant="secondary" style={{ width: 'auto' }} onClick={() => { setEditThreshold(true); setNewThreshold(String(data?.lowBalanceThreshold)); }}>
                    Change Limit
                  </Button>
                ) : (
                  <View flex gap={8}>
                    <Input type="number" placeholder="0.00" value={newThreshold} onChange={(e) => setNewThreshold(e.target.value)} style={{ width: 100, padding: 8, borderRadius: 8 }} />
                    <Button variant="primary" onClick={confirmThreshold} style={{ padding: 8, width: 'auto', margin: 0, borderRadius: 8 }}>
                      <Check size={18} />
                    </Button>
                    <Button variant="secondary" onClick={() => setEditThreshold(false)} style={{ padding: 8, width: 'auto', margin: 0, borderRadius: 8 }}>
                      <X size={18} />
                    </Button>
                  </View>
                )}
              </View>
            </View>
          </Card>
        </View>
      </View>
    </Layout>
  );
}