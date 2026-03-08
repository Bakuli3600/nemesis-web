import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import VisionShieldInfo from './pages/VisionShieldInfo';
import BreachIntelInfo from './pages/BreachIntelInfo';
import OnionAuditInfo from './pages/OnionAuditInfo';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/deepfakeshield" element={<VisionShieldInfo />} />
        <Route path="/breaches" element={<BreachIntelInfo />} />
        <Route path="/onion-audit" element={<OnionAuditInfo />} />

        {/* Protected Application Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
