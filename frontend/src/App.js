import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Communities from "@/pages/Communities";
import CommunityDetail from "@/pages/CommunityDetail";
import CreatorDashboard from "@/pages/CreatorDashboard";
import Membership from "@/pages/Membership";
import About from "@/pages/About";
import Events from "@/pages/Events";
import Careers from "@/pages/Careers";
import CreateCommunity from "@/pages/CreateCommunity";
import { ProtectedRoute, CreatorRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/events" element={<Events />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityDetail />} />
          

// Add this with your other routes
<Route path="/create-community" element={<CreateCommunity />} />
          <Route
            path="/creator-dashboard"
            element={
              <CreatorRoute>
                <CreatorDashboard />
              </CreatorRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
