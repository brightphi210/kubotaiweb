import { Route, Routes } from 'react-router-dom'
import Overview from '../pages/dashboard/Overview'

const Content = () => {
  return (
    <>
      <Routes>
        <Route path="dashboard/overview" element={<Overview />} />
      </Routes>
    </>
  )
}

export default Content
