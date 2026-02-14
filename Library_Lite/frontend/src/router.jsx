import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Catalog from "./pages/Catalog/Catalog";
// import Members from "./pages/Members/Members";
// import Reports from "./pages/Reports/Reports";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Catalog />} />
        <Route path="/members" element={<Members />} />
        <Route path="/reports" element={<Reports />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
