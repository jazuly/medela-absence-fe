import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserListPage from "./components/userList";
import ProfilePage from "./components/userProfile";
import AbsensePage from "./components/userAbsense";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserListPage />} />
        <Route path="/:userId/profile" element={<ProfilePage />} />
        <Route path="/:userId/absense" element={<AbsensePage />} />
      </Routes>
    </Router>
  );
}