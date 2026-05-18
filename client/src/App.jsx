import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './layouts/Layout'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ProfileEditPage from './pages/ProfileEditPage'
import MatchesPage from './pages/MatchesPage'
import UserDetailPage from './pages/UserDetailPage'
import MessagesPage from './pages/MessagesPage'
import RequestsPage from './pages/RequestsPage'
import ReviewsPage from './pages/ReviewsPage'
import AdminPage from './pages/AdminPage'
import LoadingSpinner from './components/LoadingSpinner'
import { isDemoDisabledPath } from './config/demoMode'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

const DemoRouteGuard = ({ children }) => {
  const location = useLocation()
  if (isDemoDisabledPath(location.pathname)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile/edit" element={<DemoRouteGuard><ProfileEditPage /></DemoRouteGuard>} />
        <Route path="matches" element={<DemoRouteGuard><MatchesPage /></DemoRouteGuard>} />
        <Route path="users/:id" element={<DemoRouteGuard><UserDetailPage /></DemoRouteGuard>} />
        <Route path="messages" element={<DemoRouteGuard><MessagesPage /></DemoRouteGuard>} />
        <Route path="messages/:conversationId" element={<DemoRouteGuard><MessagesPage /></DemoRouteGuard>} />
        <Route path="requests" element={<DemoRouteGuard><RequestsPage /></DemoRouteGuard>} />
        <Route path="reviews" element={<DemoRouteGuard><ReviewsPage /></DemoRouteGuard>} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<DemoRouteGuard><AdminRoute><Layout /></AdminRoute></DemoRouteGuard>}>
        <Route index element={<AdminPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
