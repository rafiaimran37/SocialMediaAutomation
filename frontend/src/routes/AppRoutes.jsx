import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import SchedulePosts from '../pages/SchedulePosts/SchedulePosts'
import AddSchedule from '../pages/AddSchedule/AddSchedule'
import AIGenerator from '../pages/AIGenerator/AIGenerator'
import Topics from '../pages/Topics/Topics'
import ApprovalQueue from '../pages/ApprovalQueue/ApprovalQueue'
import PublishedPosts from '../pages/PublishedPosts/PublishedPosts'
import SocialConnectors from '../pages/SocialConnectors/SocialConnectors'
import Settings from '../pages/Settings/Settings'
import Logs from '../pages/Logs/Logs'
import Profile from '../pages/Profile/Profile'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule-posts" element={<SchedulePosts />} />
        <Route path="/add-schedule" element={<AddSchedule />} />
        <Route path="/schedule-posts/add" element={<AddSchedule />} />
        <Route path="/schedule-posts/edit/:id" element={<AddSchedule />} />
        <Route path="/ai-generator" element={<AIGenerator />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/approval-queue" element={<ApprovalQueue />} />
        <Route path="/published-posts" element={<PublishedPosts />} />
        <Route path="/social-connectors" element={<SocialConnectors />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes