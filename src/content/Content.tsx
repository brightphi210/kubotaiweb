import { Route, Routes } from 'react-router-dom'
import Friends from '../pages/dashboard/Friend'
import Market from '../pages/dashboard/Market'
import Overview from '../pages/dashboard/Overview'
import Profile from '../pages/dashboard/Profile'
import Tasks from '../pages/dashboard/Task'

const Content = () => {
  return (
    <>
      <Routes>
        <Route path="dashboard/overview" element={<Overview />} />
        <Route path="dashboard/market" element={<Market />} />
        <Route path="dashboard/friends" element={<Friends />} />
        <Route path="dashboard/tasks" element={<Tasks />} />
        <Route path="dashboard/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default Content
