import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthProvider from '../providers/AuthProviders'
import ProtectedRoute from '../providers/ProtectedRoute'
import DashboardNavbar from "./components/DashboardNavbar"
import SideBar from "./components/SideBar"
import Content from "./content/Content"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <ProtectedRoute
                  element={
                    <div className="flex min-h-screen bg-[#F8FAFC]">
                      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                      <div className="flex-1 md:ml-60">
                        <DashboardNavbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                        <div className="mt-20 p-4 md:mt-24 md:px-6">
                          <Content />
                        </div>
                      </div>
                    </div>
                  }
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </>
  )
}

export default App
