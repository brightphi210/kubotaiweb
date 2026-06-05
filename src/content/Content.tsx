import { Route, Routes } from 'react-router-dom'
import About from '../pages/dashboard/About'
import ChangePassword from '../pages/dashboard/ChangePassword'
import Earnings from '../pages/dashboard/Earnings'
import Feedback from '../pages/dashboard/Feedback'
import Friends from '../pages/dashboard/Friend'
import InviteCode from '../pages/dashboard/InviteCode'
import Market from '../pages/dashboard/Market'
import Notification from '../pages/dashboard/Notification'
import Overview from '../pages/dashboard/Overview'
import Profile from '../pages/dashboard/Profile'
import ProfileEdit from '../pages/dashboard/ProfileEdit'
import Tasks from '../pages/dashboard/Task'
import Wallet from '../pages/dashboard/Wallet'
import Ranking from '../pages/dashboard/ranking'

const Content = () => (
  <>
    <Routes>
      <Route path="dashboard/overview" element={<Overview />} />
      <Route path="dashboard/market" element={<Market />} />
      <Route path="dashboard/friends" element={<Friends />} />
      <Route path="dashboard/tasks" element={<Tasks />} />
      <Route path="dashboard/profile" element={<Profile />} />

      {/* ============== NAVBAR ROUTES ============== */}
      <Route path="dashboard/wallet" element={<Wallet />} />
      <Route path="dashboard/ranking" element={<Ranking />} />
      <Route path="dashboard/earnings" element={<Earnings />} />
      <Route path="dashboard/notification" element={<Notification />} />

      {/* ============== OTHER ROUTES ============== */}
      <Route path="dashboard/profile/change-password" element={<ChangePassword />} />
      <Route path="dashboard/profile/invitation-code" element={<InviteCode />} />
      <Route path="dashboard/profile/feedback" element={<Feedback />} />
      <Route path="dashboard/profile/edit" element={<ProfileEdit />} />
      <Route path="dashboard/profile/about" element={<About />} />


    </Routes>
  </>
)

export default Content
