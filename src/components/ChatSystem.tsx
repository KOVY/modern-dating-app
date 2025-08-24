import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  message_text: string;
  sent_at: string;
  sender_name?: string;
}

interface Match {
  id: number;
  user1_id: number;
  user2_id: number;
  matched_at: string;
  other_user_name: string;
  other_user_id: number;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

interface ChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  initialMatchId?: number;
}

const ChatSystem: React.FC<ChatSystemProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  initialMatchId
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load matches when chat opens
  useEffect(() => {
    if (isOpen && user) {
      loadMatches();
    }
  }, [isOpen, user]);

  // Load messages when match is selected
  useEffect(() => {
    if (selectedMatch) {
      loadMessages(selectedMatch.id);
    }
  }, [selectedMatch]);

  // Select initial match if provided
  useEffect(() => {
    if (initialMatchId && matches.length > 0) {
      const match = matches.find(m => m.id === initialMatchId);
      if (match) {
        setSelectedMatch(match);
      }
    }
  }, [initialMatchId, matches]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/matches`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('loveconnect_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
        
        // Auto-select first match if no initial match specified
        if (!initialMatchId && data.length > 0) {
          setSelectedMatch(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: number) => {
    try {
      const response = await fetch(`${API_BASE}/messages/${matchId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('loveconnect_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch || !user) return;

    try {
      setSendingMessage(true);
      const response = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('loveconnect_token')}`
        },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add new message to list
        const newMsg: Message = {
          id: data.messageId,
          match_id: selectedMatch.id,
          sender_id: user.id,
          message_text: newMessage.trim(),
          sent_at: new Date().toISOString(),
          sender_name: user.name
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update match list with new last message
        setMatches(prev => prev.map(match => 
          match.id === selectedMatch.id 
            ? { ...match, last_message: newMessage.trim(), last_message_time: new Date().toISOString() }
            : match
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Chyba při odesílání zprávy');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'právě teď';
    if (diffMins < 60) return `před ${diffMins} min`;
    if (diffHours < 24) return `před ${diffHours} h`;
    if (diffDays === 1) return 'včera';
    return date.toLocaleDateString('cs-CZ');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
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
          width: '95%',
          maxWidth: '800px',
          height: '90vh',
          display: 'flex',
          color: isDarkMode ? 'white' : '#333',
          overflow: 'hidden'
        }}
      >
        {/* Matches Sidebar */}
        <div style={{
          width: '300px',
          borderRight: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Sidebar Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '20px',
            borderRadius: '20px 0 0 0'
          }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>💬 Chaty</h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
              {matches.length} konverzací
            </p>
          </div>

          {/* Matches List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Načítám konverzace...</p>
              </div>
            ) : matches.length === 0 ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>💔</div>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Žádné páry</p>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
                  Začněte swipovat a najděte si někoho!
                </p>
              </div>
            ) : (
              matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  style={{
                    padding: '15px 20px',
                    borderBottom: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    background: selectedMatch?.id === match.id 
                      ? (isDarkMode ? '#4a5568' : '#f7fafc') 
                      : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMatch?.id !== match.id) {
                      e.currentTarget.style.background = isDarkMode ? '#3a4553' : '#edf2f7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMatch?.id !== match.id) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
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
                      {match.other_user_name}
                    </h4>
                    {match.last_message_time && (
                      <span style={{ 
                        fontSize: '11px', 
                        opacity: 0.7 
                      }}>
                        {formatTime(match.last_message_time)}
                      </span>
                    )}
                  </div>
                  
                  {match.last_message && (
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      opacity: 0.7,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {match.last_message}
                    </p>
                  )}
                  
                  {match.unread_count && match.unread_count > 0 && (
                    <div style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#667eea',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {match.unread_count}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <div style={{
                background: isDarkMode ? '#4a5568' : '#f7fafc',
                padding: '20px',
                borderBottom: `1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                    💕 {selectedMatch.other_user_name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
                    Pár od {formatTime(selectedMatch.matched_at)}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isDarkMode ? 'white' : '#333',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {messages.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>💬</div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                      Začněte konverzaci!
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
                      Napište první zprávu pro {selectedMatch.other_user_name}
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMyMessage = message.sender_id === user?.id;
                    return (
                      <div
                        key={message.id}
                        style={{
                          display: 'flex',
                          justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                          alignItems: 'flex-end',
                          gap: '8px'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            borderRadius: isMyMessage 
                              ? '20px 20px 5px 20px' 
                              : '20px 20px 20px 5px',
                            background: isMyMessage 
                              ? 'linear-gradient(135deg, #667eea, #764ba2)'
                              : (isDarkMode ? '#4a5568' : '#f7fafc'),
                            color: isMyMessage ? 'white' : (isDarkMode ? 'white' : '#333'),
                            wordBreak: 'break-word'
                          }}
                        >
                          <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                            {message.message_text}
                          </p>
                          <p style={{
                            margin: 0,
                            fontSize: '11px',
                            opacity: 0.7,
                            textAlign: 'right'
                          }}>
                            {formatMessageTime(message.sent_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{
                padding: '20px',
                borderTop: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                background: isDarkMode ? '#2d3748' : 'white'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Napište zprávu pro ${selectedMatch.other_user_name}...`}
                    disabled={sendingMessage}
                    rows={1}
                    style={{
                      flex: 1,
                      padding: '12px 15px',
                      border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                      borderRadius: '20px',
                      background: isDarkMode ? '#1a202c' : 'white',
                      color: isDarkMode ? 'white' : '#333',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'none',
                      minHeight: '44px',
                      maxHeight: '120px'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    style={{
                      background: (!newMessage.trim() || sendingMessage)
                        ? (isDarkMode ? '#4a5568' : '#e2e8f0')
                        : 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: (!newMessage.trim() || sendingMessage)
                        ? (isDarkMode ? '#a0aec0' : '#718096')
                        : 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      cursor: (!newMessage.trim() || sendingMessage) ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {sendingMessage ? '⏳' : '📤'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '40px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>
              <h3 style={{ margin: '0 0 10px 0' }}>Vyberte konverzaci</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>
                Klikněte na některý z vašich matchů a začněte chatovat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
