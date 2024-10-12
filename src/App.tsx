import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ScheduleProvider } from "./context/ScheduleContextProvider";
import Sidebar from "./components/Sidebar";
import EditEventModal from "./components/EditEventModal";
import Calendar from "./components/Calendar";
import CreateEventModal from "./components/CreateEventModal";
import Header from "./components/Header";
import AuthForm from "./pages/Login";
import { NotifyProvider } from "mj-react-form-builder";
import Organization from "./pages/Organization";
import ProfilePage from "./pages/Profile";
import { UserProvider } from "./context/UserContextProvider";
import { AuthProvider } from "./context/AuthProvider";
import JoinOrganization from "./pages/JoinOrganization";

const App = () => {
  return (
    <Router>
      <NotifyProvider>
        <AuthProvider>
          <ScheduleProvider>
            <UserProvider>
              <div className="relative">
                {/* Header */}
                <Header />

                {/* Main Routes */}
                <Routes>
                  <Route path="/login" element={<AuthForm />} />

                  {/* Wrap protected routes with UserProvider */}
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
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/organization"
                    element={<Organization />}
                  />
                  <Route
                    path="/join-organization"
                    element={<JoinOrganization />}
                  />
                </Routes>

                {/* Modals */}
                <EditEventModal />
                <CreateEventModal />
              </div>
            </UserProvider>
          </ScheduleProvider>
        </AuthProvider>
      </NotifyProvider>
    </Router>
  );
};

export default App;
