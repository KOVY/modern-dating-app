import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode: boolean;
  amount: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isDarkMode,
  amount,
  currency,
  items
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'fake'>('fake');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '4242424242424242',
    expiry: '12/25',
    cvc: '123',
    name: ''
  });
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      alert('Musíte být přihlášeni');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'fake') {
        // Simulace platby
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulace úspěšné platby
        if (Math.random() > 0.1) { // 90% úspěšnost
          alert(`🎉 Platba úspěšná!\nČástka: ${amount} ${currency}\nMetoda: Testovací platba`);
          onSuccess();
        } else {
          throw new Error('Platba byla zamítnuta');
        }
      } else if (paymentMethod === 'stripe') {
        // TODO: Implementace Stripe platby
        alert('Stripe platby budou implementovány v další verzi');
      } else if (paymentMethod === 'paypal') {
        // TODO: Implementace PayPal platby
        alert('PayPal platby budou implementovány v další verzi');
      }
    } catch (error) {
      alert(`❌ Chyba platby: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    } finally {
      setIsProcessing(false);
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
        zIndex: 1001
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDarkMode ? '#2d3748' : 'white',
          borderRadius: '20px',
          width: '95%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: isDarkMode ? 'white' : '#333',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '20px',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
              💳 Platba
            </h2>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              Dokončete nákup dárků
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Order Summary */}
          <div style={{
            background: isDarkMode ? '#4a5568' : '#f7fafc',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📋 Souhrn objednávky</h3>
            
            {items.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <span>{item.name} x{item.quantity}</span>
                <span>{item.price * item.quantity} {currency}</span>
              </div>
            ))}
            
            <div style={{
              borderTop: `1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'}`,
              paddingTop: '10px',
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              <span>Celkem:</span>
              <span style={{ color: '#667eea' }}>{amount} {currency}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>💳 Způsob platby</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Fake Payment */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: paymentMethod === 'fake' ? (isDarkMode ? '#4a5568' : '#e6fffa') : 'transparent',
                border: `2px solid ${paymentMethod === 'fake' ? '#667eea' : (isDarkMode ? '#4a5568' : '#e2e8f0')}`,
                borderRadius: '10px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="fake"
                  checked={paymentMethod === 'fake'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'fake')}
                  style={{ margin: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>🧪 Testovací platba</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>Pro testování aplikace</div>
                </div>
              </label>

              {/* Stripe */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: paymentMethod === 'stripe' ? (isDarkMode ? '#4a5568' : '#e6fffa') : 'transparent',
                border: `2px solid ${paymentMethod === 'stripe' ? '#667eea' : (isDarkMode ? '#4a5568' : '#e2e8f0')}`,
                borderRadius: '10px',
                cursor: 'pointer',
                opacity: 0.6
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                  disabled
                  style={{ margin: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>💳 Kreditní karta (Stripe)</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>Připravuje se...</div>
                </div>
              </label>

              {/* PayPal */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: paymentMethod === 'paypal' ? (isDarkMode ? '#4a5568' : '#e6fffa') : 'transparent',
                border: `2px solid ${paymentMethod === 'paypal' ? '#667eea' : (isDarkMode ? '#4a5568' : '#e2e8f0')}`,
                borderRadius: '10px',
                cursor: 'pointer',
                opacity: 0.6
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                  disabled
                  style={{ margin: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>🅿️ PayPal</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>Připravuje se...</div>
                </div>
              </label>
            </div>
          </div>

          {/* Card Details (for Stripe) */}
          {paymentMethod === 'stripe' && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>💳 Údaje karty</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Číslo karty"
                  value={cardData.number}
                  onChange={(e) => setCardData({...cardData, number: e.target.value})}
                  style={{
                    padding: '12px',
                    border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: isDarkMode ? '#1a202c' : 'white',
                    color: isDarkMode ? 'white' : '#333',
                    fontSize: '14px'
                  }}
                />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      background: isDarkMode ? '#1a202c' : 'white',
                      color: isDarkMode ? 'white' : '#333',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      background: isDarkMode ? '#1a202c' : 'white',
                      color: isDarkMode ? 'white' : '#333',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Jméno na kartě"
                  value={cardData.name}
                  onChange={(e) => setCardData({...cardData, name: e.target.value})}
                  style={{
                    padding: '12px',
                    border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: isDarkMode ? '#1a202c' : 'white',
                    color: isDarkMode ? 'white' : '#333',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          )}

          {/* Test Info */}
          {paymentMethod === 'fake' && (
            <div style={{
              background: isDarkMode ? '#2d5016' : '#f0fff4',
              border: `1px solid ${isDarkMode ? '#38a169' : '#68d391'}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🧪 Testovací režim</div>
              <div>Toto je simulace platby pro testování. Žádné skutečné peníze nebudou strženy.</div>
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            style={{
              width: '100%',
              background: isProcessing 
                ? (isDarkMode ? '#4a5568' : '#e2e8f0')
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: isProcessing ? (isDarkMode ? '#a0aec0' : '#718096') : 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isProcessing ? (
              <span>⏳ Zpracovávám platbu...</span>
            ) : (
              <span>💳 Zaplatit {amount} {currency}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
