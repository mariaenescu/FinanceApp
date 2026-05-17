import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import { CreditCard } from 'lucide-react';
import { View, Text, Button, Input } from '../components/ui';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await authService.register({ fullName, email, password });
      navigate('/login');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
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
        </View>

        <View className="auth-form-card">
          <Text variant="h4">Welcome</Text>

          <form onSubmit={handleSignUp}>
            <View className="form-group">
              <Text variant="label">Full Name</Text>
              <Input
                id="fullName"
                type="text"
                placeholder="e.g. Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </View>

            <View className="form-group">
              <Text variant="label">Email Address</Text>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
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
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </View>

            <View className="form-group">
              <Text variant="label">Confirm Password</Text>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </View>

            <Button variant="primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {errorMessage && <View className="error-message"><Text color="#b52323">{errorMessage}</Text></View>}
          </form>

          <View className="form-footer">
            <Text>
              Already have an account? <Link to="/login">Sign In</Link>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}