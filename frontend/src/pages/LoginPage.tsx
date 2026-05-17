import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import { CreditCard } from 'lucide-react';
import { View, Text, Button, Input } from '../components/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('authToken', response.token);
      navigate('/main');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="signup-container">
      <View className="signup-card">
        <View className="header" style={{ textAlign: 'center' }}>
          <View className="finance-icon-box">
            <CreditCard size={40} />
          </View>
          <Text variant="h1">FinanceApp</Text>
          <Text className="subtitle">Take control of your finances</Text>
        </View>

        <View className="auth-form-card">
          <form onSubmit={handleLogin}>
            <View className="form-group">
              <Text variant="label">Email Address</Text>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </View>

            <View className="form-group">
              <Text variant="label">Password</Text>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </View>

            <Button variant="primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {errorMessage && <View className="error-message"><Text color="#b52323">{errorMessage}</Text></View>}
          </form>

          <View className="form-footer">
            <Text>
              Don't have an account? <Link to="/sign-up">Create one</Link>
            </Text>
          </View>

        </View>
      </View>
    </View>
  );
}