import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import '../styles/DecoratePage.css';

const ALL_STICKERS = [
  '😀','😂','😍','🥰','😎','🤩','😘','😜','🤗','🥳',
  '😇','🤓','😛','😏','🤪','😴','🤔','😮','😲','🥺',
  '❤️','💕','💖','💗','💓','💞','💝','💘','💟','♥️',
  '🌸','🌺','🌹','🌷','🌻','🌼','💐','🌿','🍀','🌱',
  '⭐','🌟','✨','💫','🌙','☀️','🌈','❄️','🔥','💥',
  '🎀','🎁','🎈','🎉','🎊','🎵','🎶','🎸','🎹','🎺',
  '🦋','🐝','🐞','🦄','🐼','🐨','🐻','🦊','🐰','🐱',
  '🍓','🍒','🍑','🍋','🍉','🍇','🍦','🍰','🎂','🍭',
  '💎','👑','💍','🏆','🎭','🎪','🎨','🖼️','📷','🎬',
  '🌍','🗺️','🏖️','🏝️','🗻','🌃','🌆','🌉','🌌','🎆',
  '💃','🕺','👯','🤸','⛹️','🧘','🤾','🏄','🧗','🤺',
  '🚀','✈️','🛸','🌠','🔭','🌊','⛵','🎡','🎢','🎠',
  '📚','📖','📝','✏️','🖊️','📌','📎','🗂️','📂','🗒️',
  '💡','🔮','🧿','🪄','🪅','🎭','🎪','🎨','🖌️','🎯',
  '🌮','🍕','🍔','🍟','🌯','🥗','🍜','🍱','🥘','🍲',
  '☕','🧋','🍵','🥤','🍺','🥂','🍾','🧃','🍹','🫗',
  '💻','📱','⌚','🖥️','🎮','🕹️','🎲','♟️','🃏','🎴',
  '🌺','🌸','🌼','🌻','🌾','🍁','🍂','🍃','🌵','🎋',
  '🦅','🦆','🦉','🦜','🦢','🐦','🐧','🐓','🦚','🦩',
  '🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔶',
];

const FONT_FAMILIES = [
  { label: 'Sans Serif',    value: 'Inter, sans-serif' },
  { label: 'Serif',         value: 'Playfair Display, serif' },
  { label: 'Monospace',     value: 'Courier New, monospace' },
  { label: 'Cursive',       value: 'Dancing Script, cursive' },
  { label: 'Impact',        value: 'Impact, fantasy' },
];

let overlayIdCounter = 0;
function newId() { return ++overlayIdCounter; }

function DraggableOverlay({ item, stripRef, onRemove, onMove }) {
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startItem = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (e.target.classList.contains('overlay-item__remove')) return;
    e.preventDefault();
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startItem.current = { x: item.x, y: item.y };

    const onMouseMove = (me) => {
      if (!isDragging.current) return;
      const dx = me.clientX - startPos.current.x;
      const dy = me.clientY - startPos.current.y;
      onMove(item.id, startItem.current.x + dx, startItem.current.y + dy);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [item, onMove]);

  const content = item.type === 'sticker'
    ? <span style={{ fontSize: item.size || '1.8rem', lineHeight: 1 }}>{item.value}</span>
    : (
      <span style={{
        fontSize: item.size || '14px',
        fontFamily: item.font || 'Inter, sans-serif',
        fontWeight: item.bold ? '700' : '400',
        color: item.color || '#2c2c2c',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.3,
        display: 'block',
        maxWidth: 200,
        wordBreak: 'break-word',
      }}>{item.value}</span>
    );

  return (
    <div
      className="overlay-item"
      style={{ left: item.x, top: item.y }}
      onMouseDown={onMouseDown}
    >
      {content}
      <div
        className="overlay-item__remove"
        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        title="Remove"
      >×</div>
    </div>
  );
}

