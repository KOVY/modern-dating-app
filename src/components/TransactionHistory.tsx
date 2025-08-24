import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Transaction {
  id: number;
  sender_id: number;
  receiver_id: number;
  gift_id: number;
  message: string;
  created_at: string;
  gift_name: string;
  gift_icon: string;
  gift_price_czk: number;
  sender_name?: string;
  receiver_name?: string;
}

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  countries: any;
  currentCountry: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  countries,
  currentCountry
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const { user } = useAuth();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Get current currency
  const getCurrentCurrency = () => {
    const country = countries[currentCountry];
    return {
      currency: country?.currency || 'Kč',
      symbol: country?.currency || 'Kč'
    };
  };

  // Convert price to current currency
  const convertPrice = (priceCzk: number) => {
    const { currency } = getCurrentCurrency();
    switch (currency) {
      case '€': return Math.round(priceCzk / 25);
      case '$': return Math.round(priceCzk / 23);
      case '£': return Math.round(priceCzk / 29);
      case 'CHF': return Math.round(priceCzk / 22);
      case 'kr': return Math.round(priceCzk / 2.5);
      case '₽': return Math.round(priceCzk * 3.5);
      default: return priceCzk;
    }
  };

  // Load transactions
  useEffect(() => {
    if (isOpen && user) {
      loadTransactions();
    }
  }, [isOpen, user]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/transactions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('loveconnect_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'sent') return transaction.sender_id === user?.id;
    if (filter === 'received') return transaction.receiver_id === user?.id;
    return transaction.sender_id === user?.id || transaction.receiver_id === user?.id;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              📊 Historie transakcí
            </h2>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              Vaše odeslané a přijaté dárky
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

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          background: isDarkMode ? '#4a5568' : '#f7fafc',
          padding: '10px 20px'
        }}>
          {[
            { key: 'all', label: '📋 Vše', count: transactions.length },
            { key: 'sent', label: '📤 Odeslané', count: transactions.filter(t => t.sender_id === user?.id).length },
            { key: 'received', label: '📥 Přijaté', count: transactions.filter(t => t.receiver_id === user?.id).length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              style={{
                flex: 1,
                background: filter === tab.key 
                  ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                  : 'transparent',
                color: filter === tab.key ? 'white' : (isDarkMode ? 'white' : '#333'),
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                margin: '0 2px'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
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
              <p>Načítám transakce...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎁</div>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Žádné transakce</p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>
                {filter === 'sent' && 'Zatím jste nikomu neposlali dárek'}
                {filter === 'received' && 'Zatím jste nedostali žádný dárek'}
                {filter === 'all' && 'Zatím nemáte žádné transakce'}
              </p>
            </div>
          ) : (
            <div style={{ 
              padding: '20px', 
              flex: 1, 
              overflowY: 'auto'
            }}>
              {filteredTransactions.map((transaction) => {
                const isSent = transaction.sender_id === user?.id;
                const otherPersonName = isSent ? transaction.receiver_name : transaction.sender_name;
                
                return (
                  <div
                    key={transaction.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      background: isDarkMode ? '#4a5568' : '#f7fafc',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      border: `2px solid ${isSent ? '#48bb78' : '#667eea'}`
                    }}
                  >
                    {/* Gift Icon */}
                    <div style={{
                      fontSize: '24px',
                      background: isDarkMode ? '#2d3748' : 'white',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {transaction.gift_icon}
                    </div>

                    {/* Transaction Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '5px'
                      }}>
                        <div>
                          <p style={{ 
                            margin: '0 0 2px 0', 
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            {isSent ? '📤' : '📥'} {transaction.gift_name}
                          </p>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '12px', 
                            opacity: 0.7 
                          }}>
                            {isSent ? `Pro: ${otherPersonName}` : `Od: ${otherPersonName}`}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ 
                            margin: '0 0 2px 0', 
                            fontWeight: 'bold',
                            color: isSent ? '#e53e3e' : '#48bb78',
                            fontSize: '14px'
                          }}>
                            {isSent ? '-' : '+'}{convertPrice(transaction.gift_price_czk)} {symbol}
                          </p>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '11px', 
                            opacity: 0.7 
                          }}>
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      {transaction.message && (
                        <p style={{
                          margin: '5px 0 0 0',
                          fontSize: '12px',
                          fontStyle: 'italic',
                          opacity: 0.8,
                          background: isDarkMode ? '#2d3748' : 'white',
                          padding: '5px 8px',
                          borderRadius: '5px'
                        }}>
                          💬 "{transaction.message}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
