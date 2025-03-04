import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PartnerDashboard from './components/dashboard/PartnerDashboard';
import ClientDashboard from './components/dashboard/ClientDashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import VerifyEmail from './components/auth/VerifyEmail';
import FirebaseAction from './components/auth/FirebaseAction';
import AdminLogin from './components/auth/AdminLogin';
import AdminSignup from './components/auth/AdminSignup';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/partner-dashboard" 
          element={
            <PrivateRoute requiredRole="partner">
              <PartnerDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/client-dashboard" 
          element={
            <PrivateRoute requiredRole="client">
              <ClientDashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/partner-activation" element={<VerifyEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/__/auth/action" element={<FirebaseAction />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
