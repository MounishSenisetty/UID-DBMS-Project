import PropTypes from 'prop-types';
import { Suspense, useEffect, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { useAuth } from '../../contexts/AuthContext';
import PublicLayout from '../../layouts/PublicLayout';
import AdminLayout from '../../layouts/AdminLayout';
import OfficerLayout from '../../layouts/OfficerLayout';
import ElectorLayout from '../../layouts/ElectorLayout';

import "../../App.css";

import Login from '../../pages/public/Login';
import Signup from '../../pages/public/Signup';
import LiveResults from '../../pages/public/LiveResults';
import NotFound from '../../pages/public/NotFound';

const AdminDashboard = lazy(() => import('../../pages/admin/Dashboard'));
const AdminConstituencies = lazy(() => import('../../pages/admin/Constituencies'));
const AdminPollingStations = lazy(() => import('../../pages/admin/PollingStations'));
const AdminOfficers = lazy(() => import('../../pages/admin/Officers'));
const AdminParties = lazy(() => import('../../pages/admin/Parties'));
const AdminCandidates = lazy(() => import('../../pages/admin/Candidates'));
const AdminResults = lazy(() => import('../../pages/admin/Results'));

// (Uncomment Officer & Elector pages when ready)
const OfficerDashboard = lazy(() => import('../../pages/officer/Dashboard'));
const OfficerElectorVerification = lazy(() => import('../../pages/officer/ElectorVerification'));
const OfficerStationDetails = lazy(() => import('../../pages/officer/StationDetails'));

const ElectorDashboard = lazy(() => import('../../pages/elector/Dashboard'));
const ElectorProfile = lazy(() => import('../../pages/elector/Profile'));
const ElectorVoting = lazy(() => import('../../pages/elector/Voting'));
const ElectorResults = lazy(() => import('../../pages/elector/Results'));

function App() {
  const { currentUser, setCurrentUser, loading } = useAuth();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId && !currentUser) {
      setCurrentUser(userId);
    }
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    const handleOnline = () => toast.success('You are back online');
    const handleOffline = () => toast.error('You are offline. Some features may be unavailable.');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (loading) return <Loader fullScreen />;

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
  };

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Navigate to="/signup" replace />} />
          <Route path="login" element={<Login />} />
          {/* Removed /signup route */}
          {/* <Route path="signup" element={<Signup />} /> */}
          <Route path="signup" element={<Signup />} />
          <Route path="results" element={<LiveResults />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="constituencies" element={<AdminConstituencies />} />
          <Route path="polling-stations" element={<AdminPollingStations />} />
          <Route path="officers" element={<AdminOfficers />} />
          <Route path="parties" element={<AdminParties />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="results" element={<AdminResults />} />
        </Route>

        {/* Demo Admin route without authorization */}
        <Route path="/demo/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="constituencies" element={<AdminConstituencies />} />
          <Route path="polling-stations" element={<AdminPollingStations />} />
          <Route path="officers" element={<AdminOfficers />} />
          <Route path="parties" element={<AdminParties />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="results" element={<AdminResults />} />
        </Route>

        {/* Officer routes */}
        <Route path="/officer" element={
          <ProtectedRoute allowedRoles={['officer', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer']}>
            <OfficerLayout />
          </ProtectedRoute>
        }>
          {/* Future Officer Pages */}
          <Route index element={<OfficerDashboard />} />
          <Route path="verification" element={<OfficerElectorVerification />} />
          <Route path="station" element={<OfficerStationDetails />} />
        </Route>

        {/* Demo Officer route without authorization */}
        <Route path="/demo/officer" element={<OfficerLayout />}>
          <Route index element={<OfficerDashboard />} />
          <Route path="verification" element={<OfficerElectorVerification />} />
          <Route path="station" element={<OfficerStationDetails />} />
        </Route>

        {/* Elector routes */}
        <Route path="/elector" element={
          <ProtectedRoute allowedRoles={['elector']}>
            <ElectorLayout />
          </ProtectedRoute>
        }>
          {/* Future Elector Pages */}
          <Route index element={<ElectorDashboard />} />
          <Route path="profile" element={<ElectorProfile />} />
          <Route path="vote" element={<ElectorVoting />} />
          <Route path="results" element={<ElectorResults />} />
        </Route>

        {/* Demo Elector route without authorization */}
        <Route path="/demo/elector" element={<ElectorLayout />}>
          <Route index element={<ElectorDashboard />} />
          <Route path="profile" element={<ElectorProfile />} />
          <Route path="vote" element={<ElectorVoting />} />
          <Route path="results" element={<ElectorResults />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}

export default App;
