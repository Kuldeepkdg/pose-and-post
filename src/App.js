import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LayoutsPage from './pages/LayoutsPage';
import CameraPage from './pages/CameraPage';
import DecoratePage from './pages/DecoratePage';
import CongratsPage from './pages/CongratsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/layouts" element={<LayoutsPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/decorate" element={<DecoratePage />} />
        <Route path="/congrats" element={<CongratsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// Added this message to check revert
export default App;
