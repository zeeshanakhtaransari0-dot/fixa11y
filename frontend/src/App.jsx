import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Report from "./pages/Report";
import Scan from "./pages/Scan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;