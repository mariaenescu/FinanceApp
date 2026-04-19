import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import { Shield, Zap, BarChart3, CreditCard } from 'lucide-react';

const LoginPage: React.FC = () => {
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
    <div className="signup-container">
      <div className="signup-card">
        <div className="header" style={{ textAlign: 'center' }}>
          <div className="finance-icon-box">
            <CreditCard size={40} />
          </div>
          <h1>FinanceApp</h1>
          <p className="subtitle">Take control of your finances</p>
        </div>

        <div className="auth-form-card">
          <h4>Welcome</h4>
          <h5 className="form-subtitle">Sign in to your account or create a new one</h5>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </form>

          <div className="form-footer">
            <p>
              Don't have an account? <Link to="/sign-up">Create one</Link>
            </p>
          </div>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <div className="icon-wrapper">
              <Shield size={20} />
            </div>
            <div className="feature-text">
              <h5>Bank-level Security</h5>
              <h6>Your data is protected with 256-bit encryption</h6>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="icon-wrapper">
              <Zap size={20} />
            </div>
            <div className="feature-text">
              <h5>Instant Transfers</h5>
              <h6>Send and receive money in real-time</h6>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <BarChart3 size={20} />
            </div>
            <div className="feature-text">
              <h5>Smart Analytics</h5>
              <h6>Track your spending with detailed insights</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
