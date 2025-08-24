import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  isDarkMode: boolean;
  countries: any;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  onSwitchToLogin, 
  isDarkMode,
  countries 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    country: 'cz',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert('Hesla se neshodují');
      return;
    }

    if (formData.password.length < 6) {
      alert('Heslo musí mít alespoň 6 znaků');
      return;
    }

    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
      alert('Věk musí být mezi 18 a 100 lety');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        country: formData.country,
        bio: formData.bio
      });
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        country: 'cz',
        bio: ''
      });
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
          maxWidth: '450px',
          maxHeight: '90vh',
          overflowY: 'auto',
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
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            📝 Registrace
          </h2>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
            Připojte se k LoveConnect!
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

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              👤 Jméno
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Vaše jméno"
              style={{
                width: '100%',
                padding: '10px 15px',
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

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              📧 Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="vas-email@example.com"
              style={{
                width: '100%',
                padding: '10px 15px',
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

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                🎂 Věk
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="100"
                placeholder="25"
                style={{
                  width: '100%',
                  padding: '10px 15px',
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

            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                🌍 Země
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  background: isDarkMode ? '#1a202c' : 'white',
                  color: isDarkMode ? 'white' : '#333',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                {Object.entries(countries).map(([code, data]: [string, any]) => (
                  <option key={code} value={code}>
                    {data.flag} {data.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              🔒 Heslo
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Alespoň 6 znaků"
                style={{
                  width: '100%',
                  padding: '10px 45px 10px 15px',
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

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              🔒 Potvrdit heslo
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Zopakujte heslo"
              style={{
                width: '100%',
                padding: '10px 15px',
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              📝 O mně (volitelné)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Napište něco o sobě..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 15px',
                border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                borderRadius: '10px',
                background: isDarkMode ? '#1a202c' : 'white',
                color: isDarkMode ? 'white' : '#333',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
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
            {isLoading ? 'Registruji...' : '🎉 Zaregistrovat se'}
          </button>
        </form>

        {/* Switch to login */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.7 }}>
            Už máte účet?
          </p>
          <button
            onClick={onSwitchToLogin}
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
            Přihlaste se zde
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
