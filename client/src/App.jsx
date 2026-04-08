import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import LandingIndex from "./pages/landingIndex";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Explore from "./pages/Explore";
import ViewStory from "./pages/ViewStory";
import DashboardLayout from "./pages/DashboardLayout";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingIndex />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<DashboardLayout />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
          </Route>
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/view/:id" element={<ViewStory />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}