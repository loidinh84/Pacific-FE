import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import SpeciesDetail from "./pages/SpeciesDetail";
import SpeciesView3D from "./pages/SpeciesView3D";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
        <Route path="/species/:id/3d" element={<SpeciesView3D />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
