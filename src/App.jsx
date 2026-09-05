import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Check, 
  X, 
  Wifi, 
  Signal, 
  Battery, 
  ArrowLeft 
} from 'lucide-react';

export default function App() {
  // Screen state: 'search' | 'success'
  const [screenState, setScreenState] = useState('search');
  
  // Numerical state for balance and coins
  const [balanceAmount, setBalanceAmount] = useState(856647390.22);
  const [totalCoins, setTotalCoins] = useState(70587586600);
  
  // Input state for search username
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time lookup data for searched TikTok profile
  const [profileData, setProfileData] = useState({
    displayName: '',
    avatarUrl: '',
    stats: ''
  });

  // Selected recipient user
  const [selectedUser, setSelectedUser] = useState({
    handle: 'happy_momonga',
    displayName: 'happy_momonga',
    avatarUrl: '/avatar.png'
  });

  // Coin selection modal & exchange values
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coinAmount, setCoinAmount] = useState(5000000);
  const [deductedUsd, setDeductedUsd] = useState(60500.00);

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  
  // Loading spinner state
  const [isLoading, setIsLoading] = useState(false);

  // Time state formatted specifically in Dubai timezone
  const [exchangeTime, setExchangeTime] = useState('');

  // Cleaned handle from search input
  const cleanUsername = searchQuery.trim().replace(/^@/, '');

  // Helper formatters
  const formatCurrency = (val) => {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatCoins = (val) => {
    return val.toLocaleString('en-US');
  };

  // Real-time TikTok profile lookup effect
  useEffect(() => {
    if (!cleanUsername) return;

    // Default unique avatar per username
    const uniqueAvatar = cleanUsername.toLowerCase() === 'happy_momonga' 
      ? '/avatar.png'
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanUsername)}`;

    // Initial optimistic state
    setProfileData({
      displayName: cleanUsername,
      avatarUrl: uniqueAvatar,
      stats: cleanUsername.toLowerCase() === 'happy_momonga' 
        ? '57 followers 92 following' 
        : `${(cleanUsername.length * 43 + 89) % 950 + 15} followers ${(cleanUsername.length * 17) % 350 + 9} following`
    });

    // Attempt official TikTok OEmbed fetch to retrieve verified display name
    const controller = new AbortController();
    fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${cleanUsername}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.author_name) {
          setProfileData(prev => ({
            ...prev,
            displayName: data.author_name
          }));
        }
      })
      .catch(() => {
        // Silently use default unique state if offline or blocked
      });

    return () => controller.abort();
  }, [cleanUsername]);

  // Open coin amount input modal when user card is clicked
  const handleOpenModal = () => {
    setSelectedUser({
      handle: cleanUsername,
      displayName: profileData.displayName || cleanUsername,
      avatarUrl: profileData.avatarUrl
    });
    setIsModalOpen(true);
  };

  // Handle Preset Coin Selection
  const handleSelectPreset = (coins, usd) => {
    setCoinAmount(coins);
    setDeductedUsd(usd);
  };

  // Confirm Exchange inside modal
  const handleConfirmExchange = () => {
    setIsModalOpen(false);
    setIsLoading(true);

    // DEDUCT balance and total coins dynamically!
    setBalanceAmount(prev => Math.max(0, prev - deductedUsd));
    setTotalCoins(prev => Math.max(0, prev - coinAmount));

    // Format timestamp in Gulf Standard Time (Asia/Dubai)
    const dubaiTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' });
    setExchangeTime(dubaiTime);

    setTimeout(() => {
      setIsLoading(false);
      // Trigger success popup toast notification
      setShowToast(true);
      setScreenState('success');
      
      // Auto hide toast after 5 seconds
      setTimeout(() => setShowToast(false), 5000);
    }, 1500);
  };

  // Reset back to search screen
  const handleGoBack = () => {
    setScreenState('search');
    setSearchQuery('');
    setIsLoading(false);
  };

  return (
    <div className="app-viewport">
      {/* Simulated Mobile Status Bar */}
      <div className="mobile-status-bar">
        <span>01:02</span>
        <div className="status-bar-icons">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={16} />
        </div>
      </div>

      {/* Top Banner Toast (Only shown AFTER exchange completes) */}
      {showToast && (
        <div className="top-toast">
          <div className="tiktok-toast-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.22a6.33 6.33 0 0 0-4.75 6.1 6.34 6.34 0 0 0 10.86 4.43c2.49-2.49 2.45-6.52 2.45-6.52a8.16 8.16 0 0 0 4.55 1.34V10.1a4.84 4.84 0 0 1-3-3.41z"/>
            </svg>
          </div>
          <div className="toast-content">
            <div className="toast-title">TikTok LIVE Rewards</div>
            <div className="toast-message">Successfully sent coins to @{selectedUser.handle}</div>
          </div>
        </div>
      )}

      <div className="app-content">
        {screenState === 'search' ? (
          <div className="screen-wrapper">
            <div>
              {/* Screen 1: Header & Dynamic Deducting Balance */}
              <div className="screen-header">
                <button className="back-btn" title="Back">
                  <ChevronLeft size={24} />
                </button>
                <h1 className="header-title">Exchange</h1>
              </div>

              <div className="balance-section">
                <p className="balance-label">TikTok Coins Balance</p>
                <h2 className="big-balance">{formatCurrency(balanceAmount)}</h2>
                <div className="sub-balance">
                  <span>~ {formatCurrency(balanceAmount)}</span>
                  <span>(</span>
                  <span className="coin-icon">🪙</span>
                  <span>{formatCoins(totalCoins)})</span>
                </div>
                <p className="sub-balance-available">
                  Available balance to exchange the Coins
                </p>
              </div>

              {/* Search Input */}
              <div className="search-form-group">
                <label htmlFor="tiktok-username" className="search-label">
                  TikTok username
                </label>
                <div className="input-wrapper">
                  <input
                    id="tiktok-username"
                    type="text"
                    className="search-input"
                    placeholder="@username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="clear-input-btn"
                      onClick={() => setSearchQuery('')}
                      title="Clear text"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {searchQuery && (
                  <p className="searching-text">Searching @{cleanUsername}...</p>
                )}
              </div>

              {/* Loading Spinner or User Search Card */}
              {isLoading ? (
                <div className="spinner-container">
                  <div className="loading-spinner"></div>
                  <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 500 }}>
                    Exchanging {formatCoins(coinAmount)} Coins for @{selectedUser.handle}...
                  </span>
                </div>
              ) : cleanUsername ? (
                /* Dynamic Search User Card */
                <div 
                  className="user-card" 
                  onClick={handleOpenModal}
                >
                  <div className="user-avatar-wrapper">
                    <img 
                      src={profileData.avatarUrl} 
                      alt={`${cleanUsername} profile`}
                      className="user-avatar"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;
                      }}
                    />
                  </div>
                  <div className="user-info">
                    <span className="user-name">{profileData.displayName || cleanUsername}</span>
                    <span className="user-handle">@{cleanUsername}</span>
                    <span className="user-stats">{profileData.stats}</span>
                  </div>
                </div>
              ) : (
                /* Prompt when search input is empty */
                <div className="empty-search-prompt">
                  Enter a TikTok username above to search and exchange coins
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Screen 2: Success Screen ("Exchange Completed!") - IDENTICAL FIXED FRAME */
          <div className="success-screen">
            <div className="success-top-content">
              <div className="success-header-icon">
                <Check size={36} strokeWidth={3} />
              </div>

              <h2 className="success-title">Exchange Completed!</h2>
              
              <p className="success-subtitle">
                You exchanged for <span className="coin-icon" style={{ width: 16, height: 16, fontSize: 9 }}>🪙</span> {formatCoins(coinAmount)} Coins
              </p>

              {/* Receipt Details */}
              <div className="receipt-card">
                <div className="receipt-row">
                  <span className="receipt-key">Recipient</span>
                  <span className="receipt-value">@{selectedUser.handle}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Coins Exchanged</span>
                  <span className="receipt-value">{formatCoins(coinAmount)} Coins</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Deducted Amount</span>
                  <span className="receipt-value">${deductedUsd.toFixed(2)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Time</span>
                  <span className="receipt-value">
                    {exchangeTime || new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })}
                  </span>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="promo-banner">
                <div className="promo-icon-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.22a6.33 6.33 0 0 0-4.75 6.1 6.34 6.34 0 0 0 10.86 4.43c2.49-2.49 2.45-6.52 2.45-6.52a8.16 8.16 0 0 0 4.55 1.34V10.1a4.84 4.84 0 0 1-3-3.41z"/>
                  </svg>
                </div>
                <div className="promo-content">
                  <span className="promo-title">Start gifter level</span>
                  <p className="promo-text">
                    Send your first Gift to begin your gifter journey and unlock more rewards as you level up.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="action-button-wrapper">
              <button className="go-back-btn" onClick={handleGoBack}>
                <ArrowLeft size={18} />
                <span>Go back</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CUSTOM COINS EXCHANGE MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="custom-exchange-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Custom Exchange</h3>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-recipient-badge">
              <img 
                src={selectedUser.avatarUrl}
                alt={selectedUser.handle}
                className="modal-recipient-avatar"
                referrerPolicy="no-referrer"
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#121212' }}>{selectedUser.displayName}</div>
                <div style={{ fontSize: 11, color: '#868e96' }}>@{selectedUser.handle}</div>
              </div>
            </div>

            <div className="modal-input-group">
              <label className="modal-input-label">Number of Coins</label>
              <input 
                type="number"
                className="coin-amount-input"
                value={coinAmount}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setCoinAmount(val);
                  setDeductedUsd((val / 5000000) * 60500);
                }}
              />
            </div>

            <div className="preset-coins-grid">
              <button 
                className={`preset-chip ${coinAmount === 5000000 ? 'active' : ''}`}
                onClick={() => handleSelectPreset(5000000, 60500.00)}
              >
                🪙 5,000,000
              </button>
              <button 
                className={`preset-chip ${coinAmount === 1000000 ? 'active' : ''}`}
                onClick={() => handleSelectPreset(1000000, 12100.00)}
              >
                🪙 1,000,000
              </button>
              <button 
                className={`preset-chip ${coinAmount === 500000 ? 'active' : ''}`}
                onClick={() => handleSelectPreset(500000, 6050.00)}
              >
                🪙 500,000
              </button>
            </div>

            <div className="modal-deduct-summary">
              <span>Deducted Amount:</span>
              <strong style={{ color: '#fe2c55' }}>${deductedUsd.toFixed(2)}</strong>
            </div>

            <button className="modal-exchange-btn" onClick={handleConfirmExchange}>
              Exchange Coins
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
