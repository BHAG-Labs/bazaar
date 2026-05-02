import { Routes, Route } from 'react-router';
import PublicLayout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Archive from './pages/Archive';
import IssueDetail from './pages/IssueDetail';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Columnists from './pages/Columnists';
import ColumnistDetail from './pages/ColumnistDetail';
import LegalPage from './pages/LegalPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout variant="public" />}>
        <Route path="/" element={<Landing />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/columnists" element={<Columnists />} />
        <Route path="/columnists/:slug" element={<ColumnistDetail />} />
        <Route path="/issue/:id" element={<IssueDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="/terms" element={<LegalPage kind="terms" />} />
        <Route path="/grievance" element={<LegalPage kind="grievance" />} />
        <Route path="/disclosure" element={<LegalPage kind="disclosure" />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PublicLayout variant="app" />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
