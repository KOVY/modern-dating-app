import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: number;
  type: 'gift_received' | 'match' | 'like' | 'message';
  title: string;
  message: string;
  icon: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Mock notifications for demo
  useEffect(() => {
    if (isOpen && user) {
      loadNotifications();
    }
  }, [isOpen, user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - in real app, this would fetch from server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications: Notification[] = [
        {
          id: 1,
          type: 'gift_received',
          title: 'Nový dárek! 🎁',
          message: 'Petra vám poslala růži',
          icon: '🌹',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          read: false,
          data: { sender: 'Petra', gift: 'Růže' }
        },
        {
          id: 2,
          type: 'match',
          title: 'Nový match! ❤️',
          message: 'Máte nový match s Klárou',
          icon: '💕',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: false,
          data: { match: 'Klára' }
        },
        {
          id: 3,
          type: 'like',
          title: 'Někdo vás má rád! 👍',
          message: 'Tereza vám dala like',
          icon: '❤️',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          read: true,
          data: { liker: 'Tereza' }
        },
        {
          id: 4,
          type: 'gift_received',
          title: 'Další dárek! 🎁',
          message: 'Veronika vám poslala šampaňské',
          icon: '🍾',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true,
          data: { sender: 'Veronika', gift: 'Šampaňské' }
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `před ${diffMins} min`;
    } else if (diffHours < 24) {
      return `před ${diffHours} h`;
    } else {
      return `před ${diffDays} dny`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          width: '95%',
          maxWidth: '450px',
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
              🔔 Notifikace
            </h2>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              {unreadCount > 0 ? `${unreadCount} nepřečtených` : 'Vše přečteno'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Označit vše
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
              <p>Načítám notifikace...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔔</div>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Žádné notifikace</p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>
                Zatím nemáte žádné nové notifikace
              </p>
            </div>
          ) : (
            <div style={{ 
              padding: '10px 20px 20px', 
              flex: 1, 
              overflowY: 'auto'
            }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    padding: '15px',
                    background: notification.read 
                      ? (isDarkMode ? '#4a5568' : '#f7fafc')
                      : (isDarkMode ? '#2d5016' : '#f0fff4'),
                    borderRadius: '10px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    border: notification.read 
                      ? 'none' 
                      : `2px solid ${isDarkMode ? '#38a169' : '#68d391'}`,
                    position: 'relative'
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    fontSize: '24px',
                    background: isDarkMode ? '#2d3748' : 'white',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '5px'
                    }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {notification.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          opacity: 0.7,
                          whiteSpace: 'nowrap'
                        }}>
                          {formatTime(notification.timestamp)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: isDarkMode ? '#a0aec0' : '#718096',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      opacity: 0.8,
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>

                    {!notification.read && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '8px',
                        height: '8px',
                        background: '#667eea',
                        borderRadius: '50%'
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
