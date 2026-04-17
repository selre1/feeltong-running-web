import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const AuthPage = lazy(() => import('../../pages/Auth'))
const HomePage = lazy(() => import('../../pages/Home'))
const MeetingPage = lazy(() => import('../../pages/Meeting'))
const MyPage = lazy(() => import('../../pages/My'))
const RecordPage = lazy(() => import('../../pages/Record'))
const RunningPage = lazy(() => import('../../pages/Running'))

export default function AppRoutes() {
  const { isAuthenticated } = useAuth()
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route
          element={isAuthenticated ? <Navigate replace to="/home" /> : <AuthPage />}
          path="/auth"
        />
        <Route element={<HomePage />} path="/" />
        <Route element={<HomePage />} path="/home" />
        <Route element={<RunningPage />} path="/running" />
        <Route element={<RecordPage />} path="/record" />
        <Route element={<MeetingPage />} path="/meeting" />
        <Route element={<MyPage />} path="/my" />
        <Route element={<HomePage />} path="*" />
      </Routes>
    </Suspense>
  )
}
