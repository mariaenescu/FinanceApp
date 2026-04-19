import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { alertService } from '../api/services';
import type { SettingsRespDTO } from '../types';
import { Shield, Bell, Check, X } from 'lucide-react';

const SettingsPage: React.FC = () => {
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

  if (loading && !data) return <Layout><div style={{ padding: '2rem' }}>Loading settings...</div></Layout>;

  return (
    <Layout>
      <div className="fade-in" style={{ maxWidth: '800px' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>Settings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your card security and notifications</p>
        </header>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #fee2e2' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #dcfce7' }}>
            {successMsg}
          </div>
        )}

        <div style={{ display: 'grid', gap: '24px' }}>
          <section className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '10px', borderRadius: '12px' }}>
                <Shield size={24} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Card Security</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Card PIN</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {data?.hasPinSet ? 'PIN is active and required for large transfers' : 'No PIN set yet'}
                  </div>
                </div>
                {!editPin ? (
                  <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => { setEditPin(true); setNewPin(''); }}>
                    {data?.hasPinSet ? 'Change PIN' : 'Set PIN'}
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="****"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      style={{ width: '80px', padding: '8px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                    <button onClick={confirmPin} style={{ padding: '8px', background: 'var(--accent-primary)', color: 'white', borderRadius: '8px' }}>
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditPin(false)} style={{ padding: '8px', background: '#e5e7eb', borderRadius: '8px' }}>
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#ecfdf5', color: '#10b981', padding: '10px', borderRadius: '12px' }}>
                <Bell size={24} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Notifications & Alerts</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Low Balance Alert</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive alerts when your balance drops below the threshold</div>
                </div>
                <button
                  onClick={toggleLowBalance}
                  style={{
                    width: '56px',
                    height: '28px',
                    borderRadius: '20px',
                    background: data?.lowBalanceEnabled ? 'var(--accent-primary)' : '#cbd5e1',
                    position: 'relative',
                    transition: '0.3s'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: data?.lowBalanceEnabled ? '31px' : '3px',
                    transition: '0.3s'
                  }} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Alert Threshold</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Current: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data?.lowBalanceThreshold.toLocaleString()} RON</span>
                  </div>
                </div>
                {!editThreshold ? (
                  <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => { setEditThreshold(true); setNewThreshold(String(data?.lowBalanceThreshold)); }}>
                    Change Limit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(e.target.value)}
                      style={{ width: '100px', padding: '8px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                    <button onClick={confirmThreshold} style={{ padding: '8px', background: 'var(--accent-primary)', color: 'white', borderRadius: '8px' }}>
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditThreshold(false)} style={{ padding: '8px', background: '#e5e7eb', borderRadius: '8px' }}>
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
