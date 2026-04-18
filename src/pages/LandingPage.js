import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const STRIP_COLORS = [
  ['#e0a0b5', '#d490a4', '#c88090', '#bc7080'],
  ['#c8a0c0', '#bc90b4', '#b080a8', '#a4709c'],
  ['#a0b8e0', '#90a8d4', '#8098c8', '#7088bc'],
  ['#b0d4a0', '#a0c890', '#90bc80', '#80b070'],
];

function StripDeco({ className, photos, width = 60, height = 50 }) {
  return (
    <div className={`strip-deco ${className}`} style={{ width }}>
      {photos.map((c, i) => (
        <div
          key={i}
          className="strip-deco__slot"
          style={{ width: '100%', height, background: c }}
        />
      ))}
    </div>
  );
}

function StripFloat({ side, width = 56, photoH = 46 }) {
  const colors = side === 'left' ? STRIP_COLORS[0] : STRIP_COLORS[1];
  return (
    <div className={`strip-float strip-float--${side}`}>
      {colors.map((c, i) => (
        <div
          key={i}
          className="strip-float__photo"
          style={{ width, height: photoH, background: `linear-gradient(135deg, ${c} 0%, ${c}aa 100%)` }}
        />
      ))}
      <div className="strip-float__label">photobooth</div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Background strip decorations */}
      <div className="landing__strips">
        <StripDeco className="strip-left-1" photos={STRIP_COLORS[0]} height={44} />
        <StripDeco className="strip-left-2" photos={STRIP_COLORS[2]} width={50} height={38} />
        <StripDeco className="strip-left-3" photos={STRIP_COLORS[1]} width={55} height={40} />
        <StripDeco className="strip-right-1" photos={STRIP_COLORS[3]} width={55} height={42} />
        <StripDeco className="strip-right-2" photos={STRIP_COLORS[0]} height={46} />
        <StripDeco className="strip-right-3" photos={STRIP_COLORS[2]} width={50} height={38} />
      </div>

      {/* Navbar */}
      <nav className="landing__nav">
        <div className="landing__logo">photobooth</div>
        <ul className="landing__nav-links">
          <li><a href="/" className="active">home</a></li>
          <li><a href="#about">about</a></li>
          <li><a href="#contact">contact</a></li>
          <li><a href="/layouts" style={{ color: 'var(--pink-deep)' }}>choose layout</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <div className="landing__hero">
        {/* Decorative floating strips */}
        <StripFloat side="left" />
        <StripFloat side="right" />

        <div className="landing__booth-wrapper">
          {/* Start button on the LEFT */}
          <div className="landing__start-area">
            <p className="landing__tagline">Capture the moment, cherish the magic, relive the love</p>
            <button
              className="landing__start-btn"
              onClick={() => navigate('/layouts')}
              aria-label="Start photobooth"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
              START
            </button>
          </div>

          {/* Booth illustration in center */}
          <div className="landing__booth">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="booth-roof">
                <span>photobooth</span>
              </div>
              <div className="booth-body">
                <div className="booth-curtain-left" />
                <div className="booth-curtain-right" />
                <div className="booth-screen" />
                <div className="booth-lens" />
                <div className="booth-slot" />
                {/* headline overlay */}
                <div className="landing__headline">
                  <span className="landing__year-left">EST</span>
                  <h1>photobooth</h1>
                  <p>Capture the moment, cherish the magic</p>
                  <span className="landing__year-right">2025</span>
                </div>
              </div>
              <div className="booth-base" />
            </div>
          </div>
        </div>
      </div>

      <footer className="landing__footer">
        Share your photos and don't forget to tag us @photobooth_io!
      </footer>
    </div>
  );
}
