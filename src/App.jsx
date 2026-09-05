import React, { useState } from 'react';
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
  
  // Mock state for balance
  const [balance] = useState('$856,647,390.22');
  
  // Input state for search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected user state for exchange recipient
  const [selectedUser, setSelectedUser] = useState('happy_momonga');
  
  // Loading state for 1.5s card click transition
  const [isLoading, setIsLoading] = useState(false);

  // Time state formatted specifically in Dubai timezone
  const [exchangeTime, setExchangeTime] = useState('');

  // Derived current username from search query
  const cleanUsername = searchQuery.trim().replace(/^@/, '') || 'happy_momonga';

  // Handle user card click action
  const handleUserCardClick = (usernameToSelect) => {
    setSelectedUser(usernameToSelect || cleanUsername);
    setIsLoading(true);
    
    // Format timestamp in Gulf Standard Time (Asia/Dubai) as required
    const dubaiTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' });
    setExchangeTime(dubaiTime);

    setTimeout(() => {
      setIsLoading(false);
      setScreenState('success');
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

      {/* Top Banner Toast Simulation */}
      <div className="top-toast">
        <div className="tiktok-toast-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.22a6.33 6.33 0 0 0-4.75 6.1 6.34 6.34 0 0 0 10.86 4.43c2.49-2.49 2.45-6.52 2.45-6.52a8.16 8.16 0 0 0 4.55 1.34V10.1a4.84 4.84 0 0 1-3-3.41z"/>
          </svg>
        </div>
        <div className="toast-content">
          <div className="toast-title">TikTok LIVE Rewards</div>
          <div className="toast-message">Successfully sent coins to recipient</div>
        </div>
      </div>

      <div className="app-content">
        {screenState === 'search' ? (
          <>
            {/* Screen 1: Header & Balance */}
            <div className="screen-header">
              <button className="back-btn" title="Back">
                <ChevronLeft size={24} />
              </button>
              <h1 className="header-title">Exchange</h1>
            </div>

            <div className="balance-section">
              <p className="balance-label">TikTok Coins Balance</p>
              <h2 className="big-balance">{balance}</h2>
              <div className="sub-balance">
                <span>~ {balance}</span>
                <span>(</span>
                <span className="coin-icon">🪙</span>
                <span>70,587,586,600)</span>
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

            {/* Loading Spinner or Dynamic User Card */}
            {isLoading ? (
              <div className="spinner-container">
                <div className="loading-spinner"></div>
                <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 500 }}>
                  Searching & exchanging with @{selectedUser}...
                </span>
              </div>
            ) : (
              // Display card whenever typing or default happy_momonga
              <div 
                className="user-card" 
                onClick={() => handleUserCardClick(cleanUsername)}
              >
                <div className="user-avatar-wrapper">
                  <img 
                    src={`https://unavatar.io/tiktok/${cleanUsername}`} 
                    alt={`${cleanUsername} profile`}
                    className="user-avatar"
                    onError={(e) => {
                      // Fallback to local avatar image then SVG generator
                      if (e.target.src !== window.location.origin + '/avatar.png') {
                        e.target.src = '/avatar.png';
                      } else {
                        e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;
                      }
                    }}
                  />
                </div>
                <div className="user-info">
                  <span className="user-name">{cleanUsername}</span>
                  <span className="user-handle">@{cleanUsername}</span>
                  <span className="user-stats">
                    {cleanUsername === 'happy_momonga' ? '57 followers 92 following' : `${(cleanUsername.length * 17) % 800 + 45} followers ${(cleanUsername.length * 9) % 300 + 12} following`}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Screen 2: Success Screen ("Exchange Completed!") */
          <div className="success-screen">
            <div className="success-header-icon">
              <Check size={36} strokeWidth={3} />
            </div>

            <h2 className="success-title">Exchange Completed!</h2>
            
            <p className="success-subtitle">
              You exchanged for <span className="coin-icon" style={{ width: 16, height: 16, fontSize: 9 }}>🪙</span> 5,000,000 Coins
            </p>

            {/* Receipt Details */}
            <div className="receipt-card">
              <div className="receipt-row">
                <span className="receipt-key">Recipient</span>
                <span className="receipt-value">@{selectedUser}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-key">Coins Exchanged</span>
                <span className="receipt-value">5,000,000 Coins</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-key">Deducted Amount</span>
                <span className="receipt-value">$60500.00</span>
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
    </div>
  );
}
