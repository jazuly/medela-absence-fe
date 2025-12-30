import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ProfilePage from "./components/userProfile";
import LoginPage from "./components/userLogin";
import AbsensePage from "./components/userAbsense";
import AuthGuard from "./AuthGuard";
import RootPage from "./RootPage";

export function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthGuard />}>
            <Route path="/" element={<RootPage />} />
            <Route path="/:userId/profile" element={<ProfilePage />} />
            <Route path="/:userId/absense" element={<AbsensePage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}
