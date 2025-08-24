import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PaymentModal from './PaymentModal';

interface Gift {
  id: number;
  name: string;
  icon: string;
  price_czk: number;
  price_eur: number;
  price_usd: number;
  category: string;
}

interface CartItem {
  gift: Gift;
  quantity: number;
  recipientId?: number;
  message?: string;
}

interface GiftShopProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  currentCountry: string;
  countries: any;
  recipientId?: number;
  recipientName?: string;
}

const GiftShop: React.FC<GiftShopProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  currentCountry,
  countries,
  recipientId,
  recipientName
}) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useAuth();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Get current currency and symbol
  const getCurrentCurrency = () => {
    const country = countries[currentCountry];
    return {
      currency: country?.currency || 'Kč',
      symbol: country?.currency || 'Kč'
    };
  };

  // Get price in current currency
  const getPrice = (gift: Gift) => {
    const { currency } = getCurrentCurrency();
    switch (currency) {
      case '€': return gift.price_eur;
      case '$': return gift.price_usd;
      case '£': return Math.round(gift.price_eur * 0.85); // Approximate conversion
      case 'CHF': return Math.round(gift.price_eur * 1.1);
      case 'kr': return Math.round(gift.price_eur * 10);
      case '₽': return Math.round(gift.price_eur * 90);
      default: return gift.price_czk;
    }
  };

  // Load gifts from API
  useEffect(() => {
    if (isOpen) {
      loadGifts();
    }
  }, [isOpen]);

  const loadGifts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/gifts`);
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error('Error loading gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = (gift: Gift) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.gift.id === gift.id);
      if (existingItem) {
        return prev.map(item =>
          item.gift.id === gift.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { 
          gift, 
          quantity: 1, 
          recipientId,
          message: ''
        }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (giftId: number) => {
    setCart(prev => prev.filter(item => item.gift.id !== giftId));
  };

  // Update quantity
  const updateQuantity = (giftId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(giftId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.gift.id === giftId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Calculate total
  const getTotal = () => {
    return cart.reduce((total, item) => {
      return total + (getPrice(item.gift) * item.quantity);
    }, 0);
  };

  // Send gifts (checkout)
  const handleCheckout = async () => {
    if (!user) {
      alert('Musíte být přihlášeni pro nákup dárků');
      return;
    }

    try {
      setLoading(true);
      
      for (const item of cart) {
        const response = await fetch(`${API_BASE}/send-gift`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('loveconnect_token')}`
          },
          body: JSON.stringify({
            receiverId: item.recipientId || recipientId,
            giftId: item.gift.id,
            message: item.message || `Dárek od ${user.name} ❤️`
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send gift');
        }
      }

      alert(`🎉 Dárky úspěšně odeslány ${recipientName ? `pro ${recipientName}` : ''}!`);
      setCart([]);
      setShowCheckout(false);
      onClose();

    } catch (error) {
      console.error('Error sending gifts:', error);
      alert('❌ Chyba při odesílání dárků');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const { symbol } = getCurrentCurrency();

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
          width: '95%',
          maxWidth: '500px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          color: isDarkMode ? 'white' : '#333',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
              🎁 Obchod s dárky
            </h2>
            {recipientName && (
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                Pro: {recipientName}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {cart.length > 0 && (
              <button
                onClick={() => setShowCart(!showCart)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  position: 'relative'
                }}
              >
                🛒 Košík ({cart.length})
              </button>
            )}
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
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px' 
            }}>
              <p>Načítám dárky...</p>
            </div>
          ) : showCart ? (
            /* Cart View */
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '20px' }}>🛒 Váš košík</h3>
              
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ opacity: 0.7 }}>Košík je prázdný</p>
                  <button
                    onClick={() => setShowCart(false)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    Pokračovat v nákupu
                  </button>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.gift.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      background: isDarkMode ? '#4a5568' : '#f7fafc',
                      borderRadius: '10px',
                      marginBottom: '10px'
                    }}>
                      <span style={{ fontSize: '24px' }}>{item.gift.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                          {item.gift.name}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>
                          {getPrice(item.gift)} {symbol}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={() => updateQuantity(item.gift.id, item.quantity - 1)}
                          style={{
                            background: isDarkMode ? '#2d3748' : '#e2e8f0',
                            border: 'none',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: isDarkMode ? 'white' : '#333'
                          }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.gift.id, item.quantity + 1)}
                          style={{
                            background: isDarkMode ? '#2d3748' : '#e2e8f0',
                            border: 'none',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: isDarkMode ? 'white' : '#333'
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.gift.id)}
                          style={{
                            background: '#e53e3e',
                            border: 'none',
                            color: 'white',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            marginLeft: '10px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total and Checkout */}
                  <div style={{
                    borderTop: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                    paddingTop: '20px',
                    marginTop: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Celkem:
                      </span>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                        {getTotal()} {symbol}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => setShowCart(false)}
                        style={{
                          flex: 1,
                          background: isDarkMode ? '#4a5568' : '#e2e8f0',
                          color: isDarkMode ? 'white' : '#333',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Pokračovat v nákupu
                      </button>
                      <button
                        onClick={() => setShowPayment(true)}
                        disabled={loading}
                        style={{
                          flex: 2,
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '10px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.6 : 1,
                          fontWeight: 'bold'
                        }}
                      >
                        💳 Přejít k platbě
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Gifts Grid */
            <div style={{ 
              padding: '20px', 
              flex: 1, 
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '15px'
            }}>
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  style={{
                    background: isDarkMode ? '#4a5568' : '#f7fafc',
                    borderRadius: '15px',
                    padding: '15px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    border: `2px solid transparent`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => addToCart(gift)}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                    {gift.icon}
                  </div>
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {gift.name}
                  </h4>
                  <p style={{ 
                    margin: '0 0 10px 0', 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: '#667eea'
                  }}>
                    {getPrice(gift)} {symbol}
                  </p>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    + Přidat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handleCheckout}
        isDarkMode={isDarkMode}
        amount={getTotal()}
        currency={getCurrentCurrency().symbol}
        items={cart.map(item => ({
          name: item.gift.name,
          quantity: item.quantity,
          price: getPrice(item.gift)
        }))}
      />
    </div>
  );
};

export default GiftShop;
