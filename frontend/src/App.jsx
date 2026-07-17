import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import DashboardLayout from './layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Coaching from './pages/Coaching';
import Status from './pages/Status';
import NotFound from './pages/NotFound';

function App() {
  // Shared state keeping prediction payload across routes
  const [predictionData, setPredictionData] = useState(null);

  return (
    <Router>
      {/* Toast Notification Provider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#18181b',
            border: '1px solid #e4e4e7',
            borderRadius: '12px',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
      
      <DashboardLayout>
        <Routes>
          {/* Root Route is the Fintech Landing Page */}
          <Route 
            path="/" 
            element={
              <Landing 
                setPredictionData={setPredictionData} 
              />
            } 
          />
          {/* Assessment Route holds the form inputs */}
          <Route 
            path="/assess" 
            element={
              <Dashboard 
                predictionData={predictionData} 
                setPredictionData={setPredictionData} 
              />
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <Analytics 
                predictionData={predictionData} 
              />
            } 
          />
          <Route 
            path="/coaching" 
            element={
              <Coaching 
                predictionData={predictionData} 
              />
            } 
          />
          <Route 
            path="/status" 
            element={<Status />} 
          />
          <Route 
            path="*" 
            element={<NotFound />} 
          />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
