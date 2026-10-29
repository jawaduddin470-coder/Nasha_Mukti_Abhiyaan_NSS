import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AwarenessPage } from './pages/AwarenessPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { SupportPage } from './pages/SupportPage';
import { QuizPage } from './pages/QuizPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Scroll to top upon navigating to a new route
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Hidden Administrative Portals (No links in public navigation) */}
            <Route path="/login/superadmin" element={<AdminLoginPage loginType="superadmin" />} />
            <Route path="/login/admin" element={<AdminLoginPage loginType="admin" />} />
            <Route path="/admin/*" element={<AdminDashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />

            {/* Public Institutional Portal */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="awareness" element={<AwarenessPage />} />
              <Route path="activities" element={<ActivitiesPage />} />
              <Route path="events" element={<ActivitiesPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="developers" element={<DevelopersPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </ThemeProvider>
  );
};

export default App;
