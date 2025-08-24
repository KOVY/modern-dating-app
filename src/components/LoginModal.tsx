import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  isDarkMode: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onSwitchToRegister, 
  isDarkMode 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
      // Reset form
      setEmail('');
      setPassword('');
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleDemoLogin = async () => {
    try {
      await login('anna@example.com', 'password123');
      onClose();
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDarkMode ? '#2d3748' : 'white',
          borderRadius: '20px',
          padding: '30px',
          width: '90%',
          maxWidth: '400px',
          color: isDarkMode ? 'white' : '#333',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: isDarkMode ? 'white' : '#333'
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            🔐 Přihlášení
          </h2>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
            Vítejte zpět v LoveConnect!
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: '#fee',
            color: '#c53030',
            padding: '10px 15px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Demo login */}
        <div style={{
          background: isDarkMode ? '#4a5568' : '#f7fafc',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.8 }}>
            Demo účet pro testování:
          </p>
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Přihlašuji...' : 'Demo přihlášení (Anna)'}
          </button>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vas-email@example.com"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                borderRadius: '10px',
                background: isDarkMode ? '#1a202c' : 'white',
                color: isDarkMode ? 'white' : '#333',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              🔒 Heslo
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Vaše heslo"
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 15px',
                  border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  background: isDarkMode ? '#1a202c' : 'white',
                  color: isDarkMode ? 'white' : '#333',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              marginBottom: '20px'
            }}
          >
            {isLoading ? 'Přihlašuji...' : '🚀 Přihlásit se'}
          </button>
        </form>

        {/* Switch to register */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.7 }}>
            Nemáte účet?
          </p>
          <button
            onClick={onSwitchToRegister}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#667eea',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Zaregistrujte se zde
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
