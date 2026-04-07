import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WatchVideos from "./pages/WatchVideos";
import BusinessPlan from "./pages/BusinessPlan";
import Tutorials from "./pages/Tutorials";
import Franchise from "./pages/Franchise";
import Blog from "./pages/Blog";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/watch-videos" element={<WatchVideos />} />
      <Route path="/business-plan" element={<BusinessPlan />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/franchise" element={<Franchise />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;