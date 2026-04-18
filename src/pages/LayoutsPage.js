import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LayoutsPage.css';

const SHOT_OPTIONS = [3, 4, 6];

const TEMPLATE_THEMES = [
  { name: 'Classic White',    bg: '#ffffff', photoColor: '#d4a0b0', borderClass: 'strip-border-0', sticker: null,  badge: 'TRY IT NOW' },
  { name: 'Blossom',          bg: '#fff8fb', photoColor: '#e8b4c4', borderClass: 'strip-border-1', sticker: '🌸',  badge: 'TRY IT NOW' },
  { name: 'Sehun Collab',     bg: '#fff9e8', photoColor: '#f0d090', borderClass: 'strip-border-4', sticker: '🌟',  badge: 'COLLAB EVENT' },
  { name: 'Hearts Filter',    bg: '#fff0f5', photoColor: '#f0a0b8', borderClass: 'strip-border-2', sticker: '❤️',  badge: 'NEW LAYOUT' },
  { name: 'Vintage',          bg: '#f9f0e0', photoColor: '#c8a878', borderClass: 'strip-border-6', sticker: null,  badge: 'NEW LAYOUT' },
  { name: 'Dreamy Pink',      bg: '#fef0f8', photoColor: '#e8a0c8', borderClass: 'strip-border-5', sticker: '🎀',  badge: null },
  { name: 'Lavender',         bg: '#f8f5ff', photoColor: '#b0a0d8', borderClass: 'strip-border-7', sticker: '💜',  badge: null },
  { name: 'Rose Gold',        bg: '#fff5f0', photoColor: '#d4a898', borderClass: 'strip-border-6', sticker: '✨',  badge: null },
  { name: 'Midnight',         bg: '#2c2c3c', photoColor: '#8080b0', borderClass: 'strip-border-9', sticker: '🌙',  badge: null },
  { name: 'Sky Blue',         bg: '#f0f8ff', photoColor: '#90c0e8', borderClass: 'strip-border-9', sticker: '☁️',  badge: null },
  { name: 'Cherry Blossom',   bg: '#fff5f8', photoColor: '#f0b0c0', borderClass: 'strip-border-1', sticker: '🌺',  badge: null },
  { name: 'Neon Pink',        bg: '#fff0fc', photoColor: '#ff80c0', borderClass: 'strip-border-8', sticker: '💖',  badge: null },
  { name: 'Forest Green',     bg: '#f0fff5', photoColor: '#90c8a0', borderClass: 'strip-border-3', sticker: '🍃',  badge: null },
  { name: 'Sunny Day',        bg: '#fffde8', photoColor: '#f0d870', borderClass: 'strip-border-3', sticker: '☀️',  badge: null },
  { name: 'Cotton Candy',     bg: '#fef4ff', photoColor: '#e0a8f0', borderClass: 'strip-border-5', sticker: '🍬',  badge: null },
  { name: 'Retro Film',       bg: '#f5e8d0', photoColor: '#b89870', borderClass: 'strip-border-6', sticker: '📷',  badge: null },
  { name: 'Mint Fresh',       bg: '#f0fffc', photoColor: '#80d8c8', borderClass: 'strip-border-9', sticker: '🌿',  badge: null },
  { name: 'Golden Hour',      bg: '#fff8e8', photoColor: '#e8c070', borderClass: 'strip-border-6', sticker: '🌅',  badge: null },
  { name: 'Bubblegum',        bg: '#fff0f5', photoColor: '#f0a0b8', borderClass: 'strip-border-1', sticker: '🫧',  badge: null },
  { name: 'Starlight',        bg: '#f5f0ff', photoColor: '#c0b0e8', borderClass: 'strip-border-7', sticker: '⭐',  badge: null },
];

function TemplateCard({ theme, shots, onClick }) {
  const photoHeight = shots === 6 ? 22 : shots === 4 ? 26 : 30;

  return (
    <div className="template-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="template-card__wrap">
        {theme.badge && (
          <div className="template-card__badge">{theme.badge}</div>
        )}
        <div
          className={`template-card__strip ${theme.borderClass}`}
          style={{ background: theme.bg }}
        >
          {theme.sticker && (
            <span className="template-sticker" style={{ top: 4, right: 4 }}>{theme.sticker}</span>
          )}
          {Array.from({ length: shots }).map((_, i) => (
            <div
              key={i}
              className="template-card__photo"
              style={{
                height: photoHeight,
                background: `linear-gradient(135deg, ${theme.photoColor} 0%, ${theme.photoColor}88 100%)`,
                borderRadius: 3,
              }}
            />
          ))}
          <div className="template-card__label-strip">photobooth</div>
        </div>
      </div>
      <div className="template-card__info">
        <div className="template-card__name">{theme.name}</div>
        <div className="template-card__size">Size 6×2 Strip · {shots} Pose</div>
      </div>
    </div>
  );
}

export default function LayoutsPage() {
  const [shots, setShots] = useState(4);
  const navigate = useNavigate();

  function handleSelect(theme) {
    navigate('/camera', { state: { shots, theme } });
  }

  return (
    <div className="layouts">
      <nav className="layouts__nav">
        <div className="layouts__logo">photobooth</div>
        <ul className="layouts__nav-links">
          <li><a href="/">home</a></li>
          <li><a href="#about">about</a></li>
          <li><a href="/layouts" className="active">choose layout</a></li>
        </ul>
      </nav>

      <div className="layouts__header">
        <h1>choose your layout</h1>
        <p>Select from our collection of photo booth layouts</p>
      </div>

      <div className="layouts__shot-selector">
        {SHOT_OPTIONS.map(n => (
          <button
            key={n}
            className={`shot-btn${shots === n ? ' active' : ''}`}
            onClick={() => setShots(n)}
          >
            {n} Shot
          </button>
        ))}
      </div>

      <p className="layouts__section-title">
        {shots}-Shot Layouts — {TEMPLATE_THEMES.length} Templates
      </p>

      <div className="layouts__grid">
        {TEMPLATE_THEMES.map((theme, idx) => (
          <TemplateCard
            key={idx}
            theme={theme}
            shots={shots}
            onClick={() => handleSelect(theme)}
          />
        ))}
      </div>
    </div>
  );
}
