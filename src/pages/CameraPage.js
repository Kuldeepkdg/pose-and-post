import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CameraPage.css';

const FILTERS = [
  { name: 'Natural',      css: 'none' },
  { name: 'B&W',         css: 'grayscale(100%)' },
  { name: 'Sepia',       css: 'sepia(80%)' },
  { name: 'Vintage',     css: 'sepia(40%) contrast(1.1) brightness(0.95)' },
  { name: 'Vivid',       css: 'saturate(180%) contrast(1.1)' },
  { name: 'Soft',        css: 'brightness(1.1) contrast(0.9) saturate(0.9)' },
  { name: 'Cool',        css: 'hue-rotate(30deg) saturate(1.2)' },
  { name: 'Warm',        css: 'sepia(20%) saturate(1.3) brightness(1.05)' },
  { name: 'Faded',       css: 'opacity(0.88) contrast(0.85) brightness(1.05)' },
  { name: 'Dramatic',    css: 'contrast(1.4) saturate(1.2)' },
  { name: 'Matte',       css: 'contrast(0.85) brightness(1.1) saturate(0.8)' },
  { name: 'Coral',       css: 'hue-rotate(-20deg) saturate(1.3) brightness(1.05)' },
  { name: 'Mint',        css: 'hue-rotate(80deg) saturate(0.9) brightness(1.1)' },
  { name: 'Dreamy',      css: 'brightness(1.15) contrast(0.9) saturate(1.1) blur(0.4px)' },
  { name: 'Lomo',        css: 'contrast(1.5) saturate(1.4) brightness(0.9)' },
  { name: 'Frosty',      css: 'brightness(1.2) saturate(0.7) contrast(0.9)' },
  { name: 'Sunset',      css: 'sepia(30%) hue-rotate(-15deg) saturate(1.4)' },
  { name: 'Neon',        css: 'saturate(2) contrast(1.2) brightness(1.05)' },
  { name: 'Duotone',     css: 'grayscale(50%) sepia(40%) hue-rotate(320deg)' },
  { name: 'Clarity',     css: 'contrast(1.15) sharpen(1)' },
];

const FILTER_SWATCHES = [
  ['#f48fb1','#e91e8c'], ['#808080','#404040'], ['#c8a060','#906030'],
  ['#c09060','#885520'], ['#ff6090','#c00040'], ['#f8d0e0','#e090b0'],
  ['#a0c0ff','#4060d0'], ['#ffd090','#c08020'], ['#e0d8d0','#a09888'],
  ['#303060','#101040'], ['#d0c8b8','#908070'], ['#ff8060','#c04020'],
  ['#80e0a0','#208040'], ['#f0e0ff','#c090e0'], ['#c00000','#600000'],
  ['#d0f0ff','#80c0e0'], ['#ff9060','#c05000'], ['#ff40c0','#8000a0'],
  ['#a060ff','#6020c0'], ['#e0f0ff','#80b0e0'],
];

