import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './index.css'
import AuthPage from './pages/AuthPage.jsx'
import CreatorDashboard from './pages/CreatorDashboard.jsx'
import CreatorProfile from './pages/CreatorProfile.jsx'
import CreatorsList from './pages/CreatorsList.jsx'
import DonationHistory from './pages/DonationHistory.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import FollowerHome from './pages/FollowerHome.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/creador" element={<CreatorDashboard />} />
        <Route path="/feed" element={<FollowerHome />} />
        <Route path="/creadores" element={<CreatorsList />} />
        <Route path="/creadores/:id" element={<CreatorProfile />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/donaciones" element={<DonationHistory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
