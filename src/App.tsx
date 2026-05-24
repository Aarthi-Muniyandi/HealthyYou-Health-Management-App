import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import DietPage from './pages/DietPage';
import MedicationsPage from './pages/MedicationsPage';
import RewardsPage from './pages/RewardsPage';
import WorkoutPage from './pages/WorkoutPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {user && <Header />}
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
              <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/diet" element={user ? <DietPage /> : <Navigate to="/login" />} />
              <Route path="/medications" element={user ? <MedicationsPage /> : <Navigate to="/login" />} />
              <Route path="/rewards" element={user ? <RewardsPage /> : <Navigate to="/login" />} />
              <Route path="/workout" element={user ? <WorkoutPage /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
            </Routes>
          </main>
          {user && <Footer />}
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;