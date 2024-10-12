import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ScheduleProvider } from "./context/ScheduleContextProvider";
import Sidebar from "./components/Sidebar";
import EditEventModal from "./components/EditEventModal";
import Calendar from "./components/Calendar";
import CreateEventModal from "./components/CreateEventModal";
import Header from "./components/Header";
import AuthForm from "./pages/Login";
import { AuthProvider } from "./helpers/AuthProvider";
import { NotifyProvider } from "mj-react-form-builder";
import RegisterOrganization from "./pages/RegisterOrganization";
import ProfilePage from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <NotifyProvider>
        <AuthProvider>
          <ScheduleProvider>
            <div className="relative">
              {/* Header */}
              <Header />

              {/* Main Routes */}
              <Routes>
                <Route path="/login" element={<AuthForm />} />
                <Route path="/register-organization" element={<RegisterOrganization />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/schedule"
                  element={
                    <div
                      style={{ height: "100vh" }} // Subtract the header height
                      className="flex pt-16" // Ensure padding for the fixed header
                    >
                      <Sidebar />
                      <Calendar />
                    </div>
                  }
                />
              </Routes>

              {/* Modals */}
              <EditEventModal />
              <CreateEventModal />
            </div>
          </ScheduleProvider>
        </AuthProvider>
      </NotifyProvider>
    </Router>
  );
};

export default App;
