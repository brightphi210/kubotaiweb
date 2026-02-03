import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Content from "./content/Content"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Content />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