export default function DecoratePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shots = 4, theme = {}, photos = [] } = location.state || {};

  const [activeTab, setActiveTab] = useState('stickers');
  const [overlays, setOverlays] = useState([]);
  const [stickerSearch, setStickerSearch] = useState('');
  const [textValue, setTextValue] = useState('');
  const [textFont, setTextFont] = useState(FONT_FAMILIES[0].value);
  const [textBold, setTextBold] = useState(false);
  const [textSize, setTextSize] = useState(16);
  const [textColor, setTextColor] = useState('#2c2c2c');
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const stripRef = useRef(null);

  const photoHeight = shots === 6 ? 70 : shots === 4 ? 85 : 100;
  const stripWidth = 180;

  const filteredStickers = ALL_STICKERS.filter(s =>
    stickerSearch === '' || s.includes(stickerSearch)
  );

  function addSticker(emoji) {
    setOverlays(prev => [...prev, {
      id: newId(),
      type: 'sticker',
      value: emoji,
      size: '2rem',
      x: 20 + Math.random() * 80,
      y: 20 + Math.random() * 60,
    }]);
  }

  function addText() {
    if (!textValue.trim()) return;
    setOverlays(prev => [...prev, {
      id: newId(),
      type: 'text',
      value: textValue,
      font: textFont,
      bold: textBold,
      size: `${textSize}px`,
      color: textColor,
      x: 10,
      y: 20 + Math.random() * 60,
    }]);
    setTextValue('');
  }

  function removeOverlay(id) {
    setOverlays(prev => prev.filter(o => o.id !== id));
  }

  function moveOverlay(id, x, y) {
    setOverlays(prev => prev.map(o => o.id === id ? { ...o, x, y } : o));
  }

  async function handleDownload() {
    if (!stripRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(stripRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: theme.bg || '#ffffff',
        logging: false,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `photobooth-strip-${Date.now()}.png`;
      a.click();
      setTimeout(() => navigate('/congrats'), 600);
    } catch {
      alert('Could not download. Try again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="decorate">
      <nav className="decorate__nav">
        <div className="decorate__logo">photobooth</div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
          Decorate your strip ✨
        </span>
      </nav>

      <div className="decorate__body">
        {/* ── Left panel ── */}
        <div className="decorate__left">
          <div className="decorate__tabs">
            <button
              className={`decorate__tab${activeTab === 'stickers' ? ' active' : ''}`}
              onClick={() => setActiveTab('stickers')}
            >
              Stickers & Emoji
            </button>
            <button
              className={`decorate__tab${activeTab === 'text' ? ' active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              Add Text
            </button>
          </div>

          {activeTab === 'stickers' && (
            <>
              <div className="stickers__search">
                <input
                  type="text"
                  placeholder="Search stickers…"
                  value={stickerSearch}
                  onChange={e => setStickerSearch(e.target.value)}
                />
              </div>
              <div className="stickers__grid">
                {filteredStickers.map((s, i) => (
                  <button
                    key={i}
                    className="sticker-btn"
                    onClick={() => addSticker(s)}
                    title={`Add ${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === 'text' && (
            <div className="text__panel">
              <div>
                <label className="text__field-label">Your Text</label>
                <textarea
                  className="text__input"
                  placeholder="Type your message…"
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                />
              </div>

              <div>
                <label className="text__field-label">Font</label>
                <select
                  className="text__select"
                  value={textFont}
                  onChange={e => setTextFont(e.target.value)}
                  style={{ width: '100%', fontFamily: textFont }}
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text__field-label">Style</label>
                <div className="text__row">
                  <button
                    className={`text__bold${textBold ? ' active' : ''}`}
                    onClick={() => setTextBold(b => !b)}
                  >
                    B
                  </button>
                  <input
                    className="text__size"
                    type="number"
                    min={8}
                    max={64}
                    value={textSize}
                    onChange={e => setTextSize(Number(e.target.value))}
                    title="Font size"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>px</span>
                  <input
                    className="text__color"
                    type="color"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    title="Text color"
                  />
                </div>
              </div>

              <div style={{
                padding: '10px 12px',
                background: 'var(--pink-light)',
                borderRadius: 8,
                fontFamily: textFont,
                fontWeight: textBold ? '700' : '400',
                fontSize: Math.min(textSize, 22) + 'px',
                color: textColor,
                minHeight: 40,
                wordBreak: 'break-word',
              }}>
                {textValue || <span style={{ opacity: 0.4, fontStyle: 'italic', fontSize: 14, fontFamily: 'Inter' }}>Preview…</span>}
              </div>

              <button
                className="text__add-btn"
                onClick={addText}
                disabled={!textValue.trim()}
              >
                Place on Strip
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Strip canvas ── */}
        <div className="decorate__right">
          <div className="decorate__canvas-wrapper">
            <div
              ref={stripRef}
              className="decorate__strip"
              style={{
                background: theme.bg || '#ffffff',
                width: stripWidth,
                border: `2px solid ${theme.photoColor || '#f48fb1'}`,
              }}
            >
              <div className="strip__photos">
                {Array.from({ length: shots }).map((_, i) => (
                  <div
                    key={i}
                    className="strip__photo"
                    style={{ width: '100%', height: photoHeight }}
                  >
                    {photos[i] ? (
                      <img src={photos[i]} alt={`Shot ${i + 1}`} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${theme.photoColor || '#f48fb1'} 0%, ${theme.photoColor || '#f48fb1'}88 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                      }}>📷</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="strip__label">photobooth</div>

              {overlays.map(item => (
                <DraggableOverlay
                  key={item.id}
                  item={item}
                  stripRef={stripRef}
                  onRemove={removeOverlay}
                  onMove={moveOverlay}
                />
              ))}
            </div>
          </div>

          <div className="decorate__actions">
            <button
              className="decorate__btn decorate__btn--preview"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
            <button
              className="decorate__btn decorate__btn--download"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Downloading…' : 'Download'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Preview modal ── */}
      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="preview-modal__inner" onClick={e => e.stopPropagation()}>
            <button
              className="preview-modal__close"
              onClick={() => setShowPreview(false)}
            >×</button>
            <div className="preview-modal__title">Your Strip</div>

            <div
              className="preview-modal__strip"
              style={{ background: theme.bg || '#ffffff', border: `2px solid ${theme.photoColor || '#f48fb1'}` }}
            >
              {Array.from({ length: shots }).map((_, i) => (
                <div
                  key={i}
                  className="preview-modal__photo"
                  style={{ width: 240, height: shots === 6 ? 88 : shots === 4 ? 105 : 125 }}
                >
                  {photos[i] ? (
                    <img
                      src={photos[i]}
                      alt={`Shot ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: `linear-gradient(135deg, ${theme.photoColor || '#f48fb1'} 0%, ${theme.photoColor || '#f48fb1'}88 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                    }}>📷</div>
                  )}
                </div>
              ))}
              <div className="preview-modal__label">photobooth</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