export default function CameraPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shots = 4, theme = {} } = location.state || {};

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [selectedFilter, setSelectedFilter] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash, setFlash] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [done, setDone] = useState(false);

  const photoHeight = shots === 6 ? 60 : shots === 4 ? 70 : 80;

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError('Camera access denied. Please allow camera access and reload.');
      }
    }
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth || 420;
    canvas.height = video.videoHeight || 315;
    const ctx = canvas.getContext('2d');

    ctx.filter = FILTERS[selectedFilter].css === 'none' ? 'none' : FILTERS[selectedFilter].css;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.92);
  }, [selectedFilter]);

  const runCountdownAndCapture = useCallback((remaining, currentPhotos) => {
    if (remaining.length >= shots) {
      setIsCapturing(false);
      setCountdown(null);
      setCapturedPhotos(remaining);
      setDone(true);
      return;
    }

    let count = 5;
    setCountdown(count);

    const tick = () => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        timerRef.current = setTimeout(tick, 1000);
      } else {
        setCountdown(null);
        setFlash(true);
        setTimeout(() => setFlash(false), 200);

        const dataUrl = captureFrame();
        const updated = [...remaining, dataUrl];
        setCapturedPhotos(updated);

        timerRef.current = setTimeout(() => {
          runCountdownAndCapture(updated, updated);
        }, 800);
      }
    };

    timerRef.current = setTimeout(tick, 1000);
  }, [shots, captureFrame]);

  function handleStart() {
    if (isCapturing) return;
    setCapturedPhotos([]);
    setDone(false);
    setIsCapturing(true);
    runCountdownAndCapture([], []);
  }

  function handleRetake() {
    setCapturedPhotos([]);
    setDone(false);
    setIsCapturing(false);
    setCountdown(null);
  }

  function handleDecorate() {
    navigate('/decorate', { state: { shots, theme, photos: capturedPhotos } });
  }

  function handleBack() {
    navigate('/layouts');
  }

  return (
    <div className="camera">
      <nav className="camera__nav">
        <div className="camera__logo">photobooth</div>
        <div className="camera__back-nav" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to layouts
        </div>
      </nav>

      <div className="camera__body">
        {/* ── Left: Filters ── */}
        <div className="camera__filters">
          <div className="filters__title">Filters</div>
          <div className="filters__list">
            {FILTERS.map((f, i) => (
              <div
                key={i}
                className={`filter-item${selectedFilter === i ? ' active' : ''}`}
                onClick={() => !isCapturing && setSelectedFilter(i)}
              >
                <div className="filter-item__swatch">
                  <div
                    className="filter-item__swatch-inner"
                    style={{
                      filter: f.css,
                      background: `linear-gradient(135deg, ${FILTER_SWATCHES[i][0]} 0%, ${FILTER_SWATCHES[i][1]} 100%)`,
                    }}
                  />
                </div>
                <span className="filter-item__name">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Center: Camera ── */}
        <div className="camera__center">
          {cameraError ? (
            <div className="camera__error">{cameraError}</div>
          ) : (
            <>
              <div className="camera__viewfinder">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ filter: FILTERS[selectedFilter].css }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {countdown !== null && (
                  <div className="camera__countdown">
                    <span className="countdown-number" key={countdown}>{countdown}</span>
                  </div>
                )}
                <div className={`camera__flash${flash ? ' active' : ''}`} />
              </div>

              <div className="camera__shot-progress">
                {Array.from({ length: shots }).map((_, i) => (
                  <div
                    key={i}
                    className={`shot-dot${i < capturedPhotos.length ? ' taken' : ''}${i === capturedPhotos.length && isCapturing ? ' current' : ''}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="camera__controls">
            <button className="camera__btn camera__btn--back" onClick={handleBack}>
              Back
            </button>

            {!done ? (
              <button
                className="camera__btn camera__btn--start"
                onClick={handleStart}
                disabled={isCapturing || !!cameraError}
              >
                {isCapturing ? `Shot ${capturedPhotos.length + 1}/${shots}…` : 'Start'}
              </button>
            ) : (
              <>
                <button className="camera__btn camera__btn--retake" onClick={handleRetake}>
                  Retake
                </button>
                <button className="camera__btn camera__btn--decorate" onClick={handleDecorate}>
                  Decorate ✨
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Strip preview ── */}
        <div className="camera__preview">
          <div className="preview__title">Strip Preview</div>
          <div
            className="preview__strip"
            style={{ background: theme.bg || 'white' }}
          >
            {Array.from({ length: shots }).map((_, i) => (
              <div
                key={i}
                className="preview__slot"
                style={{ height: photoHeight }}
              >
                {capturedPhotos[i] ? (
                  <img src={capturedPhotos[i]} alt={`Shot ${i + 1}`} />
                ) : (
                  <span className="preview__slot-empty">📷</span>
                )}
              </div>
            ))}
            <div className="preview__label">photobooth</div>
          </div>
        </div>
      </div>
    </div>
  );
}
