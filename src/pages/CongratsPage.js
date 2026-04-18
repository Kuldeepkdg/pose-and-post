import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CongratsPage.css';

const CONFETTI_COLORS = [
  '#e91e8c', '#f48fb1', '#ff80ab', '#f9c6d0',
  '#b39ddb', '#80cbc4', '#fff176', '#ffcc02',
];

function Confetti() {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 2,
    }));
  }, []);

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </>
  );
}

export default function CongratsPage() {
  const navigate = useNavigate();

  function handleClose() {
    try { window.close(); } catch {}
    navigate('/');
  }

  return (
    <div className="congrats">
      <Confetti />

      <div className="congrats__card">
        <div className="congrats__icon">🎉</div>

        <h1 className="congrats__title">
          Congratulations!!
        </h1>

        <div className="congrats__divider" />

        <p className="congrats__sub">
          You created a memory.<br />
          Your photo strip has been downloaded!
        </p>

        <div className="congrats__actions">
          <button
            className="congrats__btn congrats__btn--another"
            onClick={() => navigate('/layouts')}
          >
            Take Another 📷
          </button>
          <button
            className="congrats__btn congrats__btn--close"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>

      <p className="congrats__footer">
        Share your photos and tag us @photobooth_io!
      </p>
    </div>
  );
}
