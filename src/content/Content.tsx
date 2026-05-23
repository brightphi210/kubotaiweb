import { Route, Routes } from 'react-router-dom'
import Market from '../pages/dashboard/Market'
import Overview from '../pages/dashboard/Overview'

const Content = () => {
  return (
    <>
      <Routes>
        <Route path="dashboard/overview" element={<Overview />} />
        <Route path="dashboard/market" element={<Market />} />
      </Routes>
    </>
  )
}

export default Content
