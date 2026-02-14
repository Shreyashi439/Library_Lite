import { Routes, Route, NavLink } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Members from "./pages/Members";
import Reports from "./pages/Reports";
import Populate from "./pages/Populate";


function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>Library Lite</h1>
        <div>
          <NavLink to="/" end>Catalog</NavLink>
          <NavLink to="/members">Members</NavLink>
          <NavLink to="/reports">Reports</NavLink>
          <NavLink to="/populate">Populate</NavLink>
        </div>
      </nav>

      <div className="page">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/members" element={<Members />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/populate" element={<Populate />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
